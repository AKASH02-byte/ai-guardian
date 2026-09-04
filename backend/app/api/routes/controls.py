from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.database.models import SecurityControl
from app.schemas.schemas import ControlResponse

router = APIRouter()

@router.get("/controls", response_model=List[ControlResponse])
def get_security_controls(db: Session = Depends(get_db)):
    controls = db.query(SecurityControl).all()
    return [
        ControlResponse(
            id=c.id,
            control_id=c.control_id,
            name=c.name,
            category=c.category,
            cost_inr=c.cost_inr,
            current_coverage_pct=c.current_coverage_pct,
            effectiveness_rating=c.effectiveness_rating,
            estimated_risk_reduction_inr=c.estimated_risk_reduction_inr,
            status=c.status
        )
        for c in controls
    ]
