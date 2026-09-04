from typing import List, Dict, Any

class SimulationEngine:
    """
    Interactive What-If Cyber Risk Simulation Engine.
    Simulates cumulative risk reduction and cost as user selects/deselects controls.
    """

    @staticmethod
    def run_simulation(
        selected_control_ids: List[str],
        all_controls: List[Dict[str, Any]],
        current_risk_inr: float = 4260000.0
    ) -> Dict[str, Any]:
        
        control_map = {c["control_id"]: c for c in all_controls}
        selected_controls = [control_map[cid] for cid in selected_control_ids if cid in control_map]

        total_cost = sum(c["cost_inr"] for c in selected_controls)
        
        timeline = []
        timeline.append({
            "step_name": "Initial Baseline State",
            "control_name": None,
            "risk_after_inr": current_risk_inr,
            "risk_reduction_inr": 0.0
        })

        running_risk = current_risk_inr
        total_reduction = 0.0

        for c in selected_controls:
            reduction = c["estimated_risk_reduction_inr"]
            running_risk = max(400000.0, running_risk - reduction)
            total_reduction += reduction
            timeline.append({
                "step_name": f"Applied {c['name']}",
                "control_name": c["name"],
                "risk_after_inr": running_risk,
                "risk_reduction_inr": reduction
            })

        new_risk = running_risk
        residual_pct = round((new_risk / current_risk_inr) * 100.0, 1) if current_risk_inr > 0 else 0.0
        roi_mult = round(total_reduction / total_cost, 2) if total_cost > 0 else 0.0

        return {
            "selected_controls_count": len(selected_controls),
            "total_cost_inr": total_cost,
            "current_risk_inr": current_risk_inr,
            "new_risk_inr": new_risk,
            "risk_reduction_inr": total_reduction,
            "residual_risk_pct": residual_pct,
            "roi_multiplier": roi_mult,
            "timeline": timeline
        }
