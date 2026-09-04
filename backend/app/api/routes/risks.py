from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.database.models import RiskScore
from app.schemas.schemas import TopRiskItem

router = APIRouter()

@router.get("/risks", response_model=List[TopRiskItem])
def get_risks(db: Session = Depends(get_db)):
    risks = db.query(RiskScore).order_by(RiskScore.expected_loss_inr.desc()).all()
    return [
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
        for r in risks
    ]

@router.get("/risks/{id}")
def get_risk_detail(id: int, db: Session = Depends(get_db)):
    risk = db.query(RiskScore).filter(RiskScore.id == id).first()
    if not risk:
        raise HTTPException(status_code=404, detail="Risk record not found")
    
    return {
        "id": risk.id,
        "risk_title": risk.risk_title,
        "category": risk.category,
        "asset_name": risk.asset_name,
        "likelihood_pct": risk.likelihood_pct,
        "potential_impact_inr": risk.impact_inr,
        "expected_loss_inr": risk.expected_loss_inr,
        "severity": risk.severity,
        "trend": risk.trend,
        "confidence_score_pct": risk.confidence_score_pct,
        "why_is_risk_high": [
            "Asset DB-PROD-01 is internet exposed via administrative API",
            "Critical business system handling customer financial & PII records",
            "Exploit script (CVE-2024-3094) available in public threat repositories",
            "Sub-optimal EDR coverage (62% endpoint agent deployment)",
            "High recent active threat intelligence signals for financial services sector"
        ],
        "recommended_actions": [
            {"action": "Deploy EDR agent to remaining DB nodes", "cost_inr": 400000.0, "risk_reduction_inr": 750000.0},
            {"action": "Enforce MFA for all privileged database access", "cost_inr": 100000.0, "risk_reduction_inr": 450000.0},
            {"action": "Isolate DB subnet behind next-gen firewall", "cost_inr": 350000.0, "risk_reduction_inr": 320000.0}
        ]
    }
