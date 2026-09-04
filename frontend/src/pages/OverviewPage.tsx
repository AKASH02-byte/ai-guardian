import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  ArrowUpRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { api, formatINR } from '../services/api';
import type { DashboardData, TopRiskItem } from '../types';
import { MetricCard } from '../components/MetricCard';
import { SeverityBadge } from '../components/SeverityBadge';
import { RiskDetailDrawer } from '../components/RiskDetailDrawer';

interface OverviewPageProps {
  onNavigateTab: (tab: any) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigateTab }) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState<TopRiskItem | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-slate-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  const { metrics, risk_trend, risk_by_category, top_risks, security_posture } = data;

  const categoryColors = ['#DC2626', '#EA580C', '#D97706', '#0284C7', '#4F46E5', '#64748B'];

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Top Banner / Actions */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-lg shadow-sm border border-slate-800">
        <div>
          <h2 className="font-bold text-base flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Continuous Cyber Risk Assessment
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Enterprise financial exposure calculated across 20 critical infrastructure assets & live threat telemetry.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Telemetry
          </button>
          <button
            onClick={() => onNavigateTab('optimizer')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <TrendingUp className="w-4 h-4" />
            Optimize Security Budget (₹10L)
          </button>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Current Cyber Risk"
          value={formatINR(metrics.current_cyber_risk_inr)}
          subtitle="Quantified aggregate risk"
          trend="up"
          trendValue="↑ ₹1.2L this week"
          trendIsGood={false}
          highlightColor="rose"
        />
        <MetricCard
          title="Expected Annual Loss"
          value={formatINR(metrics.expected_annual_loss_inr)}
          subtitle="Probabilistic annualized loss"
          trend="up"
          trendValue="↑ 4.2%"
          trendIsGood={false}
          highlightColor="amber"
        />
        <MetricCard
          title="Security Posture"
          value={`${metrics.security_posture_score} / 100`}
          subtitle="NIST CSF aggregate score"
          trend="stable"
          trendValue="Good"
          trendIsGood={true}
          highlightColor="blue"
        />
        <MetricCard
          title="Critical Risks"
          value={metrics.critical_risks_count}
          subtitle="Requiring urgent remediation"
          trend="up"
          trendValue="7 Active"
          trendIsGood={false}
          highlightColor="rose"
        />
        <MetricCard
          title="Security Budget"
          value={formatINR(metrics.security_budget_inr)}
          subtitle="Available FY26 capital"
          trend="stable"
          trendValue="Allocated"
          trendIsGood={true}
          highlightColor="emerald"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">30-Day Risk Exposure Trend</h3>
              <p className="text-xs text-slate-500">Continuous risk quantification vs Expected Annual Loss (INR)</p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
              Last 30 Days
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={risk_trend}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284C7" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748B' }}
                  tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), 'Value']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#F8FAFC', borderRadius: '6px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="risk_inr" name="Current Cyber Risk" stroke="#DC2626" strokeWidth={2} fillOpacity={1} fill="url(#riskGrad)" />
                <Area type="monotone" dataKey="expected_loss_inr" name="Expected Annual Loss" stroke="#0284C7" strokeWidth={2} fillOpacity={1} fill="url(#lossGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk by Category (1 col) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Risk by Category</h3>
              <p className="text-xs text-slate-500">Distribution of financial risk exposure</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={risk_by_category} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                <XAxis type="number" tickFormatter={(val) => `₹${(val / 100000).toFixed(0)}L`} tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#334155' }} width={120} tickLine={false} />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), 'Risk Exposure']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#F8FAFC', borderRadius: '6px', fontSize: '12px' }}
                />
                <Bar dataKey="risk_inr" radius={[0, 4, 4, 0]}>
                  {risk_by_category.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Risks Table & Security Posture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Risks Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Top Cyber Risk Exposures</h3>
              <p className="text-xs text-slate-500">Sorted by Expected Annual Loss (INR)</p>
            </div>
            <button
              onClick={() => onNavigateTab('risk-intelligence')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View All Risks <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 uppercase font-mono text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Risk Title</th>
                  <th className="px-4 py-3 font-semibold">Asset</th>
                  <th className="px-4 py-3 font-semibold">Likelihood</th>
                  <th className="px-4 py-3 font-semibold">Impact</th>
                  <th className="px-4 py-3 font-semibold">Expected Loss</th>
                  <th className="px-4 py-3 font-semibold">Severity</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {top_risks.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-900">{r.risk_title}</td>
                    <td className="px-4 py-3 text-slate-600 font-mono text-[11px]">{r.asset_name}</td>
                    <td className="px-4 py-3 text-slate-800 font-semibold">{r.likelihood_pct}%</td>
                    <td className="px-4 py-3 text-slate-600 font-mono">{formatINR(r.impact_inr)}</td>
                    <td className="px-4 py-3 text-rose-700 font-bold font-mono">{formatINR(r.expected_loss_inr)}</td>
                    <td className="px-4 py-3">
                      <SeverityBadge severity={r.severity} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedRisk(r)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-0.5"
                      >
                        Inspect <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Posture NIST CSF (1 col) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">NIST CSF Posture</h3>
                <p className="text-xs text-slate-500">Framework Domain Maturity</p>
              </div>
              <span className="text-xs font-bold text-slate-900 bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200 font-mono">
                Overall: {metrics.security_posture_score}/100
              </span>
            </div>

            <div className="space-y-4">
              {security_posture.map((p) => (
                <div key={p.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800">{p.name}</span>
                    <span className="font-mono text-slate-600">{p.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        p.score >= 75
                          ? 'bg-emerald-500'
                          : p.score >= 60
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${p.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Next Assessment: In 14 days</span>
            <button
              onClick={() => onNavigateTab('controls')}
              className="text-blue-600 font-medium hover:underline"
            >
              View Controls →
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Risk Detail Inspector Drawer */}
      <RiskDetailDrawer
        risk={selectedRisk}
        onClose={() => setSelectedRisk(null)}
        onNavigateToOptimizer={() => onNavigateTab('optimizer')}
      />
    </div>
  );
};
