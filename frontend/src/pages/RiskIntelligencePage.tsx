import React, { useEffect, useState } from 'react';
import { formatINR } from '../services/api';
import { useEntity } from '../context/EntityContext';
import type { TopRiskItem } from '../types';
import { RiskHeatmap } from '../components/RiskHeatmap';
import { SeverityBadge } from '../components/SeverityBadge';
import { RiskDetailDrawer } from '../components/RiskDetailDrawer';
import { ArrowUpRight, Search, Filter, ShieldAlert } from 'lucide-react';

interface RiskIntelligencePageProps {
  onNavigateTab: (tab: any) => void;
}

export const RiskIntelligencePage: React.FC<RiskIntelligencePageProps> = ({ onNavigateTab }) => {
  const [risks, setRisks] = useState<TopRiskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState<TopRiskItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const { entity } = useEntity();

  useEffect(() => {
    setLoading(true);
    setRisks(entity.dashboard.top_risks);
    setSelectedRisk(null);
    setCategoryFilter('ALL');
    setLoading(false);
  }, [entity]);

  const filteredRisks = risks.filter((r) => {
    const matchesSearch =
      r.risk_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.asset_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'ALL' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const categories = ['ALL', ...new Set(risks.map((risk) => risk.category))];

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Risk Intelligence data...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Header info */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Risk Intelligence & Quantification Workspace
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Likelihood vs Impact mapping with AI-based confidence scoring and financial loss predictions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Total Tracked Risks:</span>
          <span className="text-sm font-bold text-slate-900 font-mono bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
            {risks.length}
          </span>
        </div>
      </div>

      {/* Heatmap Section */}
      <RiskHeatmap risks={risks} onSelectRisk={(r) => setSelectedRisk(r)} />

      {/* Risks Table Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Risk Inventory & Quantification</h3>
            <p className="text-xs text-slate-500">Select any risk to view root cause analysis and remediation options</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter risk title or asset..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-56"
              />
            </div>

            {/* Filter Category */}
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Risk Title</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Asset</th>
                <th className="px-4 py-3 font-semibold">Likelihood</th>
                <th className="px-4 py-3 font-semibold">Potential Impact</th>
                <th className="px-4 py-3 font-semibold">Expected Annual Loss</th>
                <th className="px-4 py-3 font-semibold">Severity</th>
                <th className="px-4 py-3 font-semibold">AI Conf.</th>
                <th className="px-4 py-3 font-semibold text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRisks.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-slate-900">{r.risk_title}</td>
                  <td className="px-4 py-3 text-slate-600">{r.category}</td>
                  <td className="px-4 py-3 text-slate-700 font-mono text-[11px]">{r.asset_name}</td>
                  <td className="px-4 py-3 text-slate-900 font-bold">{r.likelihood_pct}%</td>
                  <td className="px-4 py-3 text-slate-600 font-mono">{formatINR(r.impact_inr)}</td>
                  <td className="px-4 py-3 text-rose-700 font-bold font-mono">{formatINR(r.expected_loss_inr)}</td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={r.severity} />
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600">{r.confidence_score_pct}%</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedRisk(r)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium transition-colors inline-flex items-center gap-1"
                    >
                      View <ArrowUpRight className="w-3 h-3 text-slate-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RiskDetailDrawer
        risk={selectedRisk}
        onClose={() => setSelectedRisk(null)}
        onNavigateToOptimizer={() => onNavigateTab('optimizer')}
      />
    </div>
  );
};
