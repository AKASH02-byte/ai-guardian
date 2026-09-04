from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.database.models import Threat
from app.schemas.schemas import ThreatResponse

router = APIRouter()

@router.get("/threats", response_model=List[ThreatResponse])
def get_threats(db: Session = Depends(get_db)):
    threats = db.query(Threat).order_by(Threat.likelihood_percentage.desc()).all()
    return [
        ThreatResponse(
            id=t.id,
            threat_id=t.threat_id,
            name=t.name,
            type=t.type,
            likelihood_percentage=t.likelihood_percentage,
            severity=t.severity,
            affected_assets_count=t.affected_assets_count,
            recent_activity=t.recent_activity,
            risk_contribution_inr=t.risk_contribution_inr
        )
        for t in threats
    ]
