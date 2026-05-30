<div align="center">

```
  ██████╗ ██████╗ ██████╗  █████╗ ██╗     ███████╗████████╗ █████╗ ████████╗███████╗
 ██╔════╝██╔═══██╗██╔══██╗██╔══██╗██║     ██╔════╝╚══██╔══╝██╔══██╗╚══██╔══╝██╔════╝
 ██║     ██║   ██║██████╔╝███████║██║     ███████╗   ██║   ███████║   ██║   ███████╗
 ██║     ██║   ██║██╔══██╗██╔══██║██║     ╚════██║   ██║   ██╔══██║   ██║   ╚════██║
 ╚██████╗╚██████╔╝██║  ██║██║  ██║███████╗███████║   ██║   ██║  ██║   ██║   ███████║
  ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝   ╚═╝   ╚══════╝
```

### **Stop guessing why your Discord server is dying.**
*An AI-powered community command center built for the Pirates of the Coral-bean Hackathon.*

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin_SDK-orange?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Discord OAuth](https://img.shields.io/badge/Discord-OAuth2-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.com/developers/docs/topics/oauth2)
[![Grok AI](https://img.shields.io/badge/AI-Grok%20%2F%20Groq-00d2ff?style=flat-square)](https://x.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

</div>

---

## 🧠 What Is CoralStats?

**CoralStats** is an intelligent Discord analytics dashboard that turns your raw community data into actionable insights — powered by a custom local-first SQL engine called **Coral** and an AI co-pilot called **Grok**.

Instead of manually digging through Discord's developer portal, CoralStats lets you:
- Ask questions about your server **in plain English** and get SQL-backed answers in seconds
- Visualize your **Discord profile, owned servers, channel structure, roles, and member activity**
- Run **cross-source SQL joins** across Discord APIs and simulated external databases (GitHub commits, Slack messages) — all through the browser

> *Built as a hackathon project demonstrating the Coral Data Layer concept: treating any API or database as a relational SQL table.*

---

## ✨ Feature Overview

### 🔐 Authentication & Security
- **Discord OAuth2** login via [NextAuth.js](https://next-auth.authjs.dev/) with scopes for `identify`, `email`, and `guilds`
- Session stored as a **JWT** (no database query on every render)
- Sessions persisted through **Firebase Firestore** via `@auth/firebase-adapter`
- **Server-side route protection** on all dashboard pages — unauthenticated users are instantly redirected to `/login` before React renders anything
- **Demo Mode** — a complete, no-login experience backed by seeded Firestore data

### 🌊 Coral SQL Console
The star of the show. **Coral** is a local-first SQL runtime built into this app that treats **live API responses as relational database tables**.

```sql
-- Ask your Discord data anything, in SQL:
SELECT name, member_count, online_count
FROM discord_servers
WHERE member_count > 1000
ORDER BY member_count DESC
LIMIT 5

-- Cross-source JOIN: Discord + Git history
SELECT server_name, commit_author, commit_msg
FROM discord_servers JOIN github_commits
ON discord_servers.id = github_commits.id
```

**Available Coral Tables:**

| Table | Source | Columns |
|-------|--------|---------|
| `discord_profile` | Discord API `/users/@me` | `id`, `username`, `global_name`, `email`, `locale` |
| `discord_servers` | Discord API `/users/@me/guilds` | `id`, `name`, `owner`, `member_count`, `online_count`, `premium_tier` |
| `github_commits` | Simulated Git history | `id`, `author`, `message`, `date`, `additions`, `deletions` |
| `slack_messages` | Simulated chat logs | `id`, `user`, `channel`, `text`, `timestamp` |

The Coral Simulator (`/src/lib/coralSimulator.js`) parses SQL, applies `WHERE`, `ORDER BY`, `LIMIT`, and even `JOIN` entirely in-memory — no external query engine needed.

### 🤖 Grok AI Chat (Powered by xAI / Groq)
The **Grok Chat** tab inside the Coral SQL Console is a two-stage AI pipeline:

```
User Question (natural language)
        ↓
[Stage 1] AI (Grok / Llama-3) → generates Coral-compatible SQL
        ↓
[Coral Runtime] executes SQL against live Discord data
        ↓
[Stage 2] AI (Grok / Llama-3) → streams a witty, data-driven analysis
        ↓
Streamed response rendered live in chat UI
```

- **Dual-provider support**: auto-detects `XAI_API_KEY` (Grok-3) or `GROK_API_KEY` (Groq Cloud `gsk_…` → LLaMA 3.3 70B)
- **Streaming responses** via the ReadableStream API — text appears character by character
- **Expandable SQL blocks** — each Grok response shows the exact SQL it generated, with a collapsible results table
- **Rate limiting**: 10 prompts per user per 2-minute sliding window (server-side, in-memory, zero external dependency)

### 📊 Identity Dashboard (`/dashboard`)
Your full Discord profile decoded:
- **Profile card** with avatar, banner, accent color, display name, and username
- **Account Details**: Email, Discord Snowflake ID (with exact creation date decoded from the ID), account age, locale, Nitro tier
- **Security Status**: MFA (2FA) status, email verification status — both displayed as color-coded health cards
- **Discord Badges**: Decodes all `public_flags` bitfields into human-readable badges (Staff, Bug Hunter, HypeSquad, Early Supporter, Active Developer, etc.)
- **Connected Servers Grid**: All Discord servers the user is in, with server icons and owner status

### 👑 Personal Server Deep-Dive (`/personal-servers`)
For every server you **own**, CoralStats pulls rich data via the Discord Bot API:

- **Server card** with banner gradient, icon, creation date, age, and server ID
- **Live member / online / boost counts** (via `?with_counts=true` API flag)
- **Full permissions decoder**: Reads the 64-bit permission bitfield and decodes all 40+ Discord permissions, grouped by category (🔴 Danger, 🟡 Management, 🟠 Member Controls, 🔵 Voice, 🟢 Text, ⚪ General)
- **Server Features**: Decodes all Discord feature flags (`COMMUNITY`, `VANITY_URL`, `ANIMATED_ICON`, `PARTNERED`, etc.)
- **Role visualization**: Color-coded role chips sorted by hierarchy, with dynamically computed RGBA colors from role hex codes
- **Channel Explorer**: Full categorized channel list (Text, Voice, Forum, Announcement, Stage, Thread) — grouped by parent category, just like Discord's sidebar
- **🔥 Top Active Members**: Real-time leaderboard built by scanning the last 100 messages across up to 5 text channels, counting per-author message totals

### 🎭 Demo Mode
No Discord account? No problem. Click **"Continue in Demo Mode"** on the login page to explore the full dashboard using richly seeded Firestore data:

- **"Captain Blackbeard"** — a vintage high-privilege Discord profile with Nitro, MFA, Partnered Server Owner badge, and Early Supporter badge
- **3 owned servers**: 🏴‍☠️ Pirates of Coral-bean (14,200 members, Level 3 boost), 👾 Retro Arcade (6,500 members), ☕ Developers Anonymous
- Full role hierarchies, channel listings, and member engagement leaderboards
- A fully functional Coral SQL Console and Grok AI Chat backed by the demo data

The demo data engine (`/src/lib/seedDemoData.js`) is **self-healing** — if the Firestore `demo_data` collection is missing, it re-seeds itself automatically on the next page visit.

---

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.js                        # Landing page
│   ├── (auth)/
│   │   └── login/page.jsx             # Login page (Discord OAuth + Demo Mode)
│   ├── (discord)/
│   │   ├── dashboard/page.jsx         # Identity Dashboard (server component)
│   │   ├── personal-servers/page.jsx  # Personal Server Deep-Dive (server component)
│   │   └── coral-query/
│   │       ├── page.jsx               # Coral Console shell (server component)
│   │       └── ClientConsole.jsx      # SQL editor + Grok Chat (client component)
│   └── api/
│       ├── auth/[...nextauth]/route.js # NextAuth Discord provider + Firestore adapter
│       └── grok-chat/route.js         # Grok AI two-stage pipeline + rate limiter
├── lib/
│   ├── coralSimulator.js              # Coral SQL runtime (in-memory)
│   ├── firebase.js                    # Firebase client SDK
│   ├── firebase-admin.js              # Firebase Admin SDK (server-side Firestore)
│   └── seedDemoData.js                # Self-healing demo data seeding engine
├── components/
│   ├── Sidebar.jsx                    # Collapsible navigation sidebar
│   ├── Header.jsx                     # Top bar with hamburger menu
│   ├── ErrorModal.jsx                 # Reusable error modal component
│   ├── DemoModal.jsx                  # Demo mode entry modal
│   ├── Icons.js                       # Lucide React icon re-exports
│   └── ...                            # Other utility components
└── styles/
    ├── landing.module.css
    ├── login.module.css
    ├── dashboard.module.css
    ├── sidebar.module.css
    └── coral.module.css
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Discord application (OAuth2 credentials + a bot token)
- A Firebase project (Firestore enabled)
- An xAI or Groq Cloud API key

### 1. Clone the repository
```bash
git clone https://github.com/19Kushagra0/discord-analyzer.git
cd discord-analyzer
npm install
```

### 2. Configure environment variables
Create a `.env.local` file in the root:

```env
# Discord OAuth (from discord.com/developers)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_BOT_TOKEN=your_discord_bot_token

# NextAuth
NEXTAUTH_SECRET=any_long_random_string
NEXTAUTH_URL=http://localhost:3000

# Firebase (Service Account JSON fields)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# AI Provider (choose one)
XAI_API_KEY=your_xai_key       # For Grok-3 (x.ai)
# OR
GROK_API_KEY=gsk_your_groq_key # For LLaMA 3.3 70B (Groq Cloud)
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components) |
| **Styling** | CSS Modules (dark mode, glassmorphism, responsive grids) |
| **Auth** | [NextAuth.js 4](https://next-auth.authjs.dev/) + Discord OAuth2 |
| **Database** | [Firebase Firestore](https://firebase.google.com/) (via Admin SDK) |
| **AI** | [xAI Grok-3](https://x.ai/) / [Groq Cloud LLaMA 3.3 70B](https://groq.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Rate Limiting** | In-memory sliding-window algorithm (Node.js) |
| **Data Layer** | Coral SQL Simulator (custom, built in-house) |

---

## 🌊 About Coral

> *"Coral is a local-first SQL runtime that treats APIs as relational tables."*

Coral is the conceptual heart of this project. The idea is simple but powerful: **every API endpoint is a database table**. Instead of writing `fetch('/api/discord/servers')`, you write:

```sql
SELECT name, member_count FROM discord_servers WHERE owner = 1
```

Coral takes care of fetching the data, parsing it, filtering it, sorting it, and returning structured rows — just like a real SQL database would. The Grok AI layer speaks Coral's SQL dialect natively, making it possible to ask questions like *"Which of my servers has the most online members?"* and get a real, data-backed answer in seconds.

This project implements a **Coral Simulator** that runs entirely in the browser/server memory. A production Coral implementation would bind to real APIs, databases, and file systems through a `coral-config.yaml` spec file.

---

## 🤖 Grok AI Rate Limiting

To prevent API abuse, Grok Chat implements a **sliding-window rate limiter**:
- **Limit**: 10 prompts per user every 2 minutes
- **Key**: Discord User ID (falls back to IP address for demo/anonymous users)
- **Algorithm**: Sliding window (not fixed-window) — more accurate and fairer
- **Response**: `429 Too Many Requests` with a human-friendly countdown: `Please try again in 1m 45s`
- **Memory management**: Auto-cleans expired entries if the store grows beyond 1,000 keys

---

## 🔜 Roadmap

- [ ] Webhook integration for real-time server event streaming
- [ ] Natural language alert engine ("Notify me when member count drops below 1,000")
- [ ] Coral config YAML binding to real external databases
- [ ] Multi-server comparison dashboard
- [ ] Export reports as PDF / CSV

---

<div align="center">

Built with ⚓ for the **Pirates of the Coral-bean Hackathon**

*"Stop guessing. Start analyzing."*

</div>
