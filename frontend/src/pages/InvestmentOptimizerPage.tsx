import React, { useState, useEffect } from 'react';
import { api, formatINR } from '../services/api';
import type { OptimizeResponse } from '../types';
import { TrendingUp, Calculator, CheckCircle2, Zap } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';

export const InvestmentOptimizerPage: React.FC = () => {
  const [budgetInput, setBudgetInput] = useState<number>(1000000); // Default ₹10 Lakhs
  const [result, setResult] = useState<OptimizeResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const runOptimization = async (b: number) => {
    try {
      setLoading(true);
      const res = await api.optimizeInvestment(b);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runOptimization(budgetInput);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runOptimization(budgetInput);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold">
            Integer Programming / 0-1 Knapsack Engine
          </span>
          <h2 className="text-lg font-bold flex items-center gap-2 mt-0.5">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Cybersecurity Investment Budget Optimizer
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Solves optimal capital allocation to maximize total risk reduction (₹) subject to your available cybersecurity budget constraint.
          </p>
        </div>

        {/* Quick Budget Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-slate-800 p-2 rounded-lg border border-slate-700">
          <label className="text-xs text-slate-300 font-medium pl-1">Available Budget:</label>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono">₹</span>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(Number(e.target.value))}
              step={50000}
              min={100000}
              className="pl-6 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-blue-500 w-36"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow-xs"
          >
            <Calculator className="w-3.5 h-3.5" />
            {loading ? 'Optimizing...' : 'Optimize'}
          </button>
        </form>
      </div>

      {result && (
        <>
          {/* Top 5 Output Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <MetricCard
              title="Current Risk"
              value={formatINR(result.current_risk_inr)}
              subtitle="Baseline financial exposure"
              highlightColor="rose"
            />
            <MetricCard
              title="Projected Risk"
              value={formatINR(result.projected_risk_inr)}
              subtitle="Residual risk after plan"
              highlightColor="emerald"
            />
            <MetricCard
              title="Risk Reduction"
              value={formatINR(result.total_risk_reduction_inr)}
              subtitle="Total exposure mitigated"
              trend="up"
              trendValue="High Impact"
              trendIsGood={true}
              highlightColor="blue"
            />
            <MetricCard
              title="Optimal Investment"
              value={formatINR(result.total_investment_inr)}
              subtitle={`Budget: ${formatINR(result.available_budget_inr)}`}
              highlightColor="amber"
            />
            <MetricCard
              title="Efficiency Ratio"
              value={`${result.efficiency_ratio}x`}
              subtitle="Risk Reduction / ₹ Invested"
              trend="up"
              trendValue="ROI Multiplier"
              trendIsGood={true}
              highlightColor="emerald"
            />
          </div>

          {/* Recommended Investment Plan Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Recommended Security Investment Plan
                </h3>
                <p className="text-xs text-slate-500">
                  Controls selected by 0-1 Knapsack optimization algorithm to maximize ROI
                </p>
              </div>
              <div className="text-xs font-mono text-slate-600 bg-slate-100 px-3 py-1 rounded border border-slate-200">
                Remaining Budget: <strong className="text-slate-900">{formatINR(result.remaining_budget_inr)}</strong>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 text-slate-600 uppercase font-mono text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Control ID</th>
                    <th className="px-4 py-3 font-semibold">Security Control Name</th>
                    <th className="px-4 py-3 font-semibold">Cost (INR)</th>
                    <th className="px-4 py-3 font-semibold">Expected Risk Reduction</th>
                    <th className="px-4 py-3 font-semibold">ROI Multiplier</th>
                    <th className="px-4 py-3 font-semibold text-right">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {result.recommended_plan.map((item) => (
                    <tr key={item.control_id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">{item.control_id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {item.name}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">{formatINR(item.cost_inr)}</td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-700">
                        {formatINR(item.expected_risk_reduction_inr)}
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-800">
                        <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
                          {item.roi_multiplier}x ROI
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            item.priority === 'High'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Note disclaimer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 font-mono">
              Note: Model output generated using quantitative risk parameters. Subject to organization risk appetite.
            </div>
          </div>
        </>
      )}
    </div>
  );
};
