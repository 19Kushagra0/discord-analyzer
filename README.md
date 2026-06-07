<div align="center">

```
  ██████╗ ██████╗ ██████╗  █████╗ ██╗     ███████╗████████╗ █████╗ ████████╗███████╗
 ██╔════╝██╔═══██╗██╔══██╗██╔══██╗██║     ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
 ██║     ██║   ██║██████╔╝███████║██║     ███████╗   ██║   ███████║   ██║   ███████╗
 ██║     ██║   ██║██╔══██╗██╔══██║██║     ╚════██║   ██║   ██╔══██║   ██║   ╚════██║
 ╚██████╗╚██████╔╝██║  ██║██║  ██║███████╗███████║   ██║   ██║  ██║   ██║   ███████║
  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
```

### **AI-Powered Discord Analytics Data Layer**
*Built for the Pirates of the Coral-bean Hackathon*

[![Live Demo](https://img.shields.io/badge/Live-Demo-2ea44f?style=for-the-badge)](#)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## Description
CoralStats is an intelligent Discord analytics dashboard that turns raw community data into actionable insights—powered by a custom local-first SQL engine called **Coral** and an AI co-pilot called **Grok**. Instead of manually digging through Discord's developer portal, CoralStats lets you ask questions about your server in plain English and get SQL-backed answers in seconds. It demonstrates the powerful concept of treating live API responses (like Discord servers or GitHub commits) as relational database tables that can be queried and joined on the fly.

## Key Features
- **Natural Language to SQL Pipeline:** Ask questions in plain English (e.g., "Which of my servers has the most members?") and watch the AI translate it into a valid SQL query, execute it, and stream back an insightful answer.
- **Coral SQL Engine:** A custom-built, in-memory SQL runtime that parses `SELECT` queries, applies `WHERE`, `ORDER BY`, `LIMIT`, and cross-source `JOIN` operations across live API data arrays.
- **Enterprise-Grade Identity Dashboard:** Full profile decoding, server feature flag mapping, role hierarchy visualization, and permission bitfield decoding.
- **Streaming LLM Responses:** Integrated with Next.js Edge APIs and `ReadableStream` to stream text character-by-character with zero layout shift.
- **Self-Healing Demo Mode:** A complete, no-login experience backed by seeded Firestore data so users can explore the dashboard without authenticating.

## Tech Stack

| Technology | Purpose & Justification |
|------------|-------------------------|
| **Next.js 16 (App Router)** | Robust server-side rendering and streamlined API routes for handling Discord OAuth and streaming LLM responses. |
| **Tailwind CSS v4** | Rapid UI styling with a modern, glassmorphism-heavy design system. |
| **xAI Grok / Groq LLaMA 3.3 70B** | Powers the dual-stage AI pipeline. Chosen for blazing-fast inference speeds to handle SQL generation and conversational analysis seamlessly. |
| **Firebase / NextAuth.js** | Manages JWT-based sessions securely without a database query on every render, while persisting session data in Firestore. |
| **Node.js Memory Maps** | Implements a robust, sliding-window rate-limiting algorithm directly in server memory. |

## AI to SQL Architecture

Instead of relying on standard vector search (RAG) which can hallucinate hard numbers, CoralStats utilizes an exact-match SQL translation architecture. 

1. **Schema Injection:** The user's prompt is combined with the strict Coral SQL Schema (e.g., defining the `discord_profile`, `discord_servers`, and `github_commits` tables).
2. **SQL Generation (Stage 1):** The LLM acts as a code generator, strictly outputting a Coral-compatible `SELECT` query.
3. **Coral Execution:** The custom `coralSimulator.js` engine intercepts the string query. Using regex and array mapping, it parses and executes the `JOIN`, `WHERE`, and `ORDER BY` operations on the raw JSON API responses.
4. **Data Synthesis (Stage 2):** The resulting JSON array from the local database is injected back into a new LLM context window. 
5. **Streaming Output:** The LLM streams a witty, conversational analysis of the exact SQL row data directly to the client interface.

### Pipeline Flow

```mermaid
graph TD;
    A[User Natural Language Query] --> B[LLM Stage 1: SQL Generation];
    B -->|SELECT ... FROM ...| C[Coral SQL Simulator];
    D[Discord API Data] --> C;
    E[Mocked GitHub/Slack Data] --> C;
    C -->|Filtered JSON Rows| F[LLM Stage 2: Analysis Generation];
    F -->|ReadableStream| G[Next.js Client UI];
```

## Performance & Rate Limiting
To ensure the two-stage LLM pipeline doesn't suffer from API abuse or out-of-memory errors, the architecture includes:
- **Sliding-Window Rate Limiter:** A custom Node.js `Map()` algorithm that accurately restricts users to 10 prompts per 2-minute rolling window, ensuring much fairer distribution than fixed-window logic.
- **Auto-Garbage Collection:** The rate limiter automatically cleans up stale timestamps once the internal map exceeds 1,000 keys, preventing memory leaks on the Next.js server.
- **Stream Multiplexing:** Execution metadata (like the query runtime and parsed SQL) is passed down the wire instantly as a `__METADATA__` JSON string before the LLM token stream begins.

## Screenshots / Demo

*(Replace with actual screenshots or a GIF walkthrough of the dashboard and Coral chat in action)*

`![Dashboard View](./public/demo-dashboard.gif)`
`![Coral Query in Action](./public/demo-coral.png)`

## Getting Started

Follow these steps to run CoralStats locally.

```bash
# 1. Clone the repository
git clone https://github.com/19Kushagra0/discord-analyzer.git
cd discord-analyzer

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
```

Update `.env.local` with your credentials:
```env
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_BOT_TOKEN=your_bot_token

NEXTAUTH_SECRET=your_random_string
NEXTAUTH_URL=http://localhost:3000

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Set either XAI or GROQ key
XAI_API_KEY=your_xai_key
GROK_API_KEY=your_groq_key
```

```bash
# 4. Start the development server
npm run dev
```
Navigate to `http://localhost:3000` to see the app in action.

## Why I Built This
Community managers often fly blind, relying on anecdotal feelings to gauge server health, or digging through massive developer portals to find simple ID associations. I built CoralStats to prove out the "Coral Data Layer" concept: treating external APIs as relational tables. Combining this structural strictness with LLM inference creates a highly reliable analytics bot that avoids the common hallucination pitfalls of standard chat interfaces.

## Challenges & What I Learned
- **Building a Local SQL Engine:** Writing the regex parsing logic in `coralSimulator.js` to properly identify `WHERE`, `ORDER BY`, and `JOIN` clauses without relying on massive external libraries taught me a lot about syntax tree construction and query optimization.
- **Two-Stage Latency:** Connecting to an LLM twice (once for SQL, once for analysis) introduced latency. I optimized this by switching to Groq's high-speed inference for LLaMA 3.3, keeping total response times well under standard acceptable thresholds.
- **Stream Hydration:** Passing the actual generated SQL string alongside the streaming text chunks was challenging; I learned to multiplex the `ReadableStream` by sending a JSON metadata header before yielding the text tokens.

## Roadmap
- [ ] **Expanded Coral Dialect:** Support `GROUP BY` and standard SQL aggregate functions (`COUNT()`, `MAX()`).
- [ ] **Webhook Integration:** Real-time server event streaming via Discord websockets.
- [ ] **External Source Configs:** A `coral-config.yaml` interface for binding to external MongoDB/Postgres databases to run cross-cloud joins from the browser.

## Contact
**Kushagra**  
- **LinkedIn:** [linkedin.com/in/yourprofile](#)  
- **Portfolio:** [yourportfolio.dev](#)  
- **Email:** [hello@yourdomain.com](mailto:hello@yourdomain.com)  
- **GitHub:** [@19Kushagra0](https://github.com/19Kushagra0)
