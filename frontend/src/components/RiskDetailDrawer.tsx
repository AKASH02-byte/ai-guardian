import React from 'react';
import { X, AlertTriangle, ShieldCheck, TrendingUp } from 'lucide-react';
import type { TopRiskItem } from '../types';
import { SeverityBadge } from './SeverityBadge';
import { formatINR } from '../services/api';

interface RiskDetailDrawerProps {
  risk: TopRiskItem | null;
  onClose: () => void;
  onNavigateToOptimizer?: () => void;
}

export const RiskDetailDrawer: React.FC<RiskDetailDrawerProps> = ({ risk, onClose, onNavigateToOptimizer }) => {
  if (!risk) return null;

  const whyHighFactors = [
    'Internet exposed production asset connected to primary API Gateway',
    'Critical core banking database holding sensitive customer PII & PCI records',
    'Exploit payload script (CVE-2024-3094) available on public threat intelligence channels',
    'Sub-optimal EDR coverage (58% endpoint agent deployment across database cluster)',
    'High active ransomware threat campaigns targeting Indian BFSI institutions'
  ];

  const recommendedActions = [
    { title: 'Deploy Endpoint Detection & Response (EDR)', cost: 400000, reduction: 750000, priority: 'High' },
    { title: 'Enforce MFA across all Privileged DB Administrator Accounts', cost: 100000, reduction: 450000, priority: 'High' },
    { title: 'Establish Air-Gapped Immutable Backup Vaults', cost: 300000, reduction: 650000, priority: 'Medium' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest">
              Risk Detail Inspector #{risk.id}
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">{risk.risk_title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-xs text-slate-500 font-medium">Target Asset</span>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">{risk.asset_name}</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-xs text-slate-500 font-medium">Severity / Category</span>
              <div className="flex items-center gap-2 mt-1">
                <SeverityBadge severity={risk.severity} />
                <span className="text-xs text-slate-600 font-medium">{risk.category}</span>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-xs text-slate-500 font-medium">Likelihood</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{risk.likelihood_pct}%</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
              <span className="text-xs text-slate-500 font-medium">Potential Impact</span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{formatINR(risk.impact_inr)}</p>
            </div>
          </div>

          {/* Expected Annual Loss Callout */}
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-rose-800 uppercase tracking-wide">Expected Annual Financial Loss</span>
              <p className="text-2xl font-bold text-rose-950 mt-0.5">{formatINR(risk.expected_loss_inr)}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-rose-700 bg-rose-100 px-2 py-1 rounded font-medium border border-rose-200">
                AI Confidence: {risk.confidence_score_pct}%
              </span>
            </div>
          </div>

          {/* Why is this risk high? */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Why is this risk high?
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {whyHighFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Actions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Recommended Risk Reduction Actions
            </h4>
            <div className="space-y-2">
              {recommendedActions.map((act, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200 rounded-md hover:border-blue-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold text-slate-900">{act.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                      {act.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-slate-600 font-mono">
                    <span>Cost: {formatINR(act.cost)}</span>
                    <span className="text-emerald-700 font-semibold">Risk Reduction: {formatINR(act.reduction)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          {onNavigateToOptimizer && (
            <button
              onClick={() => {
                onClose();
                onNavigateToOptimizer();
              }}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Optimize Security Budget for this Risk
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
