from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import Organization, RiskScore, RiskHistory, SecurityControl
from app.schemas.schemas import DashboardResponse, OverviewMetrics, RiskTrendPoint, CategoryRisk, TopRiskItem, SecurityPostureCategory

router = APIRouter()

@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(db: Session = Depends(get_db)):
    # Retrieve org or default metrics
    org = db.query(Organization).first()
    
    current_cyber_risk = 4260000.0 # ₹42.6 Lakh
    expected_annual_loss = 1840000.0 # ₹18.4 Lakh
    security_posture = org.security_score if org else 68.0
    critical_risks_count = 7
    budget = org.total_budget if org else 1000000.0

    # Trend points
    history_records = db.query(RiskHistory).order_by(RiskHistory.id.asc()).all()
    risk_trend = [
        RiskTrendPoint(
            date=rec.date,
            risk_inr=rec.overall_risk_inr,
            expected_loss_inr=rec.expected_annual_loss_inr,
            posture_score=rec.security_posture_score
        )
        for rec in history_records
    ]

    # Risk by Category
    categories_data = [
        CategoryRisk(category="Ransomware", risk_inr=1792000.0, percentage=42.0),
        CategoryRisk(category="Data Breach", risk_inr=980000.0, percentage=23.0),
        CategoryRisk(category="Account Takeover", risk_inr=620000.0, percentage=14.5),
        CategoryRisk(category="Cloud Misconfiguration", risk_inr=450000.0, percentage=10.5),
        CategoryRisk(category="Supply Chain", risk_inr=260000.0, percentage=6.1),
        CategoryRisk(category="Insider Threat", risk_inr=158000.0, percentage=3.9),
    ]

    # Top Risks Table
    db_risks = db.query(RiskScore).order_by(RiskScore.expected_loss_inr.desc()).limit(5).all()
    top_risks = [
        TopRiskItem(
            id=r.id,
            risk_title=r.risk_title,
            category=r.category,
            asset_name=r.asset_name,
            likelihood_pct=r.likelihood_pct,
            impact_inr=r.impact_inr,
            expected_loss_inr=r.expected_loss_inr,
            severity=r.severity,
            trend=r.trend,
            confidence_score_pct=r.confidence_score_pct
        )
        for r in db_risks
    ]

    # NIST CSF Posture Categories
    posture = [
        SecurityPostureCategory(name="Govern", score=74.0, status="Good"),
        SecurityPostureCategory(name="Identify", score=82.0, status="Excellent"),
        SecurityPostureCategory(name="Protect", score=62.0, status="Fair"),
        SecurityPostureCategory(name="Detect", score=65.0, status="Fair"),
        SecurityPostureCategory(name="Respond", score=58.0, status="Needs Improvement"),
        SecurityPostureCategory(name="Recover", score=67.0, status="Fair"),
    ]

    return DashboardResponse(
        metrics=OverviewMetrics(
            current_cyber_risk_inr=current_cyber_risk,
            expected_annual_loss_inr=expected_annual_loss,
            security_posture_score=security_posture,
            critical_risks_count=critical_risks_count,
            security_budget_inr=budget
        ),
        risk_trend=risk_trend,
        risk_by_category=categories_data,
        top_risks=top_risks,
        security_posture=posture
    )
