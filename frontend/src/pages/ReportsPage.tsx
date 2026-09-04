import React, { useEffect, useState } from 'react';
import { api, formatINR } from '../services/api';
import type { ExecutiveReport } from '../types';
import { Printer, FileText, Calendar } from 'lucide-react';
import { SeverityBadge } from '../components/SeverityBadge';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<ExecutiveReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const res = await api.getExecutiveReport();
      setReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return <div className="p-8 text-center text-slate-500">Generating Executive Risk Report...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      {/* Header Bar (no-print) */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between no-print">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            Executive Cyber Risk Summary Report
          </h2>
          <p className="text-xs text-slate-500">Printable C-Suite & Board presentation document</p>
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs"
        >
          <Printer className="w-4 h-4" />
          Print Executive Report
        </button>
      </div>

      {/* Printable Report Document Body */}
      <div className="bg-white p-8 rounded-lg border border-slate-300 shadow-sm space-y-6 text-slate-900">
        {/* Report Header */}
        <div className="border-b border-slate-200 pb-5 flex items-start justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
              AI GUARDIAN • SIH26105
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight mt-1">{report.organization_name}</h1>
            <p className="text-sm font-semibold text-slate-600">Executive Cyber Risk & Investment Optimization Report</p>
          </div>
          <div className="text-right text-xs font-mono text-slate-500">
            <p className="flex items-center gap-1 justify-end"><Calendar className="w-3.5 h-3.5" /> {report.generated_at}</p>
            <p className="text-[11px] text-slate-400 mt-1">Classification: Strictly Confidential</p>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 font-sans block">Current Cyber Risk</span>
            <span className="text-xl font-bold text-rose-700">{formatINR(report.current_cyber_risk_inr)}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 font-sans block">Expected Annual Loss</span>
            <span className="text-xl font-bold text-amber-700">{formatINR(report.expected_annual_loss_inr)}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 font-sans block">Security Posture Score</span>
            <span className="text-xl font-bold text-blue-700">{report.security_posture_score} / 100</span>
          </div>
          <div className="p-4 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-500 font-sans block">Available Budget</span>
            <span className="text-xl font-bold text-emerald-700">{formatINR(report.security_budget_inr)}</span>
          </div>
        </div>

        {/* Top Risks Exposure Section */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900 border-b border-slate-200 pb-2">
            1. Top Identified Cyber Risk Exposures
          </h3>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-2 border-b border-r">Risk Title</th>
                <th className="p-2 border-b border-r">Target Asset</th>
                <th className="p-2 border-b border-r">Likelihood</th>
                <th className="p-2 border-b border-r">Financial Impact</th>
                <th className="p-2 border-b border-r">Expected Loss</th>
                <th className="p-2 border-b">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {report.top_risks.map((r) => (
                <tr key={r.id}>
                  <td className="p-2 font-sans font-semibold border-r">{r.risk_title}</td>
                  <td className="p-2 border-r">{r.asset_name}</td>
                  <td className="p-2 border-r font-bold">{r.likelihood_pct}%</td>
                  <td className="p-2 border-r">{formatINR(r.impact_inr)}</td>
                  <td className="p-2 border-r font-bold text-rose-700">{formatINR(r.expected_loss_inr)}</td>
                  <td className="p-2 font-sans">
                    <SeverityBadge severity={r.severity} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top AI Recommendations */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-900 border-b border-slate-200 pb-2">
            2. Recommended High-ROI Investment Actions
          </h3>
          <div className="space-y-2 text-xs">
            {report.top_recommendations.map((rec) => (
              <div key={rec.id} className="p-3 bg-slate-50 border border-slate-200 rounded">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{rec.title}</span>
                  <span className="font-mono text-emerald-700">↓ Risk Reduction: {formatINR(rec.expected_loss_reduction_inr)}</span>
                </div>
                <p className="text-slate-600 mt-1">{rec.why_text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Signatures */}
        <div className="pt-8 border-t border-slate-200 flex justify-between text-xs text-slate-600 font-mono">
          <div>
            <p className="font-bold text-slate-900">Prepared by:</p>
            <p className="mt-6">Anand V. (Chief Information Security Officer)</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-slate-900">Approved by:</p>
            <p className="mt-6">Board Risk & Audit Committee</p>
          </div>
        </div>
      </div>
    </div>
  );
};
