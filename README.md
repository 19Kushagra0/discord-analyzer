# CoralStats: Discord AI Analyzer

**CoralStats** is an intelligent community command center built for the **Pirates of the Coral-bean Hackathon**. 

It solves a massive problem for community builders: *guessing why your Discord server is dying.* By utilizing the **Coral Data Layer**, CoralStats securely fetches your community metrics, while an **AI Community Manager** acts in real-time to tell you exactly why engagement dropped and how to fix it.

---

## 🚀 What We're Building

We are building a Next.js-powered dashboard that integrates tightly with Discord communities. It is designed to act as an "AI Community Command Center" where community managers can:
- Securely fetch high-fidelity data via custom **Coral APIs**.
- Track live metrics such as member growth, message volume, and token usage.
- Run live evaluations and receive AI-driven "Smart Alerts" (e.g., detecting engagement drops, identifying token rate limits).
- Monitor live activities (prompt deployments, dataset processing) through an integrated event feed.

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** CSS Modules (Dark mode, glassmorphism, responsive grids)
- **Icons:** [Lucide React](https://lucide.dev/)
- **AI Integrations:** Vercel AI SDK
- **Data Layer:** Coral Data Layer
- **Database / Auth:** Supabase

---

## ✅ What Has Been Completed So Far

Currently, we have fully designed and implemented the **Frontend Architecture & UI**. The frontend has been meticulously crafted for high performance, accessibility, and a premium "wow" factor using raw CSS Modules to ditch heavy utility frameworks.

### 1. The Landing Page (`/`)
- A visually striking entry point featuring radial background gradients and modern typography.
- Clear value proposition highlighting the AI manager and Coral Data Layer integration.
- Fully responsive navigation bar and a beautifully styled macOS-like mockup window previewing the dashboard.

### 2. The Authentication Flow (`/login`)
- A clean, centered login card with custom shadows and hover states.
- Dedicated "Continue with Discord" integration point.
- Client-side Next.js `<Link>` routing for instant, zero-reload navigation back to the homepage.

### 3. The AI Dashboard Command Center (`/dashboard`)
A highly complex and interactive data dashboard featuring:
- **Sidebar & Header (`Meridian`):** Collapsible sidebar layout with a custom search command bar.
- **System Status Bar:** Real-time indicator for API, Models, Evals, and Webhook health.
- **Quick Action Rail:** One-click access to playgrounds, logs, and new prompt creations.
- **Live Metrics Strip:** Beautiful CSS-only sparkline charts tracking Requests, Latency, and Eval Pass Rates.
- **Activity Feed:** A scrolling, live-updating timeline of system events, prompt deployments, and rate limit warnings.
- **Resource Usage:** Progress bars visualizing API Requests, Token Generation, and Eval Runs against monthly limits.

### 4. Technical Refactoring & Architecture
- **Performance:** Migrated away from Tailwind CSS to lean, focused CSS Modules.
- **Accessibility:** Semantic HTML implementation, ensuring buttons and links are compliant with screen readers.
- **Routing:** Deep integration of Next.js client-side routing to eliminate page reloads and hydration mismatches.

---

## 🔜 Next Steps
- Implement **Discord OAuth** via Supabase.
- Wire up the **Coral Data Layer** to pull live server metrics.
- Integrate the **Vercel AI SDK** to populate the "Smart Alerts" and activity feeds dynamically.
