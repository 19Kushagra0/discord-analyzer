/**
 * Coral SQL Runtime Simulator
 * Acts as the client-side/in-memory SQL translation layer for the Discord Analyzer hackathon console.
 * Parses and executes SQL queries against live Discord and simulated external sources (e.g., GitHub, Slack).
 */

export function executeSQL(query, dataContext) {
  if (!query) return { error: "Query is empty." };

  const cleanQuery = query.replace(/\s+/g, ' ').trim();
  
  // Basic SELECT parsing regex
  const selectRegex = /^SELECT\s+(.*?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.*?))?(?:\s+ORDER\s+BY\s+(.*?))?(?:\s+LIMIT\s+(\d+))?$/i;
  const match = cleanQuery.match(selectRegex);

  if (!match) {
    return {
      error: "Syntax Error: Coral only supports SELECT queries in the playground at this time.\nExample: SELECT name, member_count FROM discord_servers WHERE member_count > 5 ORDER BY member_count DESC LIMIT 5"
    };
  }

  const columnsStr = match[1].trim();
  const tableName = match[2].trim().toLowerCase();
  const whereClause = match[3] ? match[3].trim() : null;
  const orderByClause = match[4] ? match[4].trim() : null;
  const limitValue = match[5] ? parseInt(match[5].trim(), 10) : null;

  // Database Tables Definition
  const tables = {
    discord_profile: dataContext.profile ? [dataContext.profile] : [],
    discord_servers: dataContext.servers || [],
    github_commits: [
      { id: "c1a89b", author: "19Kushagra0", message: "initial commit - nextjs base structure", date: "2026-05-20", additions: 1420, deletions: 12 },
      { id: "e4d29f", author: "19Kushagra0", message: "added firebase connection and oauth routes", date: "2026-05-22", additions: 480, deletions: 45 },
      { id: "f2c1b8", author: "Antigravity-AI", message: "feat: rich bot data enrichment for personal servers", date: "2026-05-29", additions: 924, deletions: 110 },
      { id: "d9e8f1", author: "19Kushagra0", message: "ui: polished sidebar active states and color schemas", date: "2026-05-30", additions: 84, deletions: 5 }
    ],
    slack_messages: [
      { id: "msg_901", user: "Kushagra", channel: "hackathon-team", text: "Let's use Coral for our agent data layer!", timestamp: "2026-05-28 10:15:30" },
      { id: "msg_902", user: "Mentor-AI", channel: "general", text: "Coral is great for doing cross-source joins over APIs", timestamp: "2026-05-28 11:20:00" },
      { id: "msg_903", user: "Kushagra", channel: "hackathon-team", text: "Just joined the Discord Oauth data, building the query console now.", timestamp: "2026-05-30 02:04:12" }
    ]
  };

  if (!tables[tableName]) {
    return {
      error: `Table '${tableName}' not found.\nTo query new tables, define source spec mappings in 'coral-config.yaml'.\nSupported tables: ${Object.keys(tables).join(', ')}`
    };
  }

  let sourceRows = [...tables[tableName]];

  // 1. Process JOINs (Mocked specifically for demonstrating Coral's power)
  // Check if there is an explicit mention of a JOIN in the query string
  if (cleanQuery.toUpperCase().includes("JOIN")) {
    // Specifically handle discord_servers + github_commits as a showpiece cross-source join
    if (tableName === "discord_servers" && cleanQuery.toLowerCase().includes("github_commits")) {
      sourceRows = sourceRows.flatMap(server => 
        tables.github_commits.map(commit => ({
          server_name: server.name,
          member_count: server.member_count,
          commit_id: commit.id,
          commit_author: commit.author,
          commit_msg: commit.message
        }))
      );
    }
  }

  // 2. Process WHERE clause
  if (whereClause) {
    try {
      sourceRows = sourceRows.filter(row => {
        // Parse basic key operator value (e.g. member_count > 5)
        const parts = whereClause.match(/(\w+)\s*(=|>|<|!=)\s*(['"]?.*?['"]?)$/);
        if (!parts) return true; // Skip filtering if parsing fails

        const field = parts[1];
        const operator = parts[2];
        let val = parts[3].replace(/['"]/g, ''); // strip quotes

        // Cast value if appropriate
        if (!isNaN(val)) val = Number(val);
        if (val === 'true') val = true;
        if (val === 'false') val = false;

        const rowVal = row[field];

        switch (operator) {
          case '=': return rowVal === val;
          case '!=': return rowVal !== val;
          case '>': return Number(rowVal) > Number(val);
          case '<': return Number(rowVal) < Number(val);
          default: return true;
        }
      });
    } catch (e) {
      return { error: `Failed to evaluate WHERE clause: ${e.message}` };
    }
  }

  // 3. Process ORDER BY clause
  if (orderByClause) {
    const parts = orderByClause.split(' ');
    const field = parts[0];
    const direction = parts[1] ? parts[1].toUpperCase() : 'ASC';

    sourceRows.sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      if (typeof valA === 'string') {
        return direction === 'DESC' ? valB.localeCompare(valA) : valA.localeCompare(valB);
      } else {
        return direction === 'DESC' ? Number(valB) - Number(valA) : Number(valA) - Number(valB);
      }
    });
  }

  // 4. Process LIMIT clause
  if (limitValue !== null) {
    sourceRows = sourceRows.slice(0, limitValue);
  }

  // 5. Project SELECT columns
  let finalColumns = [];
  if (columnsStr === '*') {
    if (sourceRows.length > 0) {
      finalColumns = Object.keys(sourceRows[0]);
    } else {
      finalColumns = ['id'];
    }
  } else {
    finalColumns = columnsStr.split(',').map(c => c.trim());
  }

  const finalRows = sourceRows.map(row => {
    const newRow = {};
    finalColumns.forEach(col => {
      newRow[col] = row[col] !== undefined ? row[col] : null;
    });
    return newRow;
  });

  return {
    columns: finalColumns,
    rows: finalRows,
    count: finalRows.length,
    executionTimeMs: (Math.random() * 5 + 1).toFixed(2)
  };
}
