export interface TwinComponent {
  id: string;
  name: string;
  type: "frontend" | "api" | "auth" | "database" | "cache" | "storage" | "ai" | "external";
  provider: string;
  version?: string;
  icon?: string;
  status: "verified" | "warning" | "unconfigured";
  details: string;
}

export interface ArchitectureTopologyNode {
  id: string;
  label: string;
  type: "entrypoint" | "loadbalancer" | "compute" | "datastore" | "cache" | "external";
  status: "healthy" | "warning";
  replicas?: number;
  specs?: string;
}

export interface ArchitectureTopologyEdge {
  from: string;
  to: string;
  protocol: "HTTPS" | "gRPC" | "TCP" | "WSS";
}

export interface WhatIfScenario {
  trafficScale: "1x" | "10x" | "100x";
  dailyRequests: string;
  monthlyCost: number;
  expectedLatencyMs: number;
  bottlenecks: string[];
  requiredArchitectureChanges: string[];
}

export interface ProductionAutopsyResult {
  currentHost: string;
  currentMonthlySpend: number;
  estimatedWastePercentage: number;
  potentialMonthlySavings: number;
  criticalRisks: string[];
  recommendations: string[];
}

export interface ApplicationTwin {
  appName: string;
  components: TwinComponent[];
  topologyNodes: ArchitectureTopologyNode[];
  topologyEdges: ArchitectureTopologyEdge[];
  whatIfScenarios: Record<"1x" | "10x" | "100x", WhatIfScenario>;
  autopsy: ProductionAutopsyResult;
}

export class ApplicationTwinEngine {
  static buildTwin(appName: string, files: string[] = []): ApplicationTwin {
    const components: TwinComponent[] = [
      {
        id: "comp-fe",
        name: "Frontend Application",
        type: "frontend",
        provider: "Next.js 15 / React",
        version: "19.0",
        status: "verified",
        details: "Server-side and client hydrated components."
      },
      {
        id: "comp-api",
        name: "API & Backend Routing",
        type: "api",
        provider: "Next.js Route Handlers",
        status: "verified",
        details: "REST & Server Action endpoints."
      },
      {
        id: "comp-auth",
        name: "Authentication & Identity",
        type: "auth",
        provider: "Supabase / JWT",
        status: "verified",
        details: "OIDC and role-based token validation."
      },
      {
        id: "comp-db",
        name: "Primary Database",
        type: "database",
        provider: "PostgreSQL (Flexible)",
        status: "warning",
        details: "Single-region burstable instance without connection pooler."
      },
      {
        id: "comp-cache",
        name: "In-Memory Cache",
        type: "cache",
        provider: "Redis (Upstash / Azure Cache)",
        status: "unconfigured",
        details: "No caching layer detected. Read spikes hit DB directly."
      },
      {
        id: "comp-ai",
        name: "AI Inference Gateway",
        type: "ai",
        provider: "Gemini 2.5 / OpenAI",
        status: "verified",
        details: "Multimodal and structured JSON generation."
      },
      {
        id: "comp-storage",
        name: "Object Storage",
        type: "storage",
        provider: "Azure Blob / Amazon S3",
        status: "verified",
        details: "Encrypted asset and media repository."
      }
    ];

    const topologyNodes: ArchitectureTopologyNode[] = [
      { id: "node-traffic", label: "Public Internet (Clients)", type: "entrypoint", status: "healthy" },
      { id: "node-lb", label: "TLS 1.3 Ingress & Load Balancer", type: "loadbalancer", status: "healthy" },
      { id: "node-app", label: "Application Containers (ACA)", type: "compute", status: "healthy", replicas: 2, specs: "0.5 vCPU, 1GiB" },
      { id: "node-db", label: "PostgreSQL Flexible Server", type: "datastore", status: "warning", specs: "B1ms Burstable" },
      { id: "node-storage", label: "Blob Object Store", type: "datastore", status: "healthy" }
    ];

    const topologyEdges: ArchitectureTopologyEdge[] = [
      { from: "node-traffic", to: "node-lb", protocol: "HTTPS" },
      { from: "node-lb", to: "node-app", protocol: "HTTPS" },
      { from: "node-app", to: "node-db", protocol: "TCP" },
      { from: "node-app", to: "node-storage", protocol: "HTTPS" }
    ];

    const whatIfScenarios: Record<"1x" | "10x" | "100x", WhatIfScenario> = {
      "1x": {
        trafficScale: "1x",
        dailyRequests: "10,000 requests/day",
        monthlyCost: 64,
        expectedLatencyMs: 42,
        bottlenecks: ["None under current baseline traffic."],
        requiredArchitectureChanges: ["Baseline ACA container scale-to-zero is optimal."]
      },
      "10x": {
        trafficScale: "10x",
        dailyRequests: "100,000 requests/day",
        monthlyCost: 142,
        expectedLatencyMs: 88,
        bottlenecks: ["PostgreSQL connection pool exhaustion during concurrent bursts."],
        requiredArchitectureChanges: [
          "Enable PgBouncer connection pooling",
          "Set container replica min=1, max=10",
          "Enable CDN edge caching for static assets"
        ]
      },
      "100x": {
        trafficScale: "100x",
        dailyRequests: "1,000,000 requests/day",
        monthlyCost: 480,
        expectedLatencyMs: 145,
        bottlenecks: [
          "Database write throughput bottleneck",
          "CPU saturation on synchronous API calls"
        ],
        requiredArchitectureChanges: [
          "Deploy Redis cache cluster for frequent queries",
          "Add PostgreSQL read replicas",
          "Offload background tasks to async message queue (BullMQ / Azure Service Bus)",
          "Configure KEDA horizontal autoscaler up to 30 replicas"
        ]
      }
    };

    const autopsy: ProductionAutopsyResult = {
      currentHost: "Vercel Pro + Supabase Free",
      currentMonthlySpend: 1820,
      estimatedWastePercentage: 37,
      potentialMonthlySavings: 1756,
      criticalRisks: [
        "Single-region database dependency with no automated failover.",
        "Missing HTTP health probes causing orchestrators to route to unhealthy containers.",
        "No connection pooler; high risk of max_connections exceeded under viral traffic.",
        "Deployment lacks automated rollback configuration."
      ],
      recommendations: [
        "Deploy to Azure Container Apps with scale-to-zero to slash idle runtime spend.",
        "Add /health liveness and readiness probe.",
        "Inject PgBouncer or connection pooling in front of PostgreSQL.",
        "Adopt cloud-neutral Terraform definitions so you own your infrastructure."
      ]
    };

    return {
      appName,
      components,
      topologyNodes,
      topologyEdges,
      whatIfScenarios,
      autopsy
    };
  }
}
