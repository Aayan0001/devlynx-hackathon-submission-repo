import { 
  AnalysisRequest, 
  RequirementsAnalysis, 
  ResearchResults, 
  ArchitectureOption, 
  CostEstimate, 
  Risk, 
  Recommendation,
  Citation
} from '../types';

function parseProjectType(request: AnalysisRequest): 'realtime' | 'ai' | 'general' {
  const desc = request.description.toLowerCase();
  if (desc.includes('uber') || desc.includes('ride') || desc.includes('map') || desc.includes('game') || desc.includes('realtime') || desc.includes('multiplayer') || desc.includes('iot')) {
    return 'realtime';
  } else if (desc.includes('ai') || desc.includes('saas') || desc.includes('openai') || desc.includes('llm') || desc.includes('seo') || desc.includes('automation') || desc.includes('rag')) {
    return 'ai';
  }
  return 'general';
}

export function generateMockRequirements(request: AnalysisRequest): RequirementsAnalysis {
  const type = parseProjectType(request);
  const usersCount = parseInt(request.expectedUsers.replace(/,/g, '')) || 50000;

  if (type === 'realtime') {
    return {
      productType: "Real-time Location/Event-driven Application",
      expectedUsers: `${request.expectedUsers} active monthly users with high concurrent socket connections.`,
      realTimeRequirements: "Under 100ms message/position syncing latency. Persistent WebSocket or gRPC connections.",
      storageRequirements: "High-write spatial database indexing (e.g., Redis Geospatial, PostGIS) + time-series tracking.",
      aiRequirements: "Low-latency route optimization models or gaming matching matchmaking logic.",
      securityRequirements: "TLS encryption, secure geolocation sharing controls, OAuth2 user verification.",
      scalabilityRequirements: "Horizontally scalable connection nodes (stateless socket gateways), read replicas for user histories."
    };
  } else if (type === 'ai') {
    return {
      productType: "AI-Powered SaaS / Automation Engine",
      expectedUsers: `${request.expectedUsers} active monthly users, batch API requests.`,
      realTimeRequirements: "Server-Sent Events (SSE) for streaming model text/result feeds.",
      storageRequirements: "Vector storage for embeddings (Pinecone/pgvector) + relational metadata DB.",
      aiRequirements: "LLM integration (Gemini/OpenAI), token limits optimization, vector search RAG retrieval.",
      securityRequirements: "API key rate limiting, input prompt sanitization (jailbreak defense), encrypted key storage.",
      scalabilityRequirements: "Asynchronous task queue workers (Celery/BullMQ) to process long-running AI operations, model load balancing."
    };
  } else {
    return {
      productType: "Dynamic Multi-user Marketplace / Web App",
      expectedUsers: `${request.expectedUsers} active monthly users, standard HTTP request lifecycle.`,
      realTimeRequirements: "WebSockets for notifications and transactional order updates.",
      storageRequirements: "ACID-compliant relational database (PostgreSQL) + file storage for assets (AWS S3).",
      aiRequirements: "Personalization recommendations engine, automated listing moderation.",
      securityRequirements: "PCI-DSS compliance (Stripe integration), CSRF tokens, strict JWT authorization flows.",
      scalabilityRequirements: "Global Content Delivery Network (CDN) for assets, database connection pooling, auto-scaling web dynos."
    };
  }
}

export function generateMockResearch(request: AnalysisRequest, citations: Citation[]): ResearchResults {
  const type = parseProjectType(request);

  if (type === 'realtime') {
    return {
      similarApplications: ["Uber Marketplace", "Lyft Ride Matcher", "Discord WebSocket Gateways", "PubNub Infrastructure"],
      caseStudies: [
        "Uber's transition from Python to Go for routing microservices to handle high socket concurrency.",
        "Figma's multiplayer engine architecture: syncing canvas data via WebSockets and CRDTs."
      ],
      bestPractices: [
        "Isolate stateful socket servers from stateless HTTP REST API controllers.",
        "Implement a Redis Pub/Sub cluster to handle messaging between distributed socket nodes."
      ],
      citations: citations
    };
  } else if (type === 'ai') {
    return {
      similarApplications: ["Jasper AI Content Platform", "Copy.ai SaaS", "ChatPDF RAG Engine", "V0 UI Generator"],
      caseStudies: [
        "OpenAI Dev Day Case Studies: Architecting streaming responses with SSE to lower perceived latency.",
        "Upstash Redis caching patterns for LLM prompts to decrease OpenAI API costs by 35%."
      ],
      bestPractices: [
        "Always implement prompt caching and request deduplication.",
        "Decouple heavy LLM generation from the HTTP thread using background task queues."
      ],
      citations: citations
    };
  } else {
    return {
      similarApplications: ["Airbnb Marketplace", "Stripe Connect Platforms", "Shopify Storefronts", "Slack Team Workspaces"],
      caseStudies: [
        "Airbnb's migration to service-oriented architecture to reduce database connection congestion.",
        "Stripe's developer APIs: using idempotent requests to prevent double-charging on network failure."
      ],
      bestPractices: [
        "Use Redis cache for frequently read, rarely changed catalogue items.",
        "Configure database connection pooling with pgBouncer to survive spikes."
      ],
      citations: citations
    };
  }
}

export function generateMockArchitecture(request: AnalysisRequest): ArchitectureOption[] {
  const type = parseProjectType(request);

  if (type === 'realtime') {
    return [
      {
        id: "arch_rec",
        name: "Recommended: Hybrid Event-Driven Stack",
        frontend: "React + Vite (TypeScript), Tailwind CSS, Socket.io-client for dynamic coordinates rendering.",
        backend: "Node.js (Express) + TypeScript for HTTP routes, separate Go (Gorilla WebSockets) service for real-time traffic handling.",
        database: "PostgreSQL (PostGIS extension for mapping) + Redis Cluster (geospatial indexes and pub/sub caching).",
        authentication: "JWT Auth (stateful validation backed by Redis blacklist block).",
        hosting: "Heroku Private Space (Express backend & Go gateway run as separate Dynos), Heroku Postgres.",
        aiIntegrations: "Custom route planning modules hosted on AWS SageMaker (invoked via REST API).",
        caching: "Redis for active user states, session cache, and fast geofence coordinates lookup.",
        monitoring: "Datadog for system metrics, LogDNA for consolidated logs, Sentry for frontend error tracking.",
        pros: ["Very low latency (<50ms socket sync)", "High database write efficiency", "Clear isolation of scaling issues"],
        cons: ["Increased complexity with two codebases", "Higher initial hosting cost"],
        scalabilityMetric: 9,
        timeToMarketMetric: 6,
        operationalSimplicityMetric: 5,
        budgetFriendlinessMetric: 6,
        hiringEaseMetric: 7
      },
      {
        id: "arch_cost",
        name: "Cost-Optimized: Serverless WebSockets Stack",
        frontend: "React + Vite, Tailwind CSS, AWS Amplify socket client.",
        backend: "AWS API Gateway (WebSocket APIs) routing directly to AWS Lambda serverless handlers.",
        database: "DynamoDB (Global tables, using geo-hash keys for local queries).",
        authentication: "AWS Cognito User Pools.",
        hosting: "AWS Serverless (S3 bucket for frontend, API Gateway, DynamoDB pay-per-request).",
        aiIntegrations: "Precompiled light routing algorithm running locally inside Lambda function.",
        caching: "DynamoDB Accelerator (DAX) or local node cache.",
        monitoring: "AWS CloudWatch.",
        pros: ["Zero base cost (scales to zero)", "No server management required", "Incredibly cost-effective under low traffic"],
        cons: ["Potential cold start latency spikes", "AWS Vendor lock-in", "DynamoDB geospatial queries are difficult to write"],
        scalabilityMetric: 8,
        timeToMarketMetric: 7,
        operationalSimplicityMetric: 6,
        budgetFriendlinessMetric: 9,
        hiringEaseMetric: 6
      },
      {
        id: "arch_modern",
        name: "Bleeding-Edge: Elixir/Phoenix Realtime Stack",
        frontend: "React + Vite connected directly to Elixir channel endpoints.",
        backend: "Elixir + Phoenix Framework (OTP actor model for managing persistent connections).",
        database: "CockroachDB (distributed global transactions) + Redis.",
        authentication: "Auth0 authentication integration.",
        hosting: "Fly.io (deployed in multi-region nodes close to users).",
        aiIntegrations: "Python Flask service running on modal.com for real-time model queries.",
        caching: "Mnesia (Elixir's built-in distributed database) + Redis.",
        monitoring: "Prometheus + Grafana with Phoenix LiveDashboard.",
        pros: ["Flawless scalability with Erlang VM", "Handles millions of connections with low memory footprint", "High fault-tolerance"],
        cons: ["Steep learning curve", "Very difficult to hire Elixir developers", "Fewer third-party library integrations"],
        scalabilityMetric: 10,
        timeToMarketMetric: 4,
        operationalSimplicityMetric: 4,
        budgetFriendlinessMetric: 7,
        hiringEaseMetric: 3
      }
    ];
  } else if (type === 'ai') {
    return [
      {
        id: "arch_rec",
        name: "Recommended: Next.js + Vector Edge Stack",
        frontend: "React + Vite, Tailwind CSS, Lucide Icons, Markdown processors for structured LLM outputs.",
        backend: "Node.js (Express) + TypeScript backend, BullMQ task coordinator, Redis for job states.",
        database: "PostgreSQL (pgvector extension) + Pinecone Vector Database.",
        authentication: "Clerk Auth (pre-built UI, custom JWT claims).",
        hosting: "Heroku (standard-1x Dynos for Express, worker Dynos for BullMQ processing), Pinecone Cloud.",
        aiIntegrations: "Google Gemini API / OpenAI API with prompt engineering templates and rate limiting controllers.",
        caching: "Redis (Upstash/Heroku Redis) for prompt-response caching.",
        monitoring: "Langfuse (LLM analytics/latency tracking), Sentry, Winston Logger.",
        pros: ["Very clean separations of long AI tasks", "Low cost with pgvector/Pinecone", "Excellent prompt latency metrics"],
        cons: ["Requires background workers setup", "Pinecone dependency"],
        scalabilityMetric: 8,
        timeToMarketMetric: 8,
        operationalSimplicityMetric: 7,
        budgetFriendlinessMetric: 7,
        hiringEaseMetric: 8
      },
      {
        id: "arch_cost",
        name: "Cost-Optimized: Single Instance SQLite Stack",
        frontend: "React + Vite, Tailwind CSS, simple UI components.",
        backend: "Node.js + Express backend (runs AI calls asynchronously inside simple array memory queue).",
        database: "PostgreSQL (storing vectors as simple float arrays in flat tables).",
        authentication: "Simple Local JWT + Express cookies.",
        hosting: "Heroku Basic Dyno (runs backend and local cache on a single instance).",
        aiIntegrations: "Free-tier Gemini AI API calls with aggressive local caching of duplicate prompts.",
        caching: "In-memory LRU Cache (node-cache).",
        monitoring: "Basic express logging middleware.",
        pros: ["Extremely cheap (<$10/mo)", "Single system codebase", "Very simple to deploy and test"],
        cons: ["Server queue blocks if traffic spikes", "No dedicated vector search index"],
        scalabilityMetric: 4,
        timeToMarketMetric: 9,
        operationalSimplicityMetric: 9,
        budgetFriendlinessMetric: 10,
        hiringEaseMetric: 9
      },
      {
        id: "arch_modern",
        name: "Bleeding-Edge: Serverless Agentic Stack",
        frontend: "Next.js App Router (React Server Components), Tailwind, Radix UI.",
        backend: "Python FastAPI (running LangChain/LangGraph agent frameworks) on serverless Cloud Run.",
        database: "Supabase (PostgreSQL + pgvector) + Qdrant Cloud Vector Database.",
        authentication: "Supabase Auth (Row Level Security enabled).",
        hosting: "Vercel (Frontend) + Supabase (Database) + GCP Cloud Run (Python Agents).",
        aiIntegrations: "Multi-agent framework (Gemini, Claude 3.5 Sonnet, and local models via Ollama router).",
        caching: "Momento Serverless Cache.",
        monitoring: "Phoenix (Arize) tracing for Agent DAG structures.",
        pros: ["Support complex agent workflows", "Highest search accuracy with Qdrant", "Fully elastic scaling"],
        cons: ["Very high infrastructure complexity", "Difficult to debug agent loops", "Cold starts"],
        scalabilityMetric: 9,
        timeToMarketMetric: 5,
        operationalSimplicityMetric: 3,
        budgetFriendlinessMetric: 5,
        hiringEaseMetric: 5
      }
    ];
  } else {
    return [
      {
        id: "arch_rec",
        name: "Recommended: Standard Three-Tier Stack",
        frontend: "React + Vite (TypeScript), Tailwind CSS UI library (shadcn/ui style).",
        backend: "Node.js (Express) + TypeScript server structured with MVC layers.",
        database: "PostgreSQL (relational user schemas, listings, and transaction ledger) + Redis.",
        authentication: "Auth0 or Passport.js (JWT authentication token cookies).",
        hosting: "Heroku Web Dyno (React client bundle is compiled and served statically from Express).",
        aiIntegrations: "Optional: OpenAI API for automated product listing categories categorization.",
        caching: "Redis for hot catalog query caching and dynamic user session storage.",
        monitoring: "New Relic for server telemetry, Sentry for error logging.",
        pros: ["Standard stack with massive talent pool", "Solid relational ACID transactions", "Highly predictable scaling"],
        cons: ["Requires manual database scaling later", "Standard template (nothing fancy)"],
        scalabilityMetric: 8,
        timeToMarketMetric: 8,
        operationalSimplicityMetric: 8,
        budgetFriendlinessMetric: 7,
        hiringEaseMetric: 10
      },
      {
        id: "arch_cost",
        name: "Cost-Optimized: Jamstack Firebase Stack",
        frontend: "React + Vite, Tailwind CSS.",
        backend: "Firebase Cloud Functions (serverless endpoint triggers).",
        database: "Cloud Firestore (NoSQL document store).",
        authentication: "Firebase Authentication.",
        hosting: "Firebase Hosting + Firestore Cloud Database.",
        aiIntegrations: "Firebase Extensions (Google Cloud Translation / Image Resizing).",
        caching: "Firestore local caching SDK.",
        monitoring: "Google Analytics & Firebase Crashlytics.",
        pros: ["Zero server setup", "Free tier covers up to 10k users", "Instant frontend hosting global deployment"],
        cons: ["Vendor lock-in to Firebase suite", "Complex transactional queries are difficult in Firestore"],
        scalabilityMetric: 8,
        timeToMarketMetric: 9,
        operationalSimplicityMetric: 9,
        budgetFriendlinessMetric: 8,
        hiringEaseMetric: 8
      },
      {
        id: "arch_modern",
        name: "Bleeding-Edge: Rust + WASM Stack",
        frontend: "React + Vite compile with WebAssembly modules for heavy frontend computing.",
        backend: "Rust (Axum framework) using async multi-threaded runtime.",
        database: "ScyllaDB (highly performant Cassandra clone written in C++) + Redis.",
        authentication: "OAuth2 authentication gateways.",
        hosting: "Docker containers on AWS ECS Fargate.",
        aiIntegrations: "Native Rust bindings to Hugging Face models.",
        caching: "Redis cluster.",
        monitoring: "OpenTelemetry exporter + Prometheus.",
        pros: ["Incredibly fast execution speed", "Extremely low memory footprint", "High security guarantees"],
        cons: ["Very slow development speeds", "Rust talent is expensive and rare", "High library complexity"],
        scalabilityMetric: 10,
        timeToMarketMetric: 3,
        operationalSimplicityMetric: 4,
        budgetFriendlinessMetric: 8,
        hiringEaseMetric: 2
      }
    ];
  }
}

export function generateMockCost(request: AnalysisRequest): CostEstimate {
  const type = parseProjectType(request);

  let hostingFactor = 0.05;
  let databaseFactor = 0.08;
  let aiFactor = 0.12;

  if (type === 'realtime') {
    hostingFactor = 0.15; // Socket servers require RAM/Persistent connections
    databaseFactor = 0.10; // High writes spatial index
    aiFactor = 0.05;
  } else if (type === 'ai') {
    hostingFactor = 0.06;
    databaseFactor = 0.07;
    aiFactor = 0.35; // Heavy LLM token consumption
  }

  // Base calculations
  const calcTiers = (users: number) => {
    const hosting = Math.max(15, Math.round(users * hostingFactor * 0.1));
    const database = Math.max(20, Math.round(users * databaseFactor * 0.1));
    const ai = type === 'ai' ? Math.max(10, Math.round(users * aiFactor * 0.5)) : Math.round(users * aiFactor * 0.1);
    return {
      hostingCost: hosting,
      databaseCost: database,
      aiCost: ai,
      totalCost: hosting + database + ai
    };
  };

  return {
    userTier1k: calcTiers(1000),
    userTier10k: calcTiers(10000),
    userTier100k: calcTiers(100000),
    costFormulaCoefficients: {
      hostingFactor,
      databaseFactor,
      aiFactor
    }
  };
}

export function generateMockRisks(request: AnalysisRequest): Risk[] {
  const type = parseProjectType(request);

  if (type === 'realtime') {
    return [
      {
        name: "WebSocket Connection Congestion",
        type: "Scalability",
        severity: "High",
        description: "As concurrency grows, Node.js single-threaded event loop can get blocked by high-frequency socket serialization.",
        mitigation: "Deploy a Redis Pub/Sub cluster and split traffic using a load balancer across multiple Node/Go stateless gateway processes."
      },
      {
        name: "Geospatial Index Write Bottleneck",
        type: "Technical Debt",
        severity: "Medium",
        description: "Frequent database updates of active coordinates (e.g. every 3 seconds) will lead to high disk write utilization in PostgreSQL.",
        mitigation: "Route coordinate streams to Redis Geo commands in-memory first, and persist to PostgreSQL only at the end of the session."
      },
      {
        name: "Real-time Data Leakage",
        type: "Security",
        severity: "Medium",
        description: "Leaking location streams of passengers or gamers to unauthorized socket channels.",
        mitigation: "Implement token-based channel authorization. Verify user permissions on every WebSocket join event."
      }
    ];
  } else if (type === 'ai') {
    return [
      {
        name: "LLM API Rate Limiting & Outages",
        type: "Vendor Lock-in",
        severity: "High",
        description: "Complete dependency on external LLM APIs (Gemini/OpenAI) introduces risk of rate limits, latency variance, and vendor API changes.",
        mitigation: "Implement a gateway pattern that automatically retries failed requests and can fallback to alternate models."
      },
      {
        name: "Prompt Injection and Security Exploit",
        type: "Security",
        severity: "High",
        description: "Attackers can bypass prompt guidelines, injecting queries to expose internal system instructions or exceed usage bounds.",
        mitigation: "Strict input sanitization, length limits, and utilizing LLM guardrail APIs to filter queries before processing."
      },
      {
        name: "High Token Generation Billing",
        type: "Scalability",
        severity: "Medium",
        description: "Uncapped user interactions or nested agent loops can generate millions of tokens, leading to budget overruns.",
        mitigation: "Implement user-level budget caps, cache common prompts using Redis, and limit the maximum length of generated outputs."
      }
    ];
  } else {
    return [
      {
        name: "Database Connection Depletion",
        type: "Scalability",
        severity: "High",
        description: "Each active Express server connection consumes PostgreSQL connections. Under heavy traffic, this will crash the DB.",
        mitigation: "Configure pgBouncer for connection pooling and enable Redis read-replicas for catalog pages."
      },
      {
        name: "SQL Injection on Dynamic Filtering",
        type: "Security",
        severity: "High",
        description: "Unsanitized product searches or filter criteria can lead to direct database leakage or deletion.",
        mitigation: "Utilize TypeORM/Prisma or raw parameterized SQL queries exclusively. Never concatenate strings for query building."
      },
      {
        name: "Coupled Monolithic Frontend & API",
        type: "Technical Debt",
        severity: "Low",
        description: "Serving assets directly from the API dyno adds CPU overhead and blocks the API thread under static file loads.",
        mitigation: "Serve client static bundles through a CDN (Cloudflare) or upload them to Heroku's automated asset edge."
      }
    ];
  }
}

export function generateMockRecommendation(request: AnalysisRequest, architectures: ArchitectureOption[]): Recommendation {
  const type = parseProjectType(request);
  const rec = architectures.find(a => a.id === 'arch_rec') || architectures[0];

  const dockerCompose = `version: '3.8'

services:
  app:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - DATABASE_URL=postgres://postgres:postgres@db:5432/techstack
      - EXA_API_KEY=\${EXA_API_KEY}
      - GEMINI_API_KEY=\${GEMINI_API_KEY}
    depends_on:
      - db
      - redis

  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: techstack
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
`;

  const readme = `# TechStack Blueprint: ${request.description.substring(0, 40)}...

This boilerplate is generated automatically for your stack: **${rec.name}**.

## Getting Started

1. Set up your environment variables:
   \`\`\`bash
   cp .env.example .env
   # Add your API keys: EXA_API_KEY, GEMINI_API_KEY
   \`\`\`

2. Boot the services using Docker Compose:
   \`\`\`bash
   docker-compose up --build
   \`\`\`

3. The REST API will be available at \`http://localhost:5000\` and the static React bundle will be served.
`;

  if (type === 'realtime') {
    return {
      chosenArchitectureName: rec.name,
      rationale: "Selected the Event-Driven Stack because geolocation/multiplayer projects demand instant syncing (<100ms) that standard HTTP REST APIs cannot deliver. Using Go or WebSockets for connections avoids blocking Node's main thread, and Redis provides the spatial storage speeds needed for high-frequency coordinate operations.",
      tradeoffs: "While highly performant, this increases developer complexity. Maintaining separate Go socket services and handling distributed states across Redis and PostgreSQL takes longer to build and requires specialized developers.",
      scalingPath: "Phase 1: Start with a single Heroku web dyno running Express + WebSockets. Phase 2: Split socket logic to a dedicated Go dyno. Phase 3: Add Redis clusters and database read-replicas. Phase 4: Deploy multiple socket gateway dynos behind an AWS Network Load Balancer.",
      dockerComposeBoilerplate: dockerCompose,
      boilerplateReadme: readme
    };
  } else if (type === 'ai') {
    return {
      chosenArchitectureName: rec.name,
      rationale: "Selected Next.js + Vector Edge Stack. AI SaaS projects require token efficiency and async processing because LLM API calls take 2-10 seconds to generate. Isolating heavy prompts to background workers via BullMQ protects the Express main thread from timeouts, while Pinecone/pgvector allows semantic similarity indexing.",
      tradeoffs: "Using a dedicated Vector DB like Pinecone adds external dependencies. pgvector is simpler to manage in a single DB but doesn't scale as easily for high-dimensional semantic lookups. Caching prompts reduces costs but limits dynamic, fresh results.",
      scalingPath: "Phase 1: Deploy a single Express API instance with pgvector for local vector search. Phase 2: Add Redis caching for duplicate prompts. Phase 3: Spin up separate Heroku background worker dynos to process BullMQ task queues. Phase 4: Migrate database vectors to Pinecone/Qdrant Cloud.",
      dockerComposeBoilerplate: dockerCompose,
      boilerplateReadme: readme
    };
  } else {
    return {
      chosenArchitectureName: rec.name,
      rationale: "Selected the Standard Three-Tier Stack. For typical marketplaces or database-driven SaaS applications, standard PostgreSQL handles relational database transactions with absolute safety (ACID). Node/Express provides a unified ecosystem with abundant library wrappers (Stripe, Auth0) and the largest talent pool.",
      tradeoffs: "This stack does not support heavy real-time operations out of the box. Scaling database writes requires sharding or indexing optimization, rather than serverless scale-to-zero capabilities.",
      scalingPath: "Phase 1: Deploy single Express/React monolithic dyno with Heroku Postgres. Phase 2: Add Redis catalog cache. Phase 3: Implement database read-replicas. Phase 4: Move frontend files to a global CDN (Cloudflare) to relieve dyno resource congestion.",
      dockerComposeBoilerplate: dockerCompose,
      boilerplateReadme: readme
    };
  }
}
