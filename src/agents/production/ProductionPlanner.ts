import { Finding, PlanStep, ProductionState } from "./ProductionState";

export class ProductionPlanner {
  static createPlan(findings: Finding[], state: ProductionState): PlanStep[] {
    const steps: PlanStep[] = [];

    // Step 1: Health & Observability (Reliability)
    if (findings.some(f => f.id === "check-health-endpoint")) {
      steps.push({
        id: "step-health",
        title: "Implement Production /health Probe",
        stage: "remediating",
        action: "generate_health_endpoint",
        reason: "Microservices and cloud orchestrators require HTTP health probes for traffic routing and automated restarts.",
        status: "pending"
      });
    }

    // Step 2: Environment Template (Security)
    if (findings.some(f => f.id === "check-env-template")) {
      steps.push({
        id: "step-env",
        title: "Create Sanitized .env.example Specification",
        stage: "securing",
        action: "generate_env_template",
        reason: "Document all mandatory environment variables and prevent leaking secrets into version control.",
        status: "pending"
      });
    }

    // Step 3: Containerization (Deployment / Architecture)
    if (findings.some(f => f.id === "check-dockerfile")) {
      steps.push({
        id: "step-dockerfile",
        title: "Synthesize Multi-Stage Non-Root Dockerfile",
        stage: "containerizing",
        action: "generate_dockerfile",
        reason: "Build optimized container image with layer caching and unprivileged user for secure cloud execution.",
        status: "pending"
      });
    }

    // Step 4: .dockerignore (Security / Optimization)
    if (findings.some(f => f.id === "check-dockerignore")) {
      steps.push({
        id: "step-dockerignore",
        title: "Add .dockerignore Security Shield",
        stage: "containerizing",
        action: "generate_dockerignore",
        reason: "Prevents node_modules, keys, and local configuration files from being bundled into container layers.",
        status: "pending"
      });
    }

    // Step 5: CI/CD Automation (Deployment)
    if (findings.some(f => f.id === "check-cicd")) {
      steps.push({
        id: "step-cicd",
        title: "Generate GitHub Actions Production Pipeline",
        stage: "remediating",
        action: "generate_github_actions",
        reason: "Automate code verification, container builds, and deployment verification on every push to main.",
        status: "pending"
      });
    }

    // Step 6: Infrastructure as Code (Provisioning)
    if (findings.some(f => f.id === "check-terraform")) {
      steps.push({
        id: "step-terraform",
        title: "Generate Terraform Cloud Architecture (Azure Container Apps)",
        stage: "provisioning",
        action: "generate_terraform",
        reason: "Defines scalable serverless infrastructure with log analytics, ingress, and automated scale-to-zero.",
        status: "pending"
      });
    }

    // Step 7: FinOps Review & Deployment Gate (Requires Approval!)
    steps.push({
      id: "step-deploy",
      title: "Provision Infrastructure & Deploy to Azure Container Apps",
      stage: "deploying",
      action: "deploy_application",
      reason: "Deploy container to cloud with TLS 1.3 and public HTTPS endpoint. Requires operator confirmation.",
      status: "pending",
      requiresApproval: true
    });

    // Step 8: Post-Deploy Verification
    steps.push({
      id: "step-verify",
      title: "Perform Live Liveness/Readiness HTTP Health Probe",
      stage: "verifying",
      action: "verify_health_check",
      reason: "Ping deployed production endpoint to confirm 200 OK status and verified SSL certificate.",
      status: "pending"
    });

    return steps;
  }
}
