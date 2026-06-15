# TechStack AI: Technical Decision Copilot

TechStack AI is a production-quality, multi-agent software architecture analysis dashboard designed to help engineers and founders choose the optimal technology stack for their applications.

Instead of a generic chatbot interface, TechStack AI runs a **6-stage sequential agent pipeline** backed by Google Gemini AI and Exa AI search, rendering comparative blueprints, live topology diagrams, cost scaling simulations, and downloadable configuration boilerplates.

## 🛠️ Architecture Overview

The project is structured as a mono-repo hosting both the backend REST API (Express + TypeScript) and the client (React + Vite + TypeScript + Tailwind CSS). The production-ready design allows the compiled backend server to serve the React assets directly, supporting hosting on a single Heroku Web Dyno.

```
/
├── backend/                  # Express REST API (TypeScript)
│   ├── src/
│   │   ├── config/           # Environment configuration
│   │   ├── utils/            # DB client, Gemini/Exa API wrappers
│   │   ├── types/            # TypeScript data models
│   │   ├── agents/           # Six agent files + Mock generator
│   │   ├── services/         # Orchestrator pipeline
│   │   ├── controllers/      # Express controllers
│   │   └── routes/           # REST API routes
│   ├── tsconfig.json
│   └── package.json
├── frontend/                 # React Single Page App (Vite + Tailwind)
│   ├── src/
│   │   ├── components/       # UI, Dashboard, Results, Terminal, Diagrams
│   │   ├── App.tsx           # Route router manager
│   │   ├── index.css         # Styling & Custom design tokens
│   │   └── types.ts          # Frontend data models
│   ├── index.html
│   └── package.json
├── package.json              # Root-level shortcuts & postbuild scripts
├── Procfile                  # Heroku runtime configuration
└── .gitignore                # Git untracked folders index
```

---

## 🚦 Multi-Agent Pipeline Stages

1. **Stage 1: Requirements Agent** parses the description to extract structural requirements (realtime parameters, storage metrics, security requirements).
2. **Stage 2: Research Agent** executes semantic queries via Exa AI API to search for similar companies, engineering blogs, and real architectural patterns.
3. **Stage 3: Architecture Agent** weighs the requirements and research to design 3 stacks side-by-side: *Recommended*, *Cost-Optimized*, and *Bleeding-Edge*.
4. **Stage 4: Cost Agent** calculates monthly running costs across three traffic tiers (1k, 10k, 100k users) and exports coefficients.
5. **Stage 5: Risk Agent** identifies technical debt, scaling limits, vendor lock-in, and security vulnerabilities with severity scores.
6. **Stage 6: Recommendation Agent** makes the final selection, describes tradeoffs, maps out a multi-phase scaling roadmap, and outputs `docker-compose.yml` code.

---

## ⚡ Setup & Local Installation

### Prerequisites

- **Node.js** (v18.x or higher recommended)
- **NPM** (v9.x or higher)
- **Git**

### Installation Steps

1. Clone or open the repository workspace directory.
2. Install all dependencies across the project (root, backend, and frontend) using the shortcut script:
   ```bash
   npm run install-all
   ```
3. Create a local environment variables file in the root folder (named `.env`):
   ```bash
   # Create a file named '.env' and add:
   PORT=5000
   NODE_ENV=development
   
   # Optional: Add keys for real AI results.
   # If left blank, the app will run in zero-config Mock Database/AI mode.
   EXA_API_KEY=your_exa_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   DATABASE_URL=postgres://your_user:your_password@localhost:5432/your_db
   ```

### Running the Application

Launch both servers (backend API and Vite frontend client) concurrently:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser to interact with the dashboard.

---

## 📡 Production-Ready features

- **Zero-Config Mock Mode**: If `GEMINI_API_KEY` or `EXA_API_KEY` is not present, the app automatically switches to generating realistic, high-fidelity mock blueprints. The app is fully interactive, functional, and ready to demonstrate immediately.
- **Graceful DB Fallback**: If `DATABASE_URL` is omitted, the backend saves analyses to an in-memory database store, preventing server crashes.
- **Live Console Streams**: The dashboard features an animated command-line log feed, showing the agents executing specific technical tasks in real time.
- **Dynamic Cost Simulator**: Users can adjust a MAU slider and database read/write intensity to calculate infrastructure costs dynamically.
- **Interactive Topologies**: Visual SVG maps dynamically change to illustrate data routes based on the selected architecture stack.
- **Code Boilerplate Exporter**: Downloadable Docker Compose configurations are compiled by the AI based on the recommended system blueprint.
