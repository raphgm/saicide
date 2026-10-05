import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Rocket,
  Terminal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Server,
  Database,
  Lock,
  Workflow,
  Container,
  Zap,
  Activity,
  CreditCard,
  Check,
  Github,
  Gauge,
  BarChart3,
  ExternalLink,
  Copy,
  ChevronRight,
  DollarSign,
  Cpu,
  Layers,
  Sparkles,
  KeyRound,
  Network
} from 'lucide-react';
import Footer from './Footer';

interface LandingPageProps {
  onLaunch: () => void;
  onSubscribe: () => void;
}

const ECOSYSTEM_TOOLS = [
  'Lovable',
  'Cursor',
  'Claude Code',
  'v0',
  'Replit',
  'Google AI Studio',
  'Bolt.new',
  'GitHub Copilot'
];

const CAPABILITY_CARDS = [
  {
    id: 'scorecard',
    title: '5-Pillar Scorecard',
    category: 'Assessment',
    description: 'Deterministic scanning across Security, Reliability, Architecture, FinOps, and Deployment.',
    icon: <Gauge className="text-cyan-400" size={24} />,
    stat: '100 Point Audit'
  },
  {
    id: 'twin',
    title: 'Application Twin',
    category: 'Architecture',
    description: 'Auto-maps reverse-engineered topologies: frontends, APIs, databases, caches, and egress paths.',
    icon: <Network className="text-blue-400" size={24} />,
    stat: 'Live Graph'
  },
  {
    id: 'whatif',
    title: 'What-If Simulator',
    category: 'Reliability',
    description: 'Stress-tests DB connections, egress, and memory at 10k, 100k, and 1M daily requests before launch.',
    icon: <BarChart3 className="text-amber-400" size={24} />,
    stat: '1× to 100× Traffic'
  },
  {
    id: 'finops',
    title: 'FinOps Cloud Arbitrage',
    category: 'Cost Defense',
    description: 'Deploys directly to Azure ACA, AWS, or GCP—eliminating 10× proprietary PaaS bandwidth markups.',
    icon: <DollarSign className="text-emerald-400" size={24} />,
    stat: '~$1,756/mo Saved'
  },
  {
    id: 'remediate',
    title: 'Autopsy & Remediation',
    category: 'Production',
    description: 'Generates non-root Dockerfiles, health probes, Terraform IaC, and signed Production Certificates.',
    icon: <ShieldCheck className="text-purple-400" size={24} />,
    stat: 'Deterministic IaC'
  }
];

const TRAFFIC_PRESETS = [
  {
    level: '1× MVP',
    reqs: '10,000 req/day',
    dbPool: '12%',
    latency: '38ms',
    cost: '$64 / mo',
    status: 'Optimal',
    warning: null
  },
  {
    level: '10× Growth',
    reqs: '100,000 req/day',
    dbPool: '48%',
    latency: '82ms',
    cost: '$148 / mo',
    status: 'Healthy',
    warning: 'Recommend connection pooling (PgBouncer) for burst concurrency'
  },
  {
    level: '100× Scale',
    reqs: '1,000,000 req/day',
    dbPool: '94%',
    latency: '240ms',
    cost: '$380 / mo',
    status: 'Bottleneck Detected',
    warning: '🚨 Uncached database queries will saturate connections. Redis cache layer required.'
  }
];

const PRICING_PACKAGES = [
  {
    id: 'scan',
    name: 'Free Scan',
    price: '$0',
    frequency: 'forever',
    badge: 'Open Source & Dev',
    highlight: false,
    description: 'Full automated audit and architectural diagnostic for any public or private repository.',
    features: [
      '5-Pillar Production Scorecard (0–100)',
      'Application Twin topology graph',
      'What-If scale simulator (up to 100×)',
      'Secret exposure & CVE vulnerability audit',
      'FinOps cloud arbitrage breakdown',
      'Downloadable PDF diagnostic report'
    ],
    cta: 'Scan Repo Free',
    isPrimary: false
  },
  {
    id: 'ready',
    name: 'Production Ready',
    price: '$199',
    frequency: 'per repository',
    badge: 'Most Popular',
    highlight: true,
    description: 'Complete automated remediation code package generated directly into your repository via Pull Request.',
    features: [
      'Everything in Free Scan',
      'Hardened non-root multi-stage Dockerfile',
      'HTTP /health and /ready probes with SIGTERM handler',
      'GitHub Actions CI/CD with Azure OIDC auth',
      'Terraform scale-to-zero ACA infrastructure',
      'Cryptographically signed SAI Certificate',
      'Official Markdown README shield badge'
    ],
    cta: 'Get Production Ready',
    isPrimary: true
  },
  {
    id: 'launch',
    name: 'Production Launch',
    price: '$999',
    frequency: 'turnkey rollout',
    badge: 'White Glove',
    highlight: false,
    description: 'End-to-end cloud provisioning, custom domain DNS, Azure Key Vault secrets, and verified live cutover.',
    features: [
      'Everything in Production Ready',
      'Turnkey deployment to Azure Container Apps',
      'Custom domain DNS + managed SSL certificates',
      'Azure Key Vault secret integration',
      'PgBouncer database connection pooling',
      'Human-in-the-loop production engineer validation',
      '30-day post-launch SLO uptime guarantee'
    ],
    cta: 'Schedule Launch',
    isPrimary: false
  },
  {
    id: 'agency',
    name: 'Enterprise / Agency',
    price: '$2,499',
    frequency: 'per month',
    badge: 'Scale Teams',
    highlight: false,
    description: 'Empower your dev shop or agency to ship 20+ production-grade AI client applications every month.',
    features: [
      'Unlimited repository scans & remediations',
      'Custom Terraform modules (AWS, GCP, Azure)',
      'SOC2 & HIPAA infrastructure compliance packs',
      'Dedicated Slack / Teams support channel',
      'White-label SAI Production Certificates',
      'Role-based access & multi-tenant billing'
    ],
    cta: 'Contact Enterprise',
    isPrimary: false
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch, onSubscribe }) => {
  const [repoInput, setRepoInput] = useState('');
  const [comparisonTab, setComparisonTab] = useState<'before' | 'after'>('after');
  const [activeScaleIndex, setActiveScaleIndex] = useState(0);
  const [copiedBadge, setCopiedBadge] = useState(false);

  const sampleRepos = [
    'https://github.com/anomalyco/ai-saas-starter',
    'https://github.com/example/cursor-generated-crm',
    'https://github.com/v0/lovable-task-manager'
  ];

  const handleSelectSample = (sample: string) => {
    setRepoInput(sample);
  };

  const handleCopyBadge = () => {
    const badgeMarkdown = `[![SAI Production-Grade](https://img.shields.io/badge/SAI-Production%20Grade%2093%2F100-success?style=flat-square)](https://sai.dev/verify/cert_prod_9f82a1e3)`;
    navigator.clipboard.writeText(badgeMarkdown);
    setCopiedBadge(true);
    setTimeout(() => setCopiedBadge(false), 2500);
  };

  return (
    <div className="w-full bg-[#0a0d14] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 border-b border-cyan-500/20 px-4 py-2.5 text-center text-xs font-mono flex items-center justify-center gap-3">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="text-slate-300">
          <strong className="text-cyan-400 font-semibold">SAI Production Engineer v2.4</strong> is online. Azure Container Apps (ACA) target available.
        </span>
        <button 
          onClick={onLaunch}
          className="text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1 font-semibold ml-2"
        >
          Try Live Demo <ChevronRight size={12} />
        </button>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#0a0d14]/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 font-black text-black text-lg">
              S
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white">SAI</span>
              <span className="ml-2 text-[10px] font-mono uppercase tracking-widest text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                Production Engineer
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
            <a href="#capabilities" className="hover:text-cyan-400 transition-colors">Capabilities</a>
            <a href="#before-after" className="hover:text-cyan-400 transition-colors">Before & After</a>
            <a href="#topology" className="hover:text-cyan-400 transition-colors">Application Twin</a>
            <a href="#simulator" className="hover:text-cyan-400 transition-colors">Scale Simulator</a>
            <a href="#finops" className="hover:text-cyan-400 transition-colors">FinOps Arbitrage</a>
            <a href="#certificate" className="hover:text-cyan-400 transition-colors">Verification</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunch}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-all"
            >
              Log In
            </button>
            <button
              onClick={onLaunch}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Analyze Repo</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-8 backdrop-blur-md shadow-lg shadow-cyan-950/50">
            <Sparkles size={14} className="text-cyan-400" />
            <span>AI Built Your Code. SAI Makes It Production-Grade.</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Your code works. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Now make it production-ready.
            </span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            AI code assistants generate functional software in minutes, but leave behind security leaks, unmanaged DB connections, and runaway cloud bills. SAI analyzes your repository, reverse-engineers its architecture, remedies vulnerabilities, and provisions production infrastructure.
          </p>

          {/* Repo Input Box */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="p-2 bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl shadow-black/80 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-2 group hover:border-cyan-500/60 transition-all">
              <div className="flex items-center gap-3 flex-1 w-full px-3">
                <Github size={22} className="text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0" />
                <input
                  type="text"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder="github.com/organization/repository"
                  className="bg-transparent border-none text-sm font-mono text-white placeholder-slate-500 focus:outline-none w-full"
                />
              </div>
              <button
                onClick={onLaunch}
                className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <span>Analyze Repository</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Quick Samples */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400 flex-wrap">
              <span className="text-slate-500 font-mono text-[11px]">Or test sample:</span>
              {sampleRepos.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(sample)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-mono text-[11px] hover:text-cyan-300 transition-colors"
                >
                  {sample.split('/').pop()}
                </button>
              ))}
            </div>
          </div>

          {/* Supported Ecosystem Badges */}
          <div className="mt-14 pt-10 border-t border-slate-800/80">
            <p className="text-xs uppercase font-mono tracking-widest text-slate-500 mb-4">
              Hardens raw repositories built with:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {ECOSYSTEM_TOOLS.map((tool) => (
                <span
                  key={tool}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300 hover:border-slate-700 transition-colors"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 5 CORE CAPABILITIES */}
      <section id="capabilities" className="py-24 px-6 bg-[#080b10] border-t border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Beyond code generation: The complete software-to-production engine
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              Coding agents generate lines of code. SAI operates like an experienced principal engineer, transforming raw prototypes into hardened, monitored, and scaled infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {CAPABILITY_CARDS.map((card) => (
              <div
                key={card.id}
                className="bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 p-6 rounded-2xl transition-all hover:-translate-y-1 group relative flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    {card.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                    {card.stat}
                  </span>
                  <ChevronRight size={14} className="text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: BEFORE VS AFTER COMPARISON */}
      <section id="before-after" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest">
              Interactive Diagnostic
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              What changes when SAI engineers your repo?
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              Toggle between raw AI-generated code and the verified production-ready output.
            </p>

            {/* Toggle Switch */}
            <div className="mt-8 inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => setComparisonTab('before')}
                className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                  comparisonTab === 'before'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <XCircle size={14} />
                <span>Raw AI Output (Score: 42)</span>
              </button>
              <button
                onClick={() => setComparisonTab('after')}
                className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                  comparisonTab === 'after'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle size={14} />
                <span>SAI Production-Grade (Score: 93)</span>
              </button>
            </div>
          </div>

          {/* Comparison Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Left Card: Before State */}
            <div className={`rounded-2xl border p-8 transition-all ${
              comparisonTab === 'before'
                ? 'bg-rose-950/10 border-rose-500/40 shadow-2xl shadow-rose-950/30 ring-1 ring-rose-500/20'
                : 'bg-slate-900/40 border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono uppercase text-rose-400 tracking-wider">Before SAI Remediation</span>
                  <h3 className="text-xl font-extrabold text-white mt-1">Raw Prototype / Cursor / Lovable</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-rose-400 font-mono">42 / 100</div>
                  <span className="text-[10px] font-mono text-rose-300 uppercase">Failing Readiness</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-start gap-3">
                  <Lock size={18} className="text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-300">Hardcoded JWT Secret & API Keys</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Found plain-text keys in .env tracked in git history; secrets exposed in client bundle.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-start gap-3">
                  <Container size={18} className="text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-300">Container Runs as Root User</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Single-stage Dockerfile with root execution; 1.2 GB image size with development devDependencies.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-start gap-3">
                  <Database size={18} className="text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-300">Unbounded DB Connection Pool</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Direct DB connection created per serverless request. Crashes Postgres under 50 concurrent users.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-start gap-3">
                  <AlertTriangle size={18} className="text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-300">No Liveness or Graceful Shutdown</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Missing /health probe. Drops in-flight customer transactions on every deployment or scale-down.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-rose-500/20 flex items-start gap-3">
                  <DollarSign size={18} className="text-rose-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-rose-300">PaaS Markup: $1,820 / month</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Proprietary serverless runtime charging 10× markups on function executions and bandwidth egress.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: After State */}
            <div className={`rounded-2xl border p-8 transition-all ${
              comparisonTab === 'after'
                ? 'bg-cyan-950/15 border-cyan-500/40 shadow-2xl shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                : 'bg-slate-900/40 border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">After SAI Remediation</span>
                  <h3 className="text-xl font-extrabold text-white mt-1">Production-Grade Infrastructure</h3>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-cyan-400 font-mono">93 / 100</div>
                  <span className="text-[10px] font-mono text-cyan-300 uppercase">Certified Ready</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-start gap-3">
                  <KeyRound size={18} className="text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300">Azure Key Vault & GitHub OIDC</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Zero persistent secrets in repo. Cloud provider federated OIDC identity used for all CI/CD actions.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-start gap-3">
                  <Container size={18} className="text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300">Hardened Multi-Stage Alpine Container</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Non-root UID 10001, isolated production layer, pruned devDependencies. Image reduced to 112 MB.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-start gap-3">
                  <Database size={18} className="text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300">PgBouncer Connection Pooling</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Configured connection pooler with exponential backoff. Safely supports 10,000+ burst connections.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-start gap-3">
                  <Activity size={18} className="text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300">Dual Health Probes & SIGTERM Handling</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">HTTP /health and /ready probes with 10s graceful shutdown drain. Zero dropped user requests.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-cyan-500/20 flex items-start gap-3">
                  <DollarSign size={18} className="text-cyan-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-cyan-300">Azure Container Apps: $64 / month</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Scale-to-zero serverless containers on Azure hyperscaler. Saves $1,756/mo ($21,072/year).</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={onLaunch}
              className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-cyan-500/20 hover:from-cyan-300 hover:to-blue-400 transition-all inline-flex items-center gap-2"
            >
              <span>Audit Your Repo Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: APPLICATION TWIN & TOPOLOGY */}
      <section id="topology" className="py-24 px-6 bg-[#080b10] border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest">
              Live Topology Mapping
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              The Application Twin Engine
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              SAI scans your entire AST, configuration files, and package manifests to reverse-engineer your application topology into a living architectural digital twin.
            </p>
          </div>

          {/* Interactive Topology Diagram */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
              {/* Node 1: Edge & Ingress */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-blue-500/30 text-center relative group">
                <span className="text-[9px] font-mono text-blue-400 uppercase tracking-widest block mb-2">Ingress</span>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-3">
                  <Workflow size={24} className="text-blue-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Azure Front Door</h4>
                <p className="text-[11px] text-slate-400 mt-1">Global Edge CDN, TLS 1.3, DDoS protection</p>
                <div className="mt-3 inline-block px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[10px] font-mono">
                  Route: /*
                </div>
              </div>

              {/* Connector */}
              <div className="hidden md:flex flex-col items-center justify-center text-slate-600 font-mono text-xs">
                <span>&rarr;</span>
                <span className="text-[10px] text-cyan-400">gRPC/HTTP</span>
              </div>

              {/* Node 2: Container Apps Compute */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-cyan-500/40 text-center relative group ring-1 ring-cyan-500/20">
                <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">Compute Fleet</span>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                  <Container size={24} className="text-cyan-400" />
                </div>
                <h4 className="text-sm font-bold text-white">Azure Container Apps</h4>
                <p className="text-[11px] text-slate-400 mt-1">Multi-stage Alpine, 0.5 vCPU / 1GB, scale 0&rarr;10</p>
                <div className="mt-3 inline-block px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-mono">
                  Healthy: 200 OK
                </div>
              </div>

              {/* Connector */}
              <div className="hidden md:flex flex-col items-center justify-center text-slate-600 font-mono text-xs">
                <span>&rarr;</span>
                <span className="text-[10px] text-purple-400">Pooled SQL</span>
              </div>

              {/* Node 3: Storage & Secrets */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-purple-500/30 text-center relative group">
                <span className="text-[9px] font-mono text-purple-400 uppercase tracking-widest block mb-2">Persistence & Secrets</span>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <Database size={24} className="text-purple-400" />
                </div>
                <h4 className="text-sm font-bold text-white">PostgreSQL + Key Vault</h4>
                <p className="text-[11px] text-slate-400 mt-1">PgBouncer pool, AES-256 at rest, zero plaintext keys</p>
                <div className="mt-3 inline-block px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-[10px] font-mono">
                  Pool: 20 Max
                </div>
              </div>
            </div>

            {/* Architecture Metrics Footer */}
            <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">Dependencies Discovered</span>
                <div className="text-lg font-bold text-white font-mono mt-0.5">27 Packages</div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">Egress Sinks</span>
                <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">3 (OpenAI, Stripe, DB)</div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">Cold Start Latency</span>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">&lt; 320ms</div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">SLO Reliability Target</span>
                <div className="text-lg font-bold text-white font-mono mt-0.5">99.95%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: WHAT-IF ARCHITECTURE SIMULATOR */}
      <section id="simulator" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-amber-400 font-mono text-xs uppercase tracking-widest">
              Stress-Testing Before Launch
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              SAI What-If Architecture Simulator
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              Predict traffic bottlenecks, connection pool exhaustion, and memory leaks before they impact customers.
            </p>

            {/* Traffic Presets Selector */}
            <div className="mt-8 flex items-center justify-center gap-3">
              {TRAFFIC_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveScaleIndex(idx)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeScaleIndex === idx
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 scale-105'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {preset.level}
                </button>
              ))}
            </div>
          </div>

          {/* Simulator Visualizer */}
          {(() => {
            const activePreset = TRAFFIC_PRESETS[activeScaleIndex];
            return (
              <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase">Simulated Daily Traffic</span>
                    <h3 className="text-2xl font-black text-white mt-1">{activePreset.reqs}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Simulation Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      activePreset.status === 'Optimal'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : activePreset.status === 'Healthy'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                    }`}>
                      {activePreset.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-xs font-mono text-slate-500 uppercase">DB Pool Saturation</span>
                    <div className="text-3xl font-black text-white font-mono mt-2">{activePreset.dbPool}</div>
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          parseInt(activePreset.dbPool) > 80 ? 'bg-rose-500' : 'bg-cyan-400'
                        }`}
                        style={{ width: activePreset.dbPool }}
                      />
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-xs font-mono text-slate-500 uppercase">Estimated P99 Latency</span>
                    <div className="text-3xl font-black text-cyan-400 font-mono mt-2">{activePreset.latency}</div>
                    <p className="text-[11px] text-slate-500 mt-2 font-mono">Edge-to-DB roundtrip</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-xs font-mono text-slate-500 uppercase">Hyperscaler Cloud Spend</span>
                    <div className="text-3xl font-black text-emerald-400 font-mono mt-2">{activePreset.cost}</div>
                    <p className="text-[11px] text-slate-500 mt-2 font-mono">Azure Container Apps + DB</p>
                  </div>
                </div>

                {activePreset.warning && (
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                    <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-amber-300">Bottleneck Advisory</h4>
                      <p className="text-xs text-slate-300 mt-0.5">{activePreset.warning}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* SECTION: FINOPS CLOUD ARBITRAGE */}
      <section id="finops" className="py-24 px-6 bg-[#080b10] border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest">
              FinOps Cloud Defense
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Stop paying 10× markups on PaaS runtime
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              Proprietary platforms charge extreme premiums for bandwidth egress and function timeouts. SAI packages your code for native hyperscalers, slashing your monthly cloud bill by up to 96%.
            </p>
          </div>

          {/* Pricing Comparison Table */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {/* Azure ACA (Recommended) */}
              <div className="p-8 bg-cyan-950/20 relative">
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-[10px] font-mono uppercase tracking-wider mb-4">
                  Recommended V1
                </div>
                <h3 className="text-lg font-bold text-white">Azure Container Apps</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-cyan-400 font-mono">$64</span>
                  <span className="text-xs text-slate-400 font-mono">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Scale-to-zero microservices, native OIDC, Azure Key Vault integration.</p>
                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
                  &bull; 96% Cheaper than PaaS
                </div>
              </div>

              {/* AWS ECS Fargate */}
              <div className="p-8">
                <span className="text-xs font-mono text-slate-500 uppercase block mb-4">Hyperscaler</span>
                <h3 className="text-lg font-bold text-white">AWS ECS Fargate</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white font-mono">$81</span>
                  <span className="text-xs text-slate-400 font-mono">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Serverless container fleet with AWS Secrets Manager and ALB.</p>
                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  &bull; Enterprise standard
                </div>
              </div>

              {/* GCP Cloud Run */}
              <div className="p-8">
                <span className="text-xs font-mono text-slate-500 uppercase block mb-4">Hyperscaler</span>
                <h3 className="text-lg font-bold text-white">GCP Cloud Run</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white font-mono">$73</span>
                  <span className="text-xs text-slate-400 font-mono">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Fast cold starts with Google Cloud Secret Manager integration.</p>
                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                  &bull; Global anycast
                </div>
              </div>

              {/* Proprietary PaaS (Vercel) */}
              <div className="p-8 bg-rose-950/10">
                <span className="text-xs font-mono text-rose-400 uppercase block mb-4">Proprietary PaaS</span>
                <h3 className="text-lg font-bold text-white">Vercel Enterprise</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-rose-400 font-mono">$1,820</span>
                  <span className="text-xs text-slate-400 font-mono">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Heavy serverless execution limits, bandwidth egress fees, user seats.</p>
                <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] font-mono text-rose-400">
                  &bull; High vendor lock-in
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <DollarSign size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Annual FinOps Arbitrage Savings</h4>
                  <p className="text-xs text-slate-400">Deploying via SAI saves approximately <strong>$1,756 every month</strong> ($21,072 / year).</p>
                </div>
              </div>
              <button
                onClick={onLaunch}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-white transition-all shrink-0"
              >
                Calculate My Repo Savings
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: VERIFIABLE PRODUCTION CERTIFICATE */}
      <section id="certificate" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest">
              Proof of Production-Grade
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Cryptographic SAI Verification
            </h2>
            <p className="text-slate-400 mt-3 text-sm">
              Show users, investors, and security auditors that your AI application meets strict enterprise production criteria.
            </p>
          </div>

          {/* Certificate Card Preview */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/40 shadow-2xl shadow-cyan-950/40 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <ShieldCheck size={22} className="text-cyan-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Official Audit Record</span>
                  <h3 className="text-lg font-black text-white">SAI Production Certificate</h3>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
                CERTIFIED GRADE A
              </div>
            </div>

            <div className="my-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-500">Security</span>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">95 / 100</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-500">Reliability</span>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">92 / 100</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-500">Architecture</span>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">90 / 100</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-mono uppercase text-slate-500">FinOps</span>
                <div className="text-xl font-black text-emerald-400 font-mono mt-1">96 / 100</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs border border-slate-800 text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Certificate ID:</span>
                <span className="text-cyan-300 font-bold">cert_prod_9f82a1e3</span>
              </div>
              <div className="flex justify-between">
                <span>Verification URL:</span>
                <span className="text-slate-300">sai.dev/verify/cert_prod_9f82a1e3</span>
              </div>
              <div className="flex justify-between">
                <span>SHA-256 Digest:</span>
                <span className="text-slate-500 truncate max-w-[240px]">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b</span>
              </div>
            </div>

            {/* Badge Embed Bar */}
            <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src="https://img.shields.io/badge/SAI-Production%20Grade%2093%2F100-success?style=flat-square"
                  alt="SAI Production Grade Badge"
                  className="h-6"
                />
                <span className="text-xs text-slate-400">Embed official shield on your GitHub README</span>
              </div>

              <button
                onClick={handleCopyBadge}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-white transition-all flex items-center gap-2"
              >
                {copiedBadge ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span>Copied Markdown!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Badge Markdown</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: COMMERCIAL PACKAGES / PRICING */}
      <section id="pricing" className="py-24 px-6 bg-[#080b10] border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest">
              Simple Commercial Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Predictable pricing for production software
            </h2>
            <p className="text-slate-400 mt-4 text-base">
              Start with a free audit. Upgrade when you need automated code remediation or turnkey Azure cloud deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`p-7 rounded-3xl border transition-all flex flex-col justify-between ${
                  pkg.highlight
                    ? 'bg-gradient-to-b from-cyan-950/40 to-slate-900 border-cyan-500 shadow-2xl shadow-cyan-950/50 ring-1 ring-cyan-500/50 -translate-y-2'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                      {pkg.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white">{pkg.name}</h3>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white font-mono">{pkg.price}</span>
                    <span className="text-xs text-slate-400 font-mono uppercase">/{pkg.frequency}</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="my-6 border-t border-slate-800" />

                  <ul className="space-y-3">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <button
                    onClick={pkg.id === 'scan' ? onLaunch : onSubscribe}
                    className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      pkg.highlight
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-lg shadow-cyan-500/25 active:scale-95'
                        : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 active:scale-95'
                    }`}
                  >
                    <span>{pkg.cta}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-[#080b10] to-[#0a0d14] border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-6">
            <Rocket size={28} className="text-cyan-400" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Ready to make your AI application production-grade?
          </h2>

          <p className="mt-4 text-slate-300 text-base max-w-xl mx-auto">
            Scan any GitHub repository in 30 seconds. Get your 5-pillar scorecard, Application Twin topology, and automated cloud remediation plan.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunch}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2"
            >
              <span>Launch SAI Production Engineer</span>
              <ArrowRight size={16} />
            </button>
            <a
              href="https://github.com/anomalyco/saicide"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Github size={16} />
              <span>View Source on GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
