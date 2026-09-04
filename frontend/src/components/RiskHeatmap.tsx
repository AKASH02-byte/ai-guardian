import React from 'react';
import type { TopRiskItem } from '../types';
import { formatINR } from '../services/api';

interface RiskHeatmapProps {
  risks: TopRiskItem[];
  onSelectRisk: (risk: TopRiskItem) => void;
}

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ risks, onSelectRisk }) => {
  const impacts = ['Critical', 'High', 'Medium', 'Low'];
  const likelihoods = ['Low', 'Medium', 'High', 'Critical'];

  const getSeverityCellColor = (imp: string, lik: string) => {
    if ((imp === 'Critical' && (lik === 'Critical' || lik === 'High')) || (imp === 'High' && lik === 'Critical')) {
      return 'bg-rose-100 hover:bg-rose-200 border-rose-300 text-rose-900';
    }
    if ((imp === 'High' && lik === 'High') || (imp === 'Critical' && lik === 'Medium') || (imp === 'Medium' && lik === 'Critical')) {
      return 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900';
    }
    if ((imp === 'Medium' && lik === 'Medium') || (imp === 'Low' && lik === 'High') || (imp === 'High' && lik === 'Low')) {
      return 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-900';
    }
    return 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900';
  };

  const getRisksInCell = (imp: string, lik: string) => {
    return risks.filter((r) => {
      let matchesImp = false;
      if (imp === 'Critical') matchesImp = r.impact_inr >= 3500000;
      else if (imp === 'High') matchesImp = r.impact_inr >= 2000000 && r.impact_inr < 3500000;
      else if (imp === 'Medium') matchesImp = r.impact_inr >= 1000000 && r.impact_inr < 2000000;
      else matchesImp = r.impact_inr < 1000000;

      let matchesLik = false;
      if (lik === 'Critical') matchesLik = r.likelihood_pct >= 30;
      else if (lik === 'High') matchesLik = r.likelihood_pct >= 20 && r.likelihood_pct < 30;
      else if (lik === 'Medium') matchesLik = r.likelihood_pct >= 10 && r.likelihood_pct < 20;
      else matchesLik = r.likelihood_pct < 10;

      return matchesImp && matchesLik;
    });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Risk Heatmap Matrix</h3>
          <p className="text-xs text-slate-500">Financial Impact vs Threat Likelihood</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500 inline-block"></span> Critical</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span> High</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-yellow-400 inline-block"></span> Medium</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> Low</span>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {/* Y Axis Label header */}
        <div className="text-xs font-semibold text-slate-400 flex items-center justify-center border-b border-slate-100 pb-2">
          Impact ↓ / Likelihood →
        </div>
        {likelihoods.map((lik) => (
          <div key={lik} className="text-xs font-semibold text-slate-600 text-center border-b border-slate-100 pb-2">
            {lik}
          </div>
        ))}

        {impacts.map((imp) => (
          <React.Fragment key={imp}>
            <div className="text-xs font-semibold text-slate-700 flex items-center pr-2">
              {imp}
            </div>
            {likelihoods.map((lik) => {
              const cellRisks = getRisksInCell(imp, lik);
              const cellColor = getSeverityCellColor(imp, lik);
              return (
                <div
                  key={`${imp}-${lik}`}
                  className={`h-24 p-2 rounded border transition-colors flex flex-col justify-between overflow-hidden cursor-pointer ${cellColor}`}
                >
                  <div className="flex justify-between items-center text-[10px] font-mono opacity-70">
                    <span>{cellRisks.length} risks</span>
                  </div>
                  <div className="space-y-1 overflow-y-auto">
                    {cellRisks.map((r) => (
                      <div
                        key={r.id}
                        onClick={() => onSelectRisk(r)}
                        className="bg-white/90 hover:bg-white text-slate-900 px-1.5 py-1 rounded text-[11px] font-medium truncate shadow-2xs cursor-pointer border border-slate-200"
                        title={`${r.risk_title} (${formatINR(r.expected_loss_inr)})`}
                      >
                        {r.risk_title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
