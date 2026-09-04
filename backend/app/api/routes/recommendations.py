from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import json
from app.database.session import get_db
from app.database.models import Recommendation
from app.schemas.schemas import RecommendationResponse

router = APIRouter()

@router.get("/recommendations", response_model=List[RecommendationResponse])
def get_recommendations(db: Session = Depends(get_db)):
    recs = db.query(Recommendation).order_by(Recommendation.expected_loss_reduction_inr.desc()).all()
    
    results = []
    for r in recs:
        try:
            factors = json.loads(r.risk_factors)
        except Exception:
            factors = [f.strip() for f in r.risk_factors.split(",") if f.strip()]

        results.append(
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
    return results
