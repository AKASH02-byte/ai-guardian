import type { Asset, OptimizeResponse, Recommendation, SecurityControl, SimulationResponse, Threat, Vulnerability } from '../types';
import type { EntityProfile } from './entityProfiles';

const baselineRisk = 4260000;
const scaleFor = (entity: EntityProfile) => entity.dashboard.metrics.current_cyber_risk_inr / baselineRisk;
const money = (value: number, scale: number) => Math.round(value * scale);

export const entityAssets = (items: Asset[], entity: EntityProfile): Asset[] => {
  const scale = scaleFor(entity);
  return items.map((item) => ({ ...item, business_value_inr: money(item.business_value_inr, scale), risk_score: Math.min(100, Math.round(item.risk_score + (68 - entity.dashboard.metrics.security_posture_score) / 3)) }));
};
export const entityVulnerabilities = (items: Vulnerability[], entity: EntityProfile): Vulnerability[] => {
  const scale = scaleFor(entity);
  return items.map((item) => ({ ...item, priority_risk_score: Math.min(100, Math.round(item.priority_risk_score * Math.max(0.75, Math.min(scale, 1.35)))) }));
};
export const entityThreats = (items: Threat[], entity: EntityProfile): Threat[] => {
  const scale = scaleFor(entity);
  return items.map((item) => ({ ...item, risk_contribution_inr: money(item.risk_contribution_inr, scale), likelihood_percentage: Math.min(95, Math.round(item.likelihood_percentage + (68 - entity.dashboard.metrics.security_posture_score) / 4)) }));
};
export const entityControls = (items: SecurityControl[], entity: EntityProfile): SecurityControl[] => {
  const scale = Math.max(0.6, Math.min(2.5, entity.dashboard.metrics.security_budget_inr / 1000000));
  const coverageShift = Math.round((entity.dashboard.metrics.security_posture_score - 68) / 3);
  return items.map((item) => ({ ...item, cost_inr: money(item.cost_inr, scale), estimated_risk_reduction_inr: money(item.estimated_risk_reduction_inr, scaleFor(entity)), current_coverage_pct: Math.max(10, Math.min(100, item.current_coverage_pct + coverageShift)) }));
};
export const entityRecommendations = (items: Recommendation[], entity: EntityProfile): Recommendation[] => {
  const scale = scaleFor(entity);
  return items.map((item) => ({ ...item, expected_loss_reduction_inr: money(item.expected_loss_reduction_inr, scale), cost_inr: money(item.cost_inr, Math.max(0.6, Math.min(2.5, entity.dashboard.metrics.security_budget_inr / 1000000))) }));
};
export const entityOptimization = (result: OptimizeResponse, entity: EntityProfile, budget: number): OptimizeResponse => {
  const current = entity.dashboard.metrics.current_cyber_risk_inr;
  const reduction = Math.min(current * 0.8, money(result.total_risk_reduction_inr, scaleFor(entity)));
  const investment = Math.min(budget, money(result.total_investment_inr, Math.max(0.6, Math.min(2.5, entity.dashboard.metrics.security_budget_inr / 1000000))));
  return { ...result, available_budget_inr: budget, current_risk_inr: current, total_risk_reduction_inr: reduction, projected_risk_inr: current - reduction, total_investment_inr: investment, remaining_budget_inr: Math.max(0, budget - investment), efficiency_ratio: Number((reduction / Math.max(investment, 1)).toFixed(2)), recommended_plan: result.recommended_plan.map((item) => ({ ...item, cost_inr: money(item.cost_inr, investment / Math.max(result.total_investment_inr, 1)), expected_risk_reduction_inr: money(item.expected_risk_reduction_inr, scaleFor(entity)) })) };
};
export const entitySimulation = (result: SimulationResponse, entity: EntityProfile): SimulationResponse => {
  const current = entity.dashboard.metrics.current_cyber_risk_inr;
  const ratio = current / Math.max(result.current_risk_inr, 1);
  const reduction = money(result.risk_reduction_inr, ratio);
  return { ...result, current_risk_inr: current, new_risk_inr: Math.max(0, current - reduction), risk_reduction_inr: reduction, total_cost_inr: money(result.total_cost_inr, Math.max(0.6, Math.min(2.5, entity.dashboard.metrics.security_budget_inr / 1000000))), timeline: result.timeline.map((step) => ({ ...step, risk_after_inr: money(step.risk_after_inr, ratio), risk_reduction_inr: money(step.risk_reduction_inr, ratio) })) };
};
