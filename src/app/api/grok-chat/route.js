import { executeSQL } from '@/lib/coralSimulator';

export const runtime = 'nodejs'; // Use nodejs environment for full stream support

// In-memory store for rate limiting (persists in Node.js environment)
const rateLimitStore = new Map();

/**
 * Sliding-window rate limiter.
 * Limits prompts to `limit` actions within a rolling `windowMs` timeframe.
 */
function isRateLimited(key, limit = 10, windowMs = 120000) {
  const now = Date.now();
  
  // Dynamic cleanup to prevent memory leaks if store becomes too large
  if (rateLimitStore.size > 1000) {
    for (const [k, tsList] of rateLimitStore.entries()) {
      const active = tsList.filter(ts => now - ts < windowMs);
      if (active.length === 0) {
        rateLimitStore.delete(k);
      } else {
        rateLimitStore.set(k, active);
      }
    }
  }

  if (!rateLimitStore.has(key)) {
    rateLimitStore.set(key, [now]);
    return { limited: false, remaining: limit - 1, resetMs: windowMs };
  }

  const timestamps = rateLimitStore.get(key);
  const validTimestamps = timestamps.filter(ts => now - ts < windowMs);

  if (validTimestamps.length >= limit) {
    const oldestActive = validTimestamps[0];
    const resetMs = windowMs - (now - oldestActive);
    rateLimitStore.set(key, validTimestamps);
    return { limited: true, remaining: 0, resetMs };
  }

  validTimestamps.push(now);
  rateLimitStore.set(key, validTimestamps);
  return {
    limited: false,
    remaining: limit - validTimestamps.length,
    resetMs: windowMs - (now - validTimestamps[0])
  };
}

export async function POST(req) {
  try {
    const { question, profile, servers } = await req.json();

    // 0. AI Rate Limiting check (10 prompts every 2 minutes)
    const rateLimitKey = profile?.id || req.headers.get('x-forwarded-for') || 'anonymous';
    const limitCheck = isRateLimited(rateLimitKey, 10, 120000);

    if (limitCheck.limited) {
      const minutes = Math.floor(limitCheck.resetMs / 60000);
      const seconds = Math.ceil((limitCheck.resetMs % 60000) / 1000);
      const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

      return new Response(
        JSON.stringify({
          error: `Rate limit exceeded. You can only send 10 prompts every 2 minutes. Please try again in ${timeString}.`
        }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = process.env.XAI_API_KEY || process.env.GROK_API_KEY;

    // 1. Gracefully handle missing API key
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "XAI_API_KEY or GROK_API_KEY is not configured in your .env.local file.\n\nPlease configure your environment variables to enable Grok's brain."
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Auto-detect Provider (xAI vs Groq Cloud) based on API Key prefix
    // Groq Cloud keys start with "gsk_"
    const isGroqProvider = apiKey.startsWith("gsk_");
    const providerApiUrl = isGroqProvider 
      ? 'https://api.groq.com/openai/v1/chat/completions' 
      : 'https://api.x.ai/v1/chat/completions';
    const providerModel = isGroqProvider 
      ? 'llama-3.3-70b-versatile' 
      : 'grok-3';
    const providerName = isGroqProvider ? 'Groq Cloud' : 'xAI';

    if (!question) {
      return new Response(
        JSON.stringify({ error: "Question is required." }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Call 1: Generate SQL query based on natural language question
    const systemPromptSQL = `You are Grok, the AI SQL Copilot for the Discord Analyzer platform, powered by Coral.
Coral is a local-first SQL runtime that treats APIs as relational tables.
You translate natural language questions into single, valid SELECT queries compatible with the Coral Simulator.

Available SQL tables (Coral Schema):
1. Table: discord_profile
   Columns: id (VARCHAR), username (VARCHAR), global_name (VARCHAR), email (VARCHAR), locale (VARCHAR)
   Description: Current user's discord profile information.

2. Table: discord_servers
   Columns: id (VARCHAR), name (VARCHAR), owner (INT - 1 if owner, 0 otherwise), member_count (INT), online_count (INT), premium_tier (INT)
   Description: Connected server list.

3. Table: github_commits
   Columns: id (VARCHAR), author (VARCHAR), message (TEXT), date (VARCHAR), additions (INT), deletions (INT)
   Description: Git commit history logs.

4. Table: slack_messages
   Columns: id (VARCHAR), user (VARCHAR), channel (VARCHAR), text (TEXT), timestamp (VARCHAR)
   Description: Chat history archives.

CRITICAL RULES for Coral SQL dialect:
1. ONLY SELECT queries are allowed. NO subqueries, NO aggregations like COUNT(), SUM(), MIN(), MAX(), AVG().
2. The SELECT regex parser requires this EXACT order: SELECT columns FROM table [WHERE ...] [ORDER BY ...] [LIMIT ...].
   Do not add spaces inside keywords or put expressions in WHERE clauses other than a simple column name, operator, and value.
3. Supported operators in WHERE clause: =, !=, >, <. Only single conditions (no AND/OR operators).
4. Supported tables are: discord_profile, discord_servers, github_commits, slack_messages.
5. JOIN is ONLY supported between discord_servers and github_commits on the 'id' column!
   Format: SELECT server_name, commit_author, commit_msg FROM discord_servers JOIN github_commits ON discord_servers.id = github_commits.id
   Do NOT attempt to write general JOINs other than this exact pattern!
6. Respond with ONLY the SQL query in a clean text format. Do NOT wrap it in backticks, markdown, or explain it. Just output the query string directly.
`;

    const sqlResponse = await fetch(providerApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: providerModel,
        messages: [
          { role: 'system', content: systemPromptSQL },
          { role: 'user', content: question }
        ],
        temperature: 0.1,
        stream: false
      })
    });

    if (!sqlResponse.ok) {
      const errText = await sqlResponse.text();
      return new Response(
        JSON.stringify({ error: `${providerName} API call failed: ${errText}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sqlData = await sqlResponse.json();
    let generatedSQL = sqlData.choices?.[0]?.message?.content?.trim() || "";

    // Clean up SQL generation (remove markdown code fences if present)
    generatedSQL = generatedSQL
      .replace(/```sql/gi, '')
      .replace(/```/g, '')
      .replace(/^\s*;?\s*/, '')
      .replace(/\s*;?\s*$/, '')
      .trim();

    // 3. Execute SQL query through local Coral simulator
    const dataContext = { profile, servers };
    const sqlResult = executeSQL(generatedSQL, dataContext);

    // 4. Call 2: Generate natural language analysis, stream response
    const systemPromptAnalysis = `You are Grok, the witty AI First Mate of the Discord Analyzer platform.
Your job is to write a highly engaging, witty, and insightful 2-4 sentence analysis based on the SQL query results.
Be conversational, slightly playful, and use specific numbers/names from the data.
Refer to "Coral" as the query engine that powered your search.

If the SQL query failed or returned an error, explain the issue wittily, suggest what went wrong, and guide the user on what to ask instead.
`;

    let userAnalysisContent = "";
    if (sqlResult.error) {
      userAnalysisContent = `The user asked: "${question}"
I generated the following SQL:
\`\`\`sql
${generatedSQL}
\`\`\`
But executing it returned this error: "${sqlResult.error}"
Please explain this error wittily and tell the user what they should ask instead.`;
    } else {
      userAnalysisContent = `The user asked: "${question}"
I generated and ran this SQL:
\`\`\`sql
${generatedSQL}
\`\`\`
Here are the query results (JSON format):
${JSON.stringify(sqlResult.rows, null, 2)}

Provide your witty 2-4 sentence analysis.`;
    }

    const analysisResponse = await fetch(providerApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: providerModel,
        messages: [
          { role: 'system', content: systemPromptAnalysis },
          { role: 'user', content: userAnalysisContent }
        ],
        temperature: 0.7,
        stream: true
      })
    });

    if (!analysisResponse.ok) {
      const errText = await analysisResponse.text();
      return new Response(
        JSON.stringify({ error: `${providerName} Analysis call failed: ${errText}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Transform streaming response
    const reader = analysisResponse.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Enqueue SQL query and result metadata as a single JSON line header
        const metadata = {
          sql: generatedSQL,
          count: sqlResult.count || 0,
          executionTimeMs: sqlResult.executionTimeMs || 0,
          rows: sqlResult.rows || [],
          error: sqlResult.error || null
        };
        controller.enqueue(encoder.encode(`__METADATA__:${JSON.stringify(metadata)}\n`));

        try {
          let buffer = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop(); // keep last incomplete line

            for (const line of lines) {
              const cleanLine = line.trim();
              if (!cleanLine) continue;
              if (cleanLine === 'data: [DONE]') continue;
              if (cleanLine.startsWith('data: ')) {
                try {
                  const parsed = JSON.parse(cleanLine.slice(6));
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    controller.enqueue(encoder.encode(content));
                  }
                } catch (err) {
                  // Ignore JSON parse errors for stream metadata lines
                }
              }
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (err) {
    console.error("Grok-Chat endpoint error:", err);
    return new Response(
      JSON.stringify({ error: `Internal Server Error: ${err.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
