from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import json
from app.database.session import get_db
from app.database.models import Organization, RiskScore, Recommendation
from app.schemas.schemas import ExecutiveReportResponse, RecommendationResponse, TopRiskItem, SecurityPostureCategory

router = APIRouter()

@router.get("/reports/executive", response_model=ExecutiveReportResponse)
def get_executive_report(db: Session = Depends(get_db)):
    org = db.query(Organization).first()
    org_name = org.name if org else "Bharat Financial Services Ltd."
    
    top_risks_db = db.query(RiskScore).order_by(RiskScore.expected_loss_inr.desc()).limit(5).all()
    recs_db = db.query(Recommendation).limit(5).all()

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
        for r in top_risks_db
    ]

    recs = []
    for r in recs_db:
        try:
            factors = json.loads(r.risk_factors)
        except Exception:
            factors = [f.strip() for f in r.risk_factors.split(",")]

        recs.append(
            RecommendationResponse(
                id=r.id,
                title=r.title,
                category=r.category,
                target_control_id=r.target_control_id,
                priority=r.priority,
                expected_loss_reduction_inr=r.expected_loss_reduction_inr,
                cost_inr=r.cost_inr,
                roi_multiplier=r.roi_multiplier,
                ai_confidence_pct=r.ai_confidence_pct,
                why_text=r.why_text,
                risk_factors=factors
            )
        )

    posture = [
        SecurityPostureCategory(name="Govern", score=74.0, status="Good"),
        SecurityPostureCategory(name="Identify", score=82.0, status="Excellent"),
        SecurityPostureCategory(name="Protect", score=62.0, status="Fair"),
        SecurityPostureCategory(name="Detect", score=65.0, status="Fair"),
        SecurityPostureCategory(name="Respond", score=58.0, status="Needs Improvement"),
        SecurityPostureCategory(name="Recover", score=67.0, status="Fair"),
    ]

    return ExecutiveReportResponse(
        generated_at=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
        organization_name=org_name,
        current_cyber_risk_inr=4260000.0,
        expected_annual_loss_inr=1840000.0,
        security_posture_score=org.security_score if org else 68.0,
        critical_risks_count=7,
        security_budget_inr=org.total_budget if org else 1000000.0,
        top_recommendations=recs,
        top_risks=top_risks,
        security_posture=posture
    )
