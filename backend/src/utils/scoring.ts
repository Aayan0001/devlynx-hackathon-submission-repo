import { ArchitectureOption, ArchitectureScores, BenchmarkSimilarity } from '../types';

export interface Benchmark {
  name: string;
  frontend: string[];
  backend: string[];
  database: string[];
  caching: string[];
  hosting: string[];
}

export const BENCHMARKS: Benchmark[] = [
  {
    name: "Uber",
    frontend: ["React", "Native", "Swift", "Kotlin", "Socket.io"],
    backend: ["Go", "Java", "Node.js", "Python", "gRPC"],
    database: ["PostgreSQL", "ScyllaDB", "Cassandra", "PostGIS"],
    caching: ["Redis", "Memcached"],
    hosting: ["AWS", "Bare Metal", "Private Cloud"]
  },
  {
    name: "Airbnb",
    frontend: ["React", "Redux", "TypeScript"],
    backend: ["Ruby on Rails", "Java", "Node.js"],
    database: ["PostgreSQL", "MySQL"],
    caching: ["Redis", "Memcached"],
    hosting: ["AWS", "EC2"]
  },
  {
    name: "Stripe",
    frontend: ["React", "TypeScript", "Flow"],
    backend: ["Ruby", "Go", "Java", "Scala"],
    database: ["PostgreSQL", "MongoDB"],
    caching: ["Redis"],
    hosting: ["AWS"]
  },
  {
    name: "Notion",
    frontend: ["React", "TypeScript", "Next.js"],
    backend: ["Node.js", "Express", "TypeScript"],
    database: ["PostgreSQL"],
    caching: ["Redis"],
    hosting: ["AWS"]
  },
  {
    name: "Linear",
    frontend: ["React", "TypeScript", "Electron"],
    backend: ["Node.js", "TypeScript", "GraphQL"],
    database: ["PostgreSQL"],
    caching: ["Redis"],
    hosting: ["AWS"]
  },
  {
    name: "Shopify",
    frontend: ["React", "React Native", "TypeScript"],
    backend: ["Ruby on Rails", "Go"],
    database: ["MySQL", "PostgreSQL"],
    caching: ["Redis"],
    hosting: ["Cloudflare", "Google Cloud", "AWS"]
  }
];

/**
 * Scores an architecture option out of 100 based on scale.
 */
export function scoreArchitecture(
  arch: ArchitectureOption, 
  userScale: number
): ArchitectureScores {
  // Compute individual dimensions out of 100
  const scalability = arch.scalabilityMetric * 10;
  
  // Cost: higher budgetFriendlinessMetric is better (cheaper).
  const cost = arch.budgetFriendlinessMetric * 10;
  
  // Reliability: combinations of operationalSimplicity and scalability.
  const reliability = Math.round(arch.operationalSimplicityMetric * 4 + arch.scalabilityMetric * 6);
  
  // Speed: higher timeToMarketMetric is better.
  const speed = arch.timeToMarketMetric * 10;

  // Let's calculate weights based on the user scale:
  // For small scale (e.g. <= 10k users): Speed (40%), Cost (30%), Reliability (20%), Scalability (10%)
  // For medium scale (e.g. 10k - 100k): Speed (20%), Cost (25%), Reliability (25%), Scalability (30%)
  // For large scale (e.g. > 100k): Speed (10%), Cost (15%), Reliability (35%), Scalability (40%)
  let wSpeed = 0.4, wCost = 0.3, wReliability = 0.2, wScalability = 0.1;
  if (userScale > 10000 && userScale <= 100000) {
    wSpeed = 0.2; wCost = 0.25; wReliability = 0.25; wScalability = 0.3;
  } else if (userScale > 100000) {
    wSpeed = 0.1; wCost = 0.15; wReliability = 0.35; wScalability = 0.4;
  }

  const finalScore = Math.round(
    scalability * wScalability +
    cost * wCost +
    reliability * wReliability +
    speed * wSpeed
  );

  return {
    scalability,
    cost,
    reliability,
    speed,
    finalScore
  };
}

/**
 * Calculates keyword similarity between an option and a benchmark.
 */
export function calculateBenchmarkSimilarity(
  arch: ArchitectureOption,
  benchmark: Benchmark
): number {
  let matches = 0;
  let total = 0;

  const archText = `${arch.frontend} ${arch.backend} ${arch.database} ${arch.caching} ${arch.hosting}`.toLowerCase();

  const checkMatches = (items: string[]) => {
    items.forEach(item => {
      total++;
      if (archText.includes(item.toLowerCase())) {
        matches++;
      }
    });
  };

  checkMatches(benchmark.frontend);
  checkMatches(benchmark.backend);
  checkMatches(benchmark.database);
  checkMatches(benchmark.caching);
  checkMatches(benchmark.hosting);

  const ratio = total > 0 ? matches / total : 0;
  
  // Normalize ratio to produce a premium similarity range (e.g. 60% - 95%)
  const similarity = Math.round(55 + ratio * 40); 
  return Math.min(98, Math.max(45, similarity));
}

/**
 * Computes similar benchmarks for a given architecture option, sorted by similarity desc.
 */
export function getSimilarBenchmarks(arch: ArchitectureOption): BenchmarkSimilarity[] {
  return BENCHMARKS.map(bm => ({
    name: bm.name,
    percentage: calculateBenchmarkSimilarity(arch, bm)
  })).sort((a, b) => b.percentage - a.percentage);
}
