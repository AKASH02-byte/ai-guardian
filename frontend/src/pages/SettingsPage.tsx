import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Save, ShieldCheck, Database, Server } from 'lucide-react';
import { useEntity } from '../context/EntityContext';

export const SettingsPage: React.FC = () => {
  const { entity } = useEntity();
  const [orgName, setOrgName] = useState(entity.name);
  const [industry, setIndustry] = useState(entity.tier);
  const [defaultBudget, setDefaultBudget] = useState(entity.dashboard.metrics.security_budget_inr);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setOrgName(entity.name);
    setIndustry(entity.tier);
    setDefaultBudget(entity.dashboard.metrics.security_budget_inr);
    setSaved(false);
  }, [entity]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-slate-700" />
            Platform & Governance Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-1">Configure organizational parameters, risk thresholds, and API connectors.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Organization Settings */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
            1. Organization Profile
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Industry Sector</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Default Security Capital Budget (INR)</label>
              <input
                type="number"
                value={defaultBudget}
                onChange={(e) => setDefaultBudget(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-900 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Currency Base</label>
              <input
                type="text"
                value="INR (₹)"
                disabled
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded text-slate-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* API Telemetry Connectors */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2">
            2. Enterprise Telemetry Integration Status
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-900">Splunk / SIEM Connector</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                Connected (Live Sync)
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-900">CrowdStrike EDR Telemetry API</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                Connected (Live Sync)
              </span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded border border-slate-200">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-slate-900">Tenable Vulnerability Scanner API</span>
              </div>
              <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                Connected (Live Sync)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {saved && <span className="text-xs text-emerald-600 font-semibold font-mono">Settings saved successfully!</span>}
          <button
            type="submit"
            className="ml-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
