import React, { useEffect, useState } from 'react';
import { api, formatINR } from '../services/api';
import type { Recommendation } from '../types';
import { Sparkles, AlertCircle } from 'lucide-react';
import { SeverityBadge } from '../components/SeverityBadge';
import { useEntity } from '../context/EntityContext';
import { entityRecommendations } from '../data/entityData';

interface RecommendationsPageProps {
  onNavigateTab: (tab: any) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({ onNavigateTab }) => {
  const { entity } = useEntity();
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecs();
  }, [entity]);

  const loadRecs = async () => {
    try {
      setLoading(true);
      const res = await api.getRecommendations();
      setRecs(entityRecommendations(res, entity));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Generating Explainable AI Recommendations...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Explainable AI Security Recommendations
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Prioritized actionable security investments with transparent rationale and feature importance factor analysis.
          </p>
        </div>
        <button
          onClick={() => onNavigateTab('optimizer')}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
        >
          Auto-Fit to Budget ({formatINR(entity.dashboard.metrics.security_budget_inr)})
        </button>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {recs.map((r) => (
          <div key={r.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <SeverityBadge severity={r.priority} />
                  <span className="text-xs text-slate-500 font-mono">{r.category}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{r.title}</h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-slate-500 block">Implementation Cost</span>
                  <span className="font-bold text-slate-900">{formatINR(r.cost_inr)}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Expected Loss Reduction</span>
                  <span className="font-bold text-emerald-700">{formatINR(r.expected_loss_reduction_inr)}</span>
                </div>
                <div className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded border border-emerald-200 font-bold">
                  {r.roi_multiplier}x ROI
                </div>
              </div>
            </div>

            {/* Why This Recommendation? */}
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                Why this recommendation?
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">{r.why_text}</p>
            </div>

            {/* Risk Factors & Confidence */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-500">Risk Factors:</span>
                {r.risk_factors.map((factor, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-mono text-[11px]">
                    {factor}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                <span>AI Model Confidence:</span>
                <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {r.ai_confidence_pct}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
