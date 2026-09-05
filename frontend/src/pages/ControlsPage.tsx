import React, { useEffect, useState } from 'react';
import { api, formatINR } from '../services/api';
import type { SecurityControl } from '../types';
import { ShieldCheck } from 'lucide-react';
import { useEntity } from '../context/EntityContext';
import { entityControls } from '../data/entityData';

export const ControlsPage: React.FC = () => {
  const [controls, setControls] = useState<SecurityControl[]>([]);
  const [loading, setLoading] = useState(true);
  const { entity } = useEntity();

  useEffect(() => {
    loadControls();
  }, [entity]);

  const loadControls = async () => {
    try {
      setLoading(true);
      const res = await api.getControls();
      setControls(entityControls(res, entity));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Security Controls Inventory...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Security Controls & Defense Mitigation Coverage
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Audit of implemented security controls, financial cost, deployment coverage, and quantified risk reduction.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded border border-emerald-200 font-mono font-semibold">
            {controls.length} Security Controls
          </span>
        </div>
      </div>

      {/* Controls Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Control Efficacy & Financial ROI</h3>
          <span className="text-xs text-slate-500">Updated from enterprise SIEM/EDR integration</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Control ID</th>
                <th className="px-4 py-3 font-semibold">Security Control</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Implementation Cost</th>
                <th className="px-4 py-3 font-semibold">Current Coverage</th>
                <th className="px-4 py-3 font-semibold">Effectiveness</th>
                <th className="px-4 py-3 font-semibold">Estimated Risk Reduction</th>
                <th className="px-4 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {controls.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{c.control_id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.category}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-900">{formatINR(c.cost_inr)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300">
                        <div
                          className={`h-full rounded-full ${
                            c.current_coverage_pct >= 75
                              ? 'bg-emerald-500'
                              : c.current_coverage_pct >= 50
                              ? 'bg-blue-600'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${c.current_coverage_pct}%` }}
                        ></div>
                      </div>
                      <span className="font-mono text-slate-700 font-semibold">{c.current_coverage_pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {c.effectiveness_rating}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                    {formatINR(c.estimated_risk_reduction_inr)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border ${
                        c.status === 'Implemented'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : c.status === 'Partially Implemented'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
