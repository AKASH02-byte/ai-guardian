import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Vulnerability } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import { Bug, Search, Globe, Flame, Info } from 'lucide-react';

export const VulnerabilitiesPage: React.FC = () => {
  const [vulns, setVulns] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [exploitableFilter, setExploitableFilter] = useState(false);
  const [exposedFilter, setExposedFilter] = useState(false);

  useEffect(() => {
    loadVulns();
  }, [exploitableFilter, exposedFilter]);

  const loadVulns = async () => {
    try {
      setLoading(true);
      const res = await api.getVulnerabilities({
        exploitable: exploitableFilter,
        exposed: exposedFilter
      });
      setVulns(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVulns = vulns.filter((v) => {
    return (
      v.cve_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.asset_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading AI Prioritized Vulnerability Register...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bug className="w-5 h-5 text-rose-600" />
            AI-Prioritized Vulnerability Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Vulnerabilities are prioritized by business financial impact, threat signals, and asset criticality — NOT raw CVSS alone.
          </p>
        </div>

        {/* Explainability Pill */}
        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-3 py-2 rounded-md text-xs flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            <strong>AI Prioritization Formula:</strong> CVSS (35%) + Exploit Payload (30%) + Exposure (20%) x Asset Criticality Factor
          </span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search CVE, title, asset..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
              />
            </div>

            {/* Quick Filter Buttons */}
            <button
              onClick={() => setExploitableFilter(!exploitableFilter)}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                exploitableFilter
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Exploit Available Only
            </button>

            <button
              onClick={() => setExposedFilter(!exposedFilter)}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                exposedFilter
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Internet Exposed Only
            </button>
          </div>

          <span className="text-xs font-mono font-medium text-slate-500">
            Showing {filteredVulns.length} prioritized vulnerabilities
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">CVE ID</th>
                <th className="px-4 py-3 font-semibold">Vulnerability Title</th>
                <th className="px-4 py-3 font-semibold">Asset</th>
                <th className="px-4 py-3 font-semibold">Raw CVSS</th>
                <th className="px-4 py-3 font-semibold">Exploit Status</th>
                <th className="px-4 py-3 font-semibold">Exposure</th>
                <th className="px-4 py-3 font-semibold">Criticality</th>
                <th className="px-4 py-3 font-semibold">AI Risk Score</th>
                <th className="px-4 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredVulns.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-rose-700">{v.cve_id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate" title={v.title}>
                    {v.title}
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-mono text-[11px]">{v.asset_name}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-700">{v.cvss_score} / 10</td>
                  <td className="px-4 py-3">
                    {v.exploit_available ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded border border-rose-300">
                        <Flame className="w-3 h-3 text-rose-600" /> Active Exploit
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono text-[11px]">POC Only</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {v.internet_exposed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                        <Globe className="w-3 h-3 text-amber-600" /> Exposed
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Internal</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={v.business_criticality} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                      {v.priority_risk_score} / 100
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-600">{v.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
