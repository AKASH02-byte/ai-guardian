from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import SecurityControl
from app.schemas.schemas import SimulationRequest, SimulationResponse
from app.services.simulation import SimulationEngine

router = APIRouter()

@router.post("/simulation", response_model=SimulationResponse)
def run_what_if_simulation(
    payload: SimulationRequest,
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

    result = SimulationEngine.run_simulation(
        selected_control_ids=payload.selected_control_ids,
        all_controls=controls_list,
        current_risk_inr=4260000.0
    )

    return result
