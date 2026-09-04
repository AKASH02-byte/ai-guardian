from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Dashboard Schemas ---
class OverviewMetrics(BaseModel):
    current_cyber_risk_inr: float = Field(..., description="Current Overall Cyber Risk in INR")
    expected_annual_loss_inr: float = Field(..., description="Expected Annual Loss in INR")
    security_posture_score: float = Field(..., description="Security Posture Score (0-100)")
    critical_risks_count: int = Field(..., description="Count of Critical Severity Risks")
    security_budget_inr: float = Field(..., description="Total Security Budget in INR")

class RiskTrendPoint(BaseModel):
    date: str
    risk_inr: float
    expected_loss_inr: float
    posture_score: float

class CategoryRisk(BaseModel):
    category: str
    risk_inr: float
    percentage: float

class TopRiskItem(BaseModel):
    id: int
    risk_title: str
    category: str
    asset_name: str
    likelihood_pct: float
    impact_inr: float
    expected_loss_inr: float
    severity: str
    trend: str
    confidence_score_pct: float

class SecurityPostureCategory(BaseModel):
    name: str # Govern, Identify, Protect, Detect, Respond, Recover
    score: float # 0 - 100
    status: str # Excellent, Good, Fair, Needs Improvement

class DashboardResponse(BaseModel):
    metrics: OverviewMetrics
    risk_trend: List[RiskTrendPoint]
    risk_by_category: List[CategoryRisk]
    top_risks: List[TopRiskItem]
    security_posture: List[SecurityPostureCategory]

# --- Asset Schemas ---
class AssetResponse(BaseModel):
    id: int
    asset_id: str
    name: str
    type: str
    owner: str
    department: str
    business_criticality: str
    internet_exposed: bool
    business_value_inr: float
    data_sensitivity: str
    risk_score: float
    open_vulnerabilities_count: int
    status: str

class AssetDetailResponse(AssetResponse):
    vulnerabilities: List[dict]
    incidents: List[dict]
    threats: List[dict]
    risk_history: List[dict]

# --- Vulnerability Schemas ---
class VulnerabilityResponse(BaseModel):
    id: int
    cve_id: str
    title: str
    description: Optional[str] = None
    asset_id: str
    asset_name: str
    cvss_score: float
    exploit_available: bool
    internet_exposed: bool
    business_criticality: str
    priority_risk_score: float
    status: str

# --- Threat Schemas ---
class ThreatResponse(BaseModel):
    id: int
    threat_id: str
    name: str
    type: str
    likelihood_percentage: float
    severity: str
    affected_assets_count: int
    recent_activity: str
    risk_contribution_inr: float

# --- Security Control Schemas ---
class ControlResponse(BaseModel):
    id: int
    control_id: str
    name: str
    category: str
    cost_inr: float
    current_coverage_pct: float
    effectiveness_rating: str
    estimated_risk_reduction_inr: float
    status: str

# --- Investment Optimizer Schemas ---
class OptimizeRequest(BaseModel):
    available_budget_inr: float = Field(default=1000000.0, ge=0.0)

class SelectedControlPlanItem(BaseModel):
    control_id: str
    name: str
    cost_inr: float
    expected_risk_reduction_inr: float
    roi_multiplier: float
    priority: str

class OptimizeResponse(BaseModel):
    available_budget_inr: float
    total_investment_inr: float
    current_risk_inr: float
    projected_risk_inr: float
    total_risk_reduction_inr: float
    remaining_budget_inr: float
    efficiency_ratio: float # Risk reduction per ₹ invested
    recommended_plan: List[SelectedControlPlanItem]

# --- Simulation Schemas ---
class SimulationRequest(BaseModel):
    selected_control_ids: List[str] # e.g. ["CTL-MFA", "CTL-EDR", "CTL-BACKUP"]

class SimulationStep(BaseModel):
    step_name: str
    control_name: Optional[str] = None
    risk_after_inr: float
    risk_reduction_inr: float

class SimulationResponse(BaseModel):
    selected_controls_count: int
    total_cost_inr: float
    current_risk_inr: float
    new_risk_inr: float
    risk_reduction_inr: float
    residual_risk_pct: float
    roi_multiplier: float
    timeline: List[SimulationStep]

# --- Recommendation Schemas ---
class RecommendationResponse(BaseModel):
    id: int
    title: str
    category: str
    target_control_id: Optional[str] = None
    priority: str
    expected_loss_reduction_inr: float
    cost_inr: float
    roi_multiplier: float
    ai_confidence_pct: float
    why_text: str
    risk_factors: List[str]

# --- Report Schemas ---
class ExecutiveReportResponse(BaseModel):
    generated_at: str
    organization_name: str
    current_cyber_risk_inr: float
    expected_annual_loss_inr: float
    security_posture_score: float
    critical_risks_count: int
    security_budget_inr: float
    top_recommendations: List[RecommendationResponse]
    top_risks: List[TopRiskItem]
    security_posture: List[SecurityPostureCategory]
