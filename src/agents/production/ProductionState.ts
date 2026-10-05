export type ProductionStage =
  | "intake"
  | "analyzing"
  | "planning"
  | "remediating"
  | "testing"
  | "containerizing"
  | "securing"
  | "provisioning"
  | "deploying"
  | "verifying"
  | "complete"
  | "failed";

export type FindingSeverity = "critical" | "high" | "medium" | "low" | "info";
export type FindingStatus = "failed" | "warning" | "passed";
export type FindingCategory = "container" | "ci_cd" | "security" | "health" | "tests" | "dependencies" | "database" | "logging" | "environment";

export interface Finding {
  id: string;
  category: FindingCategory;
  severity: FindingSeverity;
  status: FindingStatus;
  message: string;
  recommendation: string;
  autoFixable: boolean;
  affectedFile?: string;
  codeSnippet?: string;
}

export interface Artifact {
  id: string;
  type: "dockerfile" | "dockerignore" | "terraform" | "workflow" | "healthcheck" | "script" | "config" | "report";
  path: string;
  content: string;
  description: string;
  status: "draft" | "verified" | "applied";
  createdAt: number;
}

export interface PlanStep {
  id: string;
  title: string;
  stage: ProductionStage;
  action: string;
  reason: string;
  status: "pending" | "in_progress" | "completed" | "failed" | "skipped";
  requiresApproval?: boolean;
  error?: string;
  output?: string;
  remedialAttempts?: number;
}

export interface FinOpsEstimate {
  provider: "azure" | "aws" | "gcp";
  monthlyCost: number;
  breakdown: {
    service: string;
    cost: number;
    description: string;
  }[];
  recommended: boolean;
  reason: string;
  optimizationOpportunities: string[];
}

export interface CloudPricingAnalysis {
  expectedMonthlyRequests: number;
  estimates: {
    azure: FinOpsEstimate;
    aws: FinOpsEstimate;
    gcp: FinOpsEstimate;
  };
  recommendedProvider: "azure" | "aws" | "gcp";
  potentialMonthlySavings: number;
  potentialAnnualSavings: number;
  recommendationSummary: string;
}

export interface RepositoryDetails {
  url: string;
  owner?: string;
  repo?: string;
  branch: string;
  path: string;
  name: string;
}

export interface ApplicationProfile {
  framework?: string;
  language?: string;
  packageManager?: string;
  buildCommand?: string;
  startCommand?: string;
  testCommand?: string;
  port?: number;
  hasDockerfile: boolean;
  hasTerraform: boolean;
  hasCicd: boolean;
  hasTests: boolean;
  hasHealthEndpoint: boolean;
  hasEnvExample: boolean;
  database?: string;
  authProvider?: string;
  dependenciesCount?: number;
}

export interface InfrastructureConfig {
  provider: "azure" | "aws" | "gcp";
  region: string;
  resourceGroup: string;
  services: string[];
  containerImage?: string;
  environmentVariables: Record<string, string>;
  secretsRequired: string[];
  terraformCode?: string;
}

export interface DeploymentDetails {
  provider: "azure" | "aws" | "gcp";
  url?: string;
  status: "idle" | "pending_approval" | "provisioning" | "deploying" | "verifying" | "success" | "failed";
  stageProgress: number;
  approvedAt?: number;
  completedAt?: number;
  error?: string;
  healthStatus?: "healthy" | "unhealthy" | "unknown";
  metrics?: {
    latencyMs?: number;
    httpStatus?: number;
  };
}

export interface ReadinessScorecard {
  score: number; // 0 to 100
  passedChecks: number;
  totalChecks: number;
  criticalIssues: number;
  breakdown: {
    label: string;
    passed: boolean;
    weight: number;
    description: string;
  }[];
  dimensionScores?: {
    security: number;
    reliability: number;
    architecture: number;
    cost: number;
    deployment: number;
  };
}

export interface ProductionState {
  stage: ProductionStage;
  repository: RepositoryDetails;
  application: ApplicationProfile;
  infrastructure: InfrastructureConfig;
  findings: Finding[];
  readiness: ReadinessScorecard;
  plan: PlanStep[];
  artifacts: Artifact[];
  finops: CloudPricingAnalysis;
  deployment: DeploymentDetails;
  logs: {
    timestamp: number;
    level: "info" | "warn" | "error" | "success";
    source: string;
    message: string;
  }[];
  activeAction?: string;
  requiresUserApproval?: boolean;
  approvalPrompt?: {
    title: string;
    description: string;
    impact: string[];
    actionType: string;
    details: any;
  };
}

export const createInitialState = (repoUrl: string = "https://github.com/raphgm/saicide"): ProductionState => {
  const parts = repoUrl.replace(/\.git$/, "").split("/");
  const repoName = parts[parts.length - 1] || "app";
  const repoOwner = parts[parts.length - 2] || "owner";

  return {
    stage: "intake",
    repository: {
      url: repoUrl,
      owner: repoOwner,
      repo: repoName,
      branch: "main",
      path: `./${repoName}`,
      name: repoName,
    },
    application: {
      hasDockerfile: false,
      hasTerraform: false,
      hasCicd: false,
      hasTests: false,
      hasHealthEndpoint: false,
      hasEnvExample: false,
    },
    infrastructure: {
      provider: "azure",
      region: "eastus",
      resourceGroup: `rg-${repoName}-prod`,
      services: ["Container Apps", "Container Registry", "Key Vault", "Application Insights", "Managed Identity"],
      environmentVariables: {
        NODE_ENV: "production",
        PORT: "8080",
      },
      secretsRequired: ["DATABASE_URL", "JWT_SECRET"],
    },
    findings: [],
    readiness: {
      score: 0,
      passedChecks: 0,
      totalChecks: 10,
      criticalIssues: 0,
      breakdown: [],
    },
    plan: [],
    artifacts: [],
    finops: {
      expectedMonthlyRequests: 100000,
      estimates: {
        azure: {
          provider: "azure",
          monthlyCost: 64,
          breakdown: [
            { service: "Azure Container Apps (Scale to zero)", cost: 31, description: "Serverless container execution & vCPU/Memory" },
            { service: "Azure Database for PostgreSQL Flexible", cost: 15, description: "Burstable B1ms instance" },
            { service: "Azure Blob Storage & Container Registry", cost: 8, description: "Image storage and persistent assets" },
            { service: "Azure Monitor / Log Analytics", cost: 10, description: "Centralized logging and alerting" },
          ],
          recommended: true,
          reason: "Best fit: Container Apps scale-to-zero keeps idle costs minimal for predictable workloads.",
          optimizationOpportunities: ["Enable scale-to-zero for non-peak hours", "Use spot capacity for background queues"],
        },
        aws: {
          provider: "aws",
          monthlyCost: 81,
          breakdown: [
            { service: "AWS App Runner / ECS Fargate", cost: 42, description: "Containerized tasks with minimum 1 active vCPU" },
            { service: "Amazon RDS Aurora Serverless v2", cost: 22, description: "Minimum 0.5 ACU baseline" },
            { service: "Amazon ECR + S3", cost: 7, description: "Registry and object storage" },
            { service: "Amazon CloudWatch", cost: 10, description: "Logs and metrics" },
          ],
          recommended: false,
          reason: "Higher minimum baseline cost for persistent container runtime.",
          optimizationOpportunities: ["Switch to Lambda with Web Adapter to cut baseline"],
        },
        gcp: {
          provider: "gcp",
          monthlyCost: 73,
          breakdown: [
            { service: "Google Cloud Run", cost: 34, description: "CPU allocation during request processing" },
            { service: "Google Cloud SQL", cost: 24, description: "db-f1-micro instance" },
            { service: "Artifact Registry & Cloud Storage", cost: 6, description: "Container images" },
            { service: "Google Cloud Logging", cost: 9, description: "Telemetry tracking" },
          ],
          recommended: false,
          reason: "Competitive, but networking and egress add variable overhead.",
          optimizationOpportunities: ["Leverage Cloud CDN for static bundles"],
        },
      },
      recommendedProvider: "azure",
      potentialMonthlySavings: 17,
      potentialAnnualSavings: 204,
      recommendationSummary: "Azure Container Apps provides the lowest total cost of ownership ($64/mo vs $81/mo on AWS) with automated scale-to-zero capabilities.",
    },
    deployment: {
      provider: "azure",
      status: "idle",
      stageProgress: 0,
    },
    logs: [
      {
        timestamp: Date.now(),
        level: "info",
        source: "SAI Engine",
        message: "SAI Production Engineer initialized. Ready to inspect repository and forge production pipeline.",
      },
    ],
  };
};
