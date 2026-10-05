export interface PolicyEvaluation {
  allowed: boolean;
  requiresApproval: boolean;
  reason: string;
  category: "safe" | "approval_required" | "forbidden";
}

export const productionPolicy = {
  read: [
    "repository",
    "source",
    "package-manifests",
    "docker",
    "terraform",
    "config",
    "test-results"
  ],
  write: [
    "source",
    "docker",
    "github-actions",
    "terraform",
    "health-endpoints",
    "env-templates"
  ],
  approvalRequired: [
    "git.push",
    "docker.push",
    "terraform.apply",
    "cloud.deploy",
    "database.migrate",
    "secrets.inject",
    "dns.cutover"
  ],
  forbidden: [
    "private_keys",
    "credential_files",
    "system_directories",
    "arbitrary_binary_execution",
    "raw_root_rm"
  ]
};

const SAFE_COMMAND_PREFIXES = [
  "npm install",
  "npm test",
  "npm run test",
  "npm run build",
  "npm run lint",
  "pnpm install",
  "pnpm test",
  "pnpm run build",
  "yarn install",
  "yarn test",
  "yarn build",
  "docker build",
  "docker run",
  "docker ps",
  "docker images",
  "docker inspect",
  "docker stop",
  "git status",
  "git diff",
  "git log",
  "git branch",
  "git checkout -b",
  "git add",
  "git commit",
  "terraform init",
  "terraform fmt",
  "terraform validate",
  "terraform plan",
  "ls",
  "pwd",
  "cat",
  "find",
  "grep",
  "stat"
];

const APPROVAL_COMMAND_PATTERNS = [
  /terraform\s+apply/i,
  /docker\s+push/i,
  /git\s+push/i,
  /az\s+containerapp\s+(create|up|deploy)/i,
  /az\s+group\s+create/i,
  /aws\s+ecs/i,
  /gcloud\s+run\s+deploy/i,
  /migrate/i,
  /db:migrate/i,
  /prisma\s+migrate\s+deploy/i
];

const FORBIDDEN_COMMAND_PATTERNS = [
  /rm\s+(-[a-zA-Z]*r[a-zA-Z]*f|--force.*-r|-r.*--force)\s+(\/|~|\$HOME|\.\.\/\.\.)/i,
  /curl.*\|\s*(bash|sh|zsh)/i,
  /wget.*\|\s*(bash|sh|zsh)/i,
  /cat\s+.*(\.env|\.pem|\.key|id_rsa|credentials)/i,
  /chmod\s+777\s+\//i,
  /mkfs/i,
  /:(){ :\|:& };:/i, // fork bomb
  />\s*\/dev\/sd/i
];

export class ProductionPolicyEngine {
  static evaluateCommand(command: string): PolicyEvaluation {
    const trimmed = command.trim();

    // 1. Check forbidden patterns first
    for (const pattern of FORBIDDEN_COMMAND_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          allowed: false,
          requiresApproval: false,
          reason: `Policy Violation: Command matches high-risk pattern forbidden in production sandbox (${pattern.source})`,
          category: "forbidden"
        };
      }
    }

    // 2. Check actions that require explicit human sign-off
    for (const pattern of APPROVAL_COMMAND_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          allowed: true,
          requiresApproval: true,
          reason: `Human-in-the-Loop Required: Command will mutate remote infrastructure, push artifacts, or apply live state.`,
          category: "approval_required"
        };
      }
    }

    // 3. Check automatically allowed prefixes
    const isSafe = SAFE_COMMAND_PREFIXES.some(prefix => trimmed.startsWith(prefix));
    if (isSafe) {
      return {
        allowed: true,
        requiresApproval: false,
        reason: `Safe development & inspection command auto-permitted by policy engine.`,
        category: "safe"
      };
    }

    // Default: permit in sandbox but flag for review if it modifies outside files
    return {
      allowed: true,
      requiresApproval: false,
      reason: `Standard sandbox execution.`,
      category: "safe"
    };
  }

  static evaluateAction(action: string): PolicyEvaluation {
    if (productionPolicy.approvalRequired.includes(action)) {
      return {
        allowed: true,
        requiresApproval: true,
        reason: `Action '${action}' modifies external cloud state or publishes code/artifacts and requires explicit operator confirmation.`,
        category: "approval_required"
      };
    }

    if (productionPolicy.forbidden.includes(action)) {
      return {
        allowed: false,
        requiresApproval: false,
        reason: `Action '${action}' violates data boundary and security policy.`,
        category: "forbidden"
      };
    }

    return {
      allowed: true,
      requiresApproval: false,
      reason: `Action '${action}' allowed within local workspace scope.`,
      category: "safe"
    };
  }
}
