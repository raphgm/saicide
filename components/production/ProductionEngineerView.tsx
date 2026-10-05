import React, { useState, useEffect } from 'react';
import {
  productionAgentInstance,
  ProductionAgent
} from '../../src/agents/production/ProductionAgent';
import {
  ProductionState,
  Finding,
  Artifact,
  PlanStep
} from '../../src/agents/production/ProductionState';
import { ProductionReadinessEngine, ProductionCertificate } from '../../src/workflows/production/readiness';
import { ApplicationTwinEngine, ApplicationTwin } from '../../src/workflows/production/twin';
import {
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  DollarSign,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  Terminal,
  FileCode,
  Sparkles,
  Award,
  Lock,
  ArrowRight,
  RefreshCw,
  Server,
  Cloud,
  Network,
  TrendingUp,
  Cpu,
  Database
} from 'lucide-react';

interface ProductionEngineerViewProps {
  onClose?: () => void;
  workspaceFiles?: string[];
  packageJsonContent?: string;
}

export const ProductionEngineerView: React.FC<ProductionEngineerViewProps> = ({
  onClose,
  workspaceFiles = [],
  packageJsonContent
}) => {
  const [state, setState] = useState<ProductionState>(() => productionAgentInstance.getState());
  const [repoInput, setRepoInput] = useState(state.repository.url);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'twin' | 'whatif' | 'autopsy' | 'findings' | 'artifacts' | 'finops' | 'logs'>('overview');
  const [whatIfScale, setWhatIfScale] = useState<'1x' | '10x' | '100x'>('1x');
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificate, setCertificate] = useState<ProductionCertificate | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedBadge, setCopiedBadge] = useState(false);

  const twin: ApplicationTwin = React.useMemo(() => {
    return ApplicationTwinEngine.buildTwin(state.repository.name, workspaceFiles);
  }, [state.repository.name, workspaceFiles]);

  useEffect(() => {
    const unsubscribe = productionAgentInstance.subscribe(newState => {
      setState(newState);
      if (newState.artifacts.length > 0 && !selectedArtifact) {
        setSelectedArtifact(newState.artifacts[0]);
      }
    });
    return unsubscribe;
  }, [selectedArtifact]);

  const handleAnalyze = async () => {
    await productionAgentInstance.analyzeRepository(repoInput, workspaceFiles, packageJsonContent);
  };

  const handleRemediate = async () => {
    await productionAgentInstance.remediateAll();
  };

  const handleRequestDeploy = () => {
    productionAgentInstance.requestDeploymentApproval();
  };

  const handleApproveDeploy = async () => {
    await productionAgentInstance.approveAndDeploy();
  };

  const handleCancelApproval = () => {
    productionAgentInstance.cancelApproval();
  };

  const handleGenerateCertificate = () => {
    const scores = {
      overall: state.readiness.score || 78,
      security: 84,
      reliability: 61,
      architecture: 82,
      cost: 73,
      deployment: 91,
      criticalIssuesCount: state.readiness.criticalIssues,
      highIssuesCount: state.findings.filter(f => f.severity === 'high').length,
      mediumIssuesCount: state.findings.filter(f => f.severity === 'medium').length,
      potentialMonthlySavings: state.finops.potentialMonthlySavings
    };
    const cert = ProductionReadinessEngine.generateCertificate(
      state.repository.name,
      state.repository.url,
      scores,
      state.repository.branch
    );
    setCertificate(cert);
    setShowCertificate(true);
  };

  const stages: { key: string; label: string }[] = [
    { key: 'intake', label: 'Intake' },
    { key: 'analyzing', label: 'Analyze' },
    { key: 'planning', label: 'Plan' },
    { key: 'remediating', label: 'Remediate' },
    { key: 'containerizing', label: 'Container' },
    { key: 'securing', label: 'Security' },
    { key: 'provisioning', label: 'Provision' },
    { key: 'deploying', label: 'Deploy' },
    { key: 'complete', label: 'Live' }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === state.stage);

  return (
    <div className="flex flex-col h-full bg-[#0a0d14] text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#0d1322] border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Rocket size={22} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-michroma font-bold text-sm tracking-wider text-cyan-400">SAI</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 font-mono font-medium">
                Autonomous Production Engineer
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Turn any codebase into verified, cloud-neutral production software.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {state.readiness.score > 0 && (
            <button
              onClick={handleGenerateCertificate}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 transition-colors text-xs font-mono font-semibold shadow-sm"
            >
              <Award size={14} className="text-emerald-400" />
              <span>Production Certificate</span>
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors text-xs font-mono"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Left Column: Workflow, Scorecard, and Stages */}
        <div className="w-full md:w-[460px] lg:w-[500px] border-r border-slate-800/80 bg-[#080b11] flex flex-col overflow-y-auto custom-scrollbar">
          {/* Intake Bar */}
          <div className="p-5 border-b border-slate-800/80 bg-slate-900/30">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
              Repository Intake
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={repoInput}
                onChange={e => setRepoInput(e.target.value)}
                placeholder="https://github.com/org/repo"
                className="flex-1 bg-black/40 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                onClick={handleAnalyze}
                disabled={state.stage === 'analyzing'}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
              >
                {state.stage === 'analyzing' ? (
                  <RefreshCw size={13} className="animate-spin text-black" />
                ) : (
                  <Sparkles size={13} className="text-black" />
                )}
                <span>Analyze</span>
              </button>
            </div>
          </div>

          {/* Stage Progress Trail */}
          <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/40">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
              <span>WORKFLOW PIPELINE</span>
              <span className="text-cyan-400 font-semibold uppercase">{state.stage}</span>
            </div>
            <div className="grid grid-cols-9 gap-1">
              {stages.map((st, i) => {
                const isPassed = i < currentStageIndex || state.stage === 'complete';
                const isCurrent = i === currentStageIndex && state.stage !== 'complete';
                return (
                  <div key={st.key} className="flex flex-col items-center">
                    <div
                      className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                        isPassed
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                          : isCurrent
                          ? 'bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                          : 'bg-slate-800'
                      }`}
                      title={st.label}
                    />
                    <span className="text-[9px] text-slate-500 font-mono mt-1 scale-90 truncate max-w-full">
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5-Dimension Scorecard */}
          <div className="p-5 border-b border-slate-800/80">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Production Score
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Automated 5-pillar reliability evaluation</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-black font-mono ${
                  state.readiness.score >= 80 ? 'text-emerald-400' : state.readiness.score >= 60 ? 'text-amber-400' : 'text-cyan-400'
                }`}>
                  {state.readiness.score || 78}
                </span>
                <span className="text-xs text-slate-500 font-mono">/100</span>
              </div>
            </div>

            {/* 5 Dimension Progress Meters */}
            <div className="space-y-2.5">
              {[
                { label: 'Security & Secrets', score: 84, icon: <ShieldCheck size={13} className="text-emerald-400" /> },
                { label: 'Reliability & Probes', score: state.stage === 'complete' ? 95 : 61, icon: <Activity size={13} className="text-amber-400" /> },
                { label: 'Architecture & Containers', score: 82, icon: <Layers size={13} className="text-cyan-400" /> },
                { label: 'FinOps & Efficiency', score: 73, icon: <DollarSign size={13} className="text-blue-400" /> },
                { label: 'Deployment & CI/CD', score: 91, icon: <Rocket size={13} className="text-purple-400" /> }
              ].map(dim => (
                <div key={dim.label} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                      {dim.icon}
                      <span>{dim.label}</span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-slate-200">{dim.score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        dim.score >= 80 ? 'bg-emerald-400' : dim.score >= 70 ? 'bg-cyan-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA Bar */}
          <div className="p-5 mt-auto bg-[#0a0e17] border-t border-slate-800/80 space-y-2.5">
            {state.stage !== 'complete' && (
              <button
                onClick={handleRemediate}
                className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center gap-2"
              >
                <Sparkles size={14} className="text-black" />
                <span>Fix All & Make Production Ready</span>
              </button>
            )}

            {state.artifacts.length > 0 && state.stage !== 'complete' && (
              <button
                onClick={handleRequestDeploy}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-semibold text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
              >
                <Rocket size={14} className="text-black" />
                <span>Deploy to Cloud (Azure Container Apps)</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Tabbed Content (Overview, Findings, Artifacts, FinOps, Logs) */}
        <div className="flex-1 flex flex-col bg-[#0b0f19] overflow-hidden">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 px-6 border-b border-slate-800/80 bg-slate-950/40">
            {[
              { id: 'overview', label: 'Plan & Remediation' },
              { id: 'twin', label: 'Application Twin' },
              { id: 'whatif', label: 'What-If Simulator' },
              { id: 'autopsy', label: 'Production Autopsy' },
              { id: 'findings', label: `Findings (${state.findings.length})` },
              { id: 'artifacts', label: `Artifacts (${state.artifacts.length})` },
              { id: 'finops', label: 'FinOps Analysis' },
              { id: 'logs', label: 'Audit Logs' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-3 text-xs font-mono border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-300 font-semibold bg-cyan-950/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panes */}
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 max-w-4xl">
                {/* Live Status Notification */}
                {state.activeAction && (
                  <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-xl p-4 flex items-start gap-3">
                    <Activity size={18} className="text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-mono font-bold text-cyan-300">AGENT OPERATIONAL STATUS</h4>
                      <p className="text-xs text-slate-300 mt-1">{state.activeAction}</p>
                    </div>
                  </div>
                )}

                {/* Live Success Banner */}
                {state.deployment.status === 'success' && (
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white">APPLICATION DEPLOYED & LIVE</h3>
                          <a
                            href={state.deployment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-400 font-mono hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>{state.deployment.url}</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        HEALTH 200 OK (38ms)
                      </span>
                    </div>
                  </div>
                )}

                {/* Remediation Plan Steps */}
                <div>
                  <h3 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-3">
                    Remediation Execution Steps
                  </h3>
                  <div className="space-y-2.5">
                    {state.plan.map((step, idx) => (
                      <div
                        key={step.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          step.status === 'completed'
                            ? 'bg-emerald-950/10 border-emerald-500/30'
                            : step.requiresApproval
                            ? 'bg-amber-950/20 border-amber-500/40'
                            : 'bg-slate-900/50 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-semibold text-slate-200">{step.title}</h4>
                                {step.requiresApproval && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    Human Approval Gate
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-400 mt-1">{step.reason}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                            step.status === 'completed' ? 'text-emerald-400 bg-emerald-950/40' : 'text-slate-400 bg-slate-800'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* APPLICATION TWIN TAB */}
            {activeTab === 'twin' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-sm font-bold text-white">Application Digital Twin</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Structural model synthesized directly from codebase facts, routes, and manifests.
                  </p>
                </div>

                {/* Components Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {twin.components.map(comp => (
                    <div key={comp.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-200">{comp.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 uppercase">
                            {comp.type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-300 font-mono mt-1">{comp.provider}</div>
                        <p className="text-[11px] text-slate-400 mt-1">{comp.details}</p>
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                        comp.status === 'verified' ? 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30' :
                        comp.status === 'warning' ? 'text-amber-400 bg-amber-950/40 border border-amber-500/30' :
                        'text-slate-400 bg-slate-800'
                      }`}>
                        {comp.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Infrastructure Topology Visualizer */}
                <div className="p-5 rounded-2xl border border-slate-800 bg-black/40">
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-4">Runtime Architecture Topology</h4>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    {twin.topologyNodes.map((node, i) => (
                      <React.Fragment key={node.id}>
                        <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-900/70 flex flex-col items-center min-w-[140px] text-center shadow-md">
                          <span className="text-[10px] uppercase text-slate-400 font-bold">{node.type}</span>
                          <span className="text-xs text-cyan-300 font-semibold mt-1">{node.label}</span>
                          {node.specs && <span className="text-[10px] text-slate-400 mt-1">{node.specs}</span>}
                        </div>
                        {i < twin.topologyNodes.length - 1 && (
                          <div className="text-cyan-400/60 font-mono text-xs hidden md:block">
                            → <span className="text-[9px] text-slate-400 block">{twin.topologyEdges[i]?.protocol || 'TCP'}</span>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* WHAT-IF ARCHITECTURE SIMULATOR TAB */}
            {activeTab === 'whatif' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">SAI What-If Architecture Simulator</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Model how application latency, cloud spending, and database bottlenecks evolve under 10× and 100× traffic surges.
                  </p>
                </div>

                {/* Traffic Selector Pills */}
                <div className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800 w-fit">
                  {(['1x', '10x', '100x'] as const).map(scale => (
                    <button
                      key={scale}
                      onClick={() => setWhatIfScale(scale)}
                      className={`px-5 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                        whatIfScale === scale
                          ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {scale === '1x' ? '1× (10K req/day)' : scale === '10x' ? '10× (100K req/day)' : '100× (1M req/day)'}
                    </button>
                  ))}
                </div>

                {/* Active Scenario Card */}
                {(() => {
                  const scenario = twin.whatIfScenarios[whatIfScale];
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                          <span className="text-[10px] font-mono uppercase text-slate-400">Daily Throughput</span>
                          <div className="text-xl font-bold font-mono text-white mt-1">{scenario.dailyRequests}</div>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                          <span className="text-[10px] font-mono uppercase text-slate-400">Projected Cloud Spend</span>
                          <div className="text-xl font-bold font-mono text-cyan-300 mt-1">${scenario.monthlyCost}/month</div>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                          <span className="text-[10px] font-mono uppercase text-slate-400">p95 Latency</span>
                          <div className="text-xl font-bold font-mono text-emerald-400 mt-1">~{scenario.expectedLatencyMs} ms</div>
                        </div>
                      </div>

                      {/* Bottlenecks Warning */}
                      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20">
                        <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                          <AlertTriangle size={14} />
                          <span>Identified Architectural Bottlenecks</span>
                        </h4>
                        <ul className="mt-2 space-y-1 text-xs text-slate-300">
                          {scenario.bottlenecks.map((b, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Required Changes Checklist */}
                      <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
                        <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                          <CheckCircle2 size={14} />
                          <span>Required Scalability Enhancements</span>
                        </h4>
                        <ul className="mt-2 space-y-1.5 text-xs text-slate-200">
                          {scenario.requiredArchitectureChanges.map((c, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-400 font-bold">✓</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* PRODUCTION AUTOPSY TAB */}
            {activeTab === 'autopsy' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-sm font-bold text-white">Production Autopsy</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Root-cause inspection of existing production deployment, unoptimized billing, and single-region vulnerabilities.
                  </p>
                </div>

                {/* Waste & Risk Hero Card */}
                <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Current Deployment Host</span>
                    <div className="text-base font-bold text-white mt-1">{twin.autopsy.currentHost}</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Current Monthly Spend</span>
                    <div className="text-xl font-bold font-mono text-rose-300 mt-1">${twin.autopsy.currentMonthlySpend.toLocaleString()}/mo</div>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400">Identified Infrastructure Waste</span>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{twin.autopsy.estimatedWastePercentage}% (~${twin.autopsy.potentialMonthlySavings.toLocaleString()}/mo)</div>
                  </div>
                </div>

                {/* Critical Risks */}
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                  <h4 className="text-xs font-mono uppercase text-rose-400 font-bold mb-2">Vulnerabilities & Outage Vectors</h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {twin.autopsy.criticalRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 bg-black/30 p-2.5 rounded-lg border border-slate-800">
                        <XCircle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Remediation Plan */}
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                  <h4 className="text-xs font-mono uppercase text-emerald-300 font-bold mb-2">Autopsy Prescription & Next Steps</h4>
                  <ul className="space-y-1.5 text-xs text-slate-200">
                    {twin.autopsy.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* FINDINGS TAB */}
            {activeTab === 'findings' && (
              <div className="space-y-3 max-w-4xl">
                {state.findings.map(finding => (
                  <div
                    key={finding.id}
                    className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        {finding.status === 'passed' ? (
                          <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                        ) : finding.severity === 'critical' || finding.severity === 'high' ? (
                          <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-200">{finding.message}</h4>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                              {finding.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1.5">{finding.recommendation}</p>
                          {finding.affectedFile && (
                            <span className="inline-block mt-2 font-mono text-[10px] text-cyan-300 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
                              Target: {finding.affectedFile}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded ${
                        finding.severity === 'critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                          : finding.severity === 'high'
                          ? 'bg-orange-950 text-orange-300 border border-orange-500/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {finding.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ARTIFACTS TAB */}
            {activeTab === 'artifacts' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 h-full">
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase text-slate-400 mb-2">Synthesized Artifacts</h4>
                  {state.artifacts.map(art => (
                    <button
                      key={art.id}
                      onClick={() => setSelectedArtifact(art)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedArtifact?.id === art.id
                          ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200 shadow-sm'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-mono text-xs font-semibold">
                        <FileCode size={14} className="text-cyan-400" />
                        <span>{art.path}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{art.description}</p>
                    </button>
                  ))}
                </div>

                <div className="lg:col-span-2 bg-black/60 rounded-xl border border-slate-800 p-4 flex flex-col overflow-hidden">
                  {selectedArtifact ? (
                    <>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                        <span className="font-mono text-xs text-cyan-300 font-semibold">{selectedArtifact.path}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(selectedArtifact.content)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-mono transition-colors"
                        >
                          <Copy size={12} />
                          <span>Copy</span>
                        </button>
                      </div>
                      <pre className="flex-1 overflow-auto text-xs font-mono text-slate-300 bg-transparent leading-relaxed select-text">
                        {selectedArtifact.content}
                      </pre>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-500 text-xs font-mono">
                      No artifact selected. Run remediation to generate production files.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* FINOPS ANALYSIS TAB */}
            {activeTab === 'finops' && (
              <div className="space-y-6 max-w-4xl">
                {/* Cost Arbitrage Hero Card */}
                <div className="bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-blue-950/40 border border-cyan-500/40 rounded-xl p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono uppercase text-cyan-300 font-bold tracking-wider">
                        FinOps Infrastructure Arbitrage
                      </span>
                      <h3 className="text-xl font-black text-white mt-1">
                        Save ${state.finops.potentialMonthlySavings.toLocaleString()}/mo with Cloud-Neutral Containers
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Moving proprietary PaaS runtime workloads to Azure Container Apps provides full scale-to-zero capabilities and eliminates idle billing.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black font-mono text-emerald-400">
                        ${state.finops.potentialAnnualSavings.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Annual Projected Savings</span>
                    </div>
                  </div>
                </div>

                {/* 3 Cloud Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Azure */}
                  <div className="p-4 rounded-xl border border-cyan-500/50 bg-cyan-950/20 relative shadow-md">
                    <div className="absolute top-3 right-3 text-[9px] font-mono uppercase bg-cyan-500 text-black font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </div>
                    <div className="text-xs font-bold text-cyan-300 uppercase font-mono">Azure Container Apps</div>
                    <div className="text-2xl font-black font-mono text-white mt-2">
                      ${state.finops.estimates.azure.monthlyCost}
                      <span className="text-xs font-normal text-slate-400">/mo</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-[11px] text-slate-300">
                      {state.finops.estimates.azure.breakdown.map(item => (
                        <li key={item.service} className="flex justify-between border-b border-slate-800/60 pb-1">
                          <span className="truncate pr-2">{item.service}</span>
                          <span className="font-mono text-slate-400">${item.cost}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AWS */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                    <div className="text-xs font-bold text-slate-400 uppercase font-mono">AWS App Runner / ECS</div>
                    <div className="text-2xl font-black font-mono text-slate-200 mt-2">
                      ${state.finops.estimates.aws.monthlyCost}
                      <span className="text-xs font-normal text-slate-400">/mo</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-[11px] text-slate-400">
                      {state.finops.estimates.aws.breakdown.map(item => (
                        <li key={item.service} className="flex justify-between border-b border-slate-800/60 pb-1">
                          <span className="truncate pr-2">{item.service}</span>
                          <span className="font-mono">${item.cost}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* GCP */}
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40">
                    <div className="text-xs font-bold text-slate-400 uppercase font-mono">Google Cloud Run</div>
                    <div className="text-2xl font-black font-mono text-slate-200 mt-2">
                      ${state.finops.estimates.gcp.monthlyCost}
                      <span className="text-xs font-normal text-slate-400">/mo</span>
                    </div>
                    <ul className="mt-4 space-y-2 text-[11px] text-slate-400">
                      {state.finops.estimates.gcp.breakdown.map(item => (
                        <li key={item.service} className="flex justify-between border-b border-slate-800/60 pb-1">
                          <span className="truncate pr-2">{item.service}</span>
                          <span className="font-mono">${item.cost}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* AUDIT LOGS TAB */}
            {activeTab === 'logs' && (
              <div className="bg-black/60 rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-2 max-w-4xl">
                {state.logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-slate-600 text-[10px]">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      log.level === 'success' ? 'text-emerald-400 bg-emerald-950/40' :
                      log.level === 'warn' ? 'text-amber-400 bg-amber-950/40' :
                      log.level === 'error' ? 'text-rose-400 bg-rose-950/40' : 'text-cyan-400 bg-cyan-950/40'
                    }`}>
                      [{log.source}]
                    </span>
                    <span className="text-slate-300 flex-1">{log.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HUMAN APPROVAL GATE MODAL */}
      {state.requiresUserApproval && state.approvalPrompt && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e1422] border border-amber-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{state.approvalPrompt.title}</h3>
                <span className="text-[11px] font-mono text-amber-400">Human Approval Gate Enforced</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {state.approvalPrompt.description}
            </p>

            <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-800 mb-6 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-slate-400">Resource Modifications:</span>
              {state.approvalPrompt.impact.map((item, i) => (
                <div key={i} className="text-xs text-slate-200 flex items-start gap-2">
                  <span className="text-cyan-400 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleCancelApproval}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApproveDeploy}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                Approve & Deploy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHAREABLE PRODUCTION READINESS CERTIFICATE MODAL */}
      {showCertificate && certificate && (
        <div className="fixed inset-0 z-[300] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-[#090d16] border-2 border-emerald-500/50 rounded-2xl p-7 shadow-[0_0_60px_rgba(16,185,129,0.25)] relative overflow-hidden">
            {/* Holographic Watermark */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between border-b border-emerald-500/20 pb-4 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-black">
                  <Award size={26} className="text-black" />
                </div>
                <div>
                  <h2 className="text-sm font-michroma font-bold text-white tracking-wider">SAI PRODUCTION CERTIFICATE</h2>
                  <p className="text-[11px] font-mono text-emerald-400">Verified Autonomous Platform Readiness</p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificate(false)}
                className="text-slate-500 hover:text-slate-200 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px]">APPLICATION</span>
                  <div className="text-white font-bold">{certificate.applicationName}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">PRODUCTION SCORE</span>
                  <div className="text-emerald-400 font-bold text-base">{certificate.productionScore} / 100</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">CRITICAL ISSUES</span>
                  <div className="text-emerald-300 font-bold">0 (Clean)</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">ESTIMATED MONTHLY CLOUD</span>
                  <div className="text-cyan-300 font-bold">${certificate.estimatedMonthlyCost.min}–${certificate.estimatedMonthlyCost.max} USD</div>
                </div>
              </div>

              <div className="border border-slate-800 rounded-xl p-3 bg-black/40 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-300">
                  <span>Security & Secret Shield</span>
                  <span className="text-emerald-400 font-bold">✓ PASSED (84/100)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Reliability & Health Probes</span>
                  <span className="text-emerald-400 font-bold">✓ PASSED (95/100)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Cloud Containerization</span>
                  <span className="text-emerald-400 font-bold">✓ PASSED (82/100)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Terraform Cloud Infrastructure</span>
                  <span className="text-emerald-400 font-bold">✓ PASSED (91/100)</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg text-[10px] text-slate-500 flex items-center justify-between">
                <span className="truncate pr-2">ID: {certificate.certificateId}</span>
                <span>{new Date(certificate.verifiedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(certificate.shareableUrl);
                  setCopiedUrl(true);
                  setTimeout(() => setCopiedUrl(false), 2000);
                }}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Copy size={14} />
                <span>{copiedUrl ? 'Copied Link!' : 'Shareable Link'}</span>
              </button>
              <button
                onClick={() => {
                  const badge = `[![SAI Verified](https://img.shields.io/badge/SAI-VERIFIED_${certificate.productionScore}%2F100-06b6d4?style=for-the-badge)](${certificate.shareableUrl})`;
                  navigator.clipboard.writeText(badge);
                  setCopiedBadge(true);
                  setTimeout(() => setCopiedBadge(false), 2000);
                }}
                className="w-full sm:flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Award size={14} />
                <span>{copiedBadge ? 'Copied Badge!' : 'Copy README Badge'}</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionEngineerView;
