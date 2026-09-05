import React, { useEffect, useState } from 'react';
import { api, formatINR } from '../services/api';
import type { Asset } from '../types';
import { SeverityBadge } from '../components/SeverityBadge';
import { Server, Search, Filter, Globe, Lock, X } from 'lucide-react';
import { useEntity } from '../context/EntityContext';
import { entityAssets } from '../data/entityData';

export const AssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const { entity } = useEntity();

  useEffect(() => {
    loadAssets();
  }, [entity]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const res = await api.getAssets();
      setAssets(entityAssets(res, entity));
      setSelectedAsset(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.asset_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || a.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const assetTypes = ['ALL', 'Database', 'API Server', 'Application Server', 'Cloud VM', 'Active Directory', 'Financial Gateway', 'Network Appliance'];

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading Enterprise Asset Inventory...</div>;
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-600" />
            Enterprise Infrastructure Asset Register
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Continuous asset discovery, criticality mapping, and business valuation.
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-200 font-semibold">
            Total Assets: {assets.length}
          </span>
        </div>
      </div>

      {/* Main Asset Table Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Asset ID, name, owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {assetTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <span className="text-xs text-slate-500">Showing {filteredAssets.length} of {assets.length} assets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Asset ID</th>
                <th className="px-4 py-3 font-semibold">Asset Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Owner</th>
                <th className="px-4 py-3 font-semibold">Business Value</th>
                <th className="px-4 py-3 font-semibold">Criticality</th>
                <th className="px-4 py-3 font-semibold">Exposure</th>
                <th className="px-4 py-3 font-semibold">Risk Score</th>
                <th className="px-4 py-3 font-semibold">Open Vulns</th>
                <th className="px-4 py-3 font-semibold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredAssets.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-blue-700">{a.asset_id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{a.name}</td>
                  <td className="px-4 py-3 text-slate-600">{a.type}</td>
                  <td className="px-4 py-3 text-slate-600">{a.owner}</td>
                  <td className="px-4 py-3 font-mono text-slate-800">{formatINR(a.business_value_inr)}</td>
                  <td className="px-4 py-3">
                    <SeverityBadge severity={a.business_criticality} />
                  </td>
                  <td className="px-4 py-3">
                    {a.internet_exposed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                        <Globe className="w-3 h-3" /> Internet Exposed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                        <Lock className="w-3 h-3" /> Internal Only
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold ${a.risk_score >= 75 ? 'text-rose-600' : a.risk_score >= 50 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {a.risk_score} / 100
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-800">{a.open_vulnerabilities_count}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedAsset(a)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium transition-colors"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Asset Detail Drawer */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">{selectedAsset.asset_id}</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedAsset.name}</h3>
              </div>
              <button onClick={() => setSelectedAsset(null)} className="p-1 rounded text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 font-medium">Department</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedAsset.department}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 font-medium">Data Sensitivity</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedAsset.data_sensitivity}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 font-medium">Business Valuation</span>
                <p className="font-bold text-slate-900 mt-0.5">{formatINR(selectedAsset.business_value_inr)}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 font-medium">Exposure Mode</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {selectedAsset.internet_exposed ? 'Public Facing (Internet)' : 'Private Subnet'}
                </p>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded p-4 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-rose-800 uppercase">Current Asset Risk Score</span>
                <p className="text-2xl font-bold text-rose-950 mt-0.5">{selectedAsset.risk_score} / 100</p>
              </div>
              <SeverityBadge severity={selectedAsset.business_criticality} />
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase">Security Telemetry</h4>
              <ul className="space-y-2">
                <li className="flex justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-600">Open Vulnerabilities</span>
                  <span className="font-mono font-bold text-rose-600">{selectedAsset.open_vulnerabilities_count} Open</span>
                </li>
                <li className="flex justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-600">Active EDR Protection</span>
                  <span className="font-mono text-emerald-600 font-semibold">Active Agent</span>
                </li>
                <li className="flex justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-600">MFA Enforced</span>
                  <span className="font-mono text-amber-600 font-semibold">Partial Enforce</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
