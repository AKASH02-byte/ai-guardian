import React, { useState, useEffect } from 'react';
import { api, formatINR } from '../services/api';
import type { SecurityControl, SimulationResponse } from '../types';
import { Sliders, Sparkles, CheckSquare, Square } from 'lucide-react';
import { MetricCard } from '../components/MetricCard';

export const WhatIfSimulatorPage: React.FC = () => {
  const [controls, setControls] = useState<SecurityControl[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(['CTL-MFA', 'CTL-EDR', 'CTL-BACKUP']);
  const [simResult, setSimResult] = useState<SimulationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadControls();
  }, []);

  const loadControls = async () => {
    try {
      const res = await api.getControls();
      setControls(res);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateSimulation = async (ids: string[]) => {
    try {
      setLoading(true);
      const res = await api.runSimulation(ids);
      setSimResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateSimulation(selectedIds);
  }, [selectedIds]);

  const toggleControl = (cid: string) => {
    if (selectedIds.includes(cid)) {
      setSelectedIds(selectedIds.filter((id) => id !== cid));
    } else {
      setSelectedIds([...selectedIds, cid]);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-lg border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
            Interactive Scenario Engine
          </span>
          <h2 className="text-lg font-bold flex items-center gap-2 mt-0.5">
            <Sliders className="w-5 h-5 text-amber-400" />
            What-If Security Investment Simulator
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Toggle cybersecurity controls to recalculate financial risk exposure, ROI, and residual risk in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-xs font-mono">
          <span>Baseline Cyber Risk: <strong className="text-rose-400">₹42.6 Lakh</strong></span>
        </div>
      </div>

      {simResult && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            title="Baseline Risk"
            value={formatINR(simResult.current_risk_inr)}
            subtitle="Before controls applied"
            highlightColor="rose"
          />
          <MetricCard
            title="Simulated New Risk"
            value={formatINR(simResult.new_risk_inr)}
            subtitle={`${simResult.residual_risk_pct}% residual risk`}
            highlightColor="emerald"
          />
          <MetricCard
            title="Risk Reduction"
            value={formatINR(simResult.risk_reduction_inr)}
            subtitle="Mitigated financial exposure"
            trend="up"
            trendValue="Simulated"
            trendIsGood={true}
            highlightColor="blue"
          />
          <MetricCard
            title="Total Investment"
            value={formatINR(simResult.total_cost_inr)}
            subtitle={`${simResult.selected_controls_count} controls selected`}
            highlightColor="amber"
          />
          <MetricCard
            title="Projected ROI"
            value={`${simResult.roi_multiplier}x`}
            subtitle="Risk Reduction / ₹ Invested"
            trend="up"
            trendValue="Eff. Ratio"
            trendIsGood={true}
            highlightColor="emerald"
          />
        </div>
      )}

      {/* Main Layout: Left Control Toggles, Right Timeline & Calculations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Control Selector List (1 col) */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Select Security Controls</h3>
              <p className="text-xs text-slate-500">Toggle items to simulate impact</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {selectedIds.length} Active
            </span>
          </div>

          <div className="space-y-2">
            {controls.map((c) => {
              const isSelected = selectedIds.includes(c.control_id);
              return (
                <div
                  key={c.control_id}
                  onClick={() => toggleControl(c.control_id)}
                  className={`p-3 rounded-md border cursor-pointer transition-all flex items-start justify-between ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-500 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                      <span className="text-[11px] text-slate-500">{c.category}</span>
                    </div>
                  </div>

                  <div className="text-right text-xs font-mono">
                    <span className="font-bold text-slate-800 block">{formatINR(c.cost_inr)}</span>
                    <span className="text-emerald-700 font-medium text-[10px]">
                      ↓ {formatINR(c.estimated_risk_reduction_inr)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Timeline Visualization (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Cumulative Risk Reduction Progression
              </h3>
              <p className="text-xs text-slate-500">Step-by-step risk mitigation trajectory</p>
            </div>
            {loading && <span className="text-xs text-blue-600 font-mono animate-pulse">Recalculating...</span>}
          </div>

          {/* Timeline Cards */}
          {simResult && (
            <div className="space-y-3">
              {simResult.timeline.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border transition-all flex items-center justify-between ${
                    idx === 0
                      ? 'bg-rose-50/50 border-rose-200'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        idx === 0
                          ? 'bg-rose-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      {idx}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{step.step_name}</h4>
                      {step.control_name && (
                        <p className="text-[11px] text-emerald-700 font-medium">
                          Risk Reduced by: {formatINR(step.risk_reduction_inr)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                      Residual Risk
                    </span>
                    <span className="text-sm font-bold font-mono text-slate-900">
                      {formatINR(step.risk_after_inr)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
