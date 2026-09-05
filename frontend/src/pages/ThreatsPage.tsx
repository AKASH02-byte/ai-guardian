import React, { useEffect, useState } from 'react';
import { api, formatINR } from '../services/api';
import type { Threat } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import { useEntity } from '../context/EntityContext';
import { entityThreats } from '../data/entityData';
import { Flame, Activity, Clock } from 'lucide-react';

export const ThreatsPage: React.FC = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const { entity } = useEntity();

  useEffect(() => {
    loadThreats();
  }, [entity]);

  const loadThreats = async () => {
    try {
      setLoading(true);
      const res = await api.getThreats();
      setThreats(entityThreats(res, entity));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Threat Intelligence Telemetry...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600" />
            Threat Intelligence & Active Campaign Telemetry
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time cyber threat actor monitoring mapped to enterprise asset attack surfaces.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-amber-50 text-amber-800 px-3 py-1 rounded border border-amber-200 font-mono font-semibold">
            {threats.length} Active Threat Signals
          </span>
        </div>
      </div>

      {/* Threat Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {threats.map((t) => (
          <div key={t.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase">{t.threat_id}</span>
                <SeverityBadge severity={t.severity} />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{t.name}</h3>
              <p className="text-xs text-slate-500">{t.type}</p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Likelihood</span>
                <span className="font-bold text-slate-900">{t.likelihood_percentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Affected Assets</span>
                <span className="font-mono font-semibold text-slate-800">{t.affected_assets_count} Systems</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Risk Contribution</span>
                <span className="font-mono font-bold text-rose-700">{formatINR(t.risk_contribution_inr)}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-600 flex items-start gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>{t.recent_activity}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Threat Activity Timeline */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Recent Threat Activity Log & Signals
            </h3>
            <p className="text-xs text-slate-500">Chronological feed of threat vector developments</p>
          </div>
        </div>

        <div className="space-y-4 text-xs relative pl-4 border-l-2 border-slate-200">
          <div className="relative pl-4">
            <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-rose-600 ring-4 ring-white"></span>
            <div className="flex justify-between text-slate-500">
              <span className="font-mono font-semibold text-slate-900">LockBit 3.0 Ransomware Campaign</span>
              <span>Today, 14:20 IST</span>
            </div>
            <p className="text-slate-700 mt-1">
              Active exploitation of CVE-2024-3094 observed targeting Indian banking sector VPN gateways.
            </p>
          </div>

          <div className="relative pl-4">
            <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-white"></span>
            <div className="flex justify-between text-slate-500">
              <span className="font-mono font-semibold text-slate-900">Credential Spraying Attack Detected</span>
              <span>Yesterday, 19:45 IST</span>
            </div>
            <p className="text-slate-700 mt-1">
              1,420 failed authentication attempts recorded against Active Directory (AUTH-SRV-01) from external IP ranges.
            </p>
          </div>

          <div className="relative pl-4">
            <span className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></span>
            <div className="flex justify-between text-slate-500">
              <span className="font-mono font-semibold text-slate-900">HTTP/2 Rapid Reset Flooding</span>
              <span>2 days ago</span>
            </div>
            <p className="text-slate-700 mt-1">
              Volumetric spike mitigated by Edge Firewall (WAF-EDGE-01) without downtime on Payment Gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
