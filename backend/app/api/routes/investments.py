from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import SecurityControl
from app.schemas.schemas import OptimizeRequest, OptimizeResponse
from app.services.optimizer import InvestmentOptimizer

router = APIRouter()

@router.post("/investments/optimize", response_model=OptimizeResponse)
def optimize_security_investment(
    payload: OptimizeRequest,
    db: Session = Depends(get_db)
):
    controls_db = db.query(SecurityControl).all()
    controls_list = [
        {
            "control_id": c.control_id,
            "name": c.name,
            "cost_inr": c.cost_inr,
            "estimated_risk_reduction_inr": c.estimated_risk_reduction_inr
        }
        for c in controls_db
    ]

    result = InvestmentOptimizer.optimize_budget(
        available_budget_inr=payload.available_budget_inr,
        controls=controls_list,
        current_total_risk_inr=4260000.0
    )

    return result
