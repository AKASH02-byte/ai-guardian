export interface OverviewMetrics {
  current_cyber_risk_inr: number;
  expected_annual_loss_inr: number;
  security_posture_score: number;
  critical_risks_count: number;
  security_budget_inr: number;
}

export interface RiskTrendPoint {
  date: string;
  risk_inr: number;
  expected_loss_inr: number;
  posture_score: number;
}

export interface CategoryRisk {
  category: string;
  risk_inr: number;
  percentage: number;
}

export interface TopRiskItem {
  id: number;
  risk_title: string;
  category: string;
  asset_name: string;
  likelihood_pct: number;
  impact_inr: number;
  expected_loss_inr: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  trend: 'UP' | 'DOWN' | 'STABLE';
  confidence_score_pct: number;
}

export interface SecurityPostureCategory {
  name: string;
  score: number;
  status: string;
}

export interface DashboardData {
  metrics: OverviewMetrics;
  risk_trend: RiskTrendPoint[];
  risk_by_category: CategoryRisk[];
  top_risks: TopRiskItem[];
  security_posture: SecurityPostureCategory[];
}

export interface Asset {
  id: number;
  asset_id: string;
  name: string;
  type: string;
  owner: string;
  department: string;
  business_criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  internet_exposed: boolean;
  business_value_inr: number;
  data_sensitivity: string;
  risk_score: number;
  open_vulnerabilities_count: number;
  status: string;
}

export interface Vulnerability {
  id: number;
  cve_id: string;
  title: string;
  description?: string;
  asset_id: string;
  asset_name: string;
  cvss_score: number;
  exploit_available: boolean;
  internet_exposed: boolean;
  business_criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  priority_risk_score: number;
  status: string;
}

export interface Threat {
  id: number;
  threat_id: string;
  name: string;
  type: string;
  likelihood_percentage: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  affected_assets_count: number;
  recent_activity: string;
  risk_contribution_inr: number;
}

export interface SecurityControl {
  id: number;
  control_id: string;
  name: string;
  category: string;
  cost_inr: number;
  current_coverage_pct: number;
  effectiveness_rating: string;
  estimated_risk_reduction_inr: number;
  status: string;
}

export interface SelectedControlPlanItem {
  control_id: string;
  name: string;
  cost_inr: number;
  expected_risk_reduction_inr: number;
  roi_multiplier: number;
  priority: string;
}

export interface OptimizeResponse {
  available_budget_inr: number;
  total_investment_inr: number;
  current_risk_inr: number;
  projected_risk_inr: number;
  total_risk_reduction_inr: number;
  remaining_budget_inr: number;
  efficiency_ratio: number;
  recommended_plan: SelectedControlPlanItem[];
}

export interface SimulationStep {
  step_name: string;
  control_name?: string | null;
  risk_after_inr: number;
  risk_reduction_inr: number;
}

export interface SimulationResponse {
  selected_controls_count: number;
  total_cost_inr: number;
  current_risk_inr: number;
  new_risk_inr: number;
  risk_reduction_inr: number;
  residual_risk_pct: number;
  roi_multiplier: number;
  timeline: SimulationStep[];
}

export interface Recommendation {
  id: number;
  title: string;
  category: string;
  target_control_id?: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  expected_loss_reduction_inr: number;
  cost_inr: number;
  roi_multiplier: number;
  ai_confidence_pct: number;
  why_text: string;
  risk_factors: string[];
}

export interface ExecutiveReport {
  generated_at: string;
  organization_name: string;
  current_cyber_risk_inr: number;
  expected_annual_loss_inr: number;
  security_posture_score: number;
  critical_risks_count: number;
  security_budget_inr: number;
  top_recommendations: Recommendation[];
  top_risks: TopRiskItem[];
  security_posture: SecurityPostureCategory[];
}
