from typing import List, Dict, Any

class InvestmentOptimizer:
    """
    0/1 Knapsack & Integer Programming Security Budget Optimizer.
    Solves: Maximize sum(Risk Reduction) subject to sum(Cost) <= Available Budget.
    """

    @staticmethod
    def optimize_budget(
        available_budget_inr: float,
        controls: List[Dict[str, Any]],
        current_total_risk_inr: float = 4260000.0
    ) -> Dict[str, Any]:
        """
        Calculates optimal security control selection for maximum risk reduction under budget constraint.
        """
        n = len(controls)
        if n == 0 or available_budget_inr <= 0:
            return {
                "available_budget_inr": available_budget_inr,
                "total_investment_inr": 0.0,
                "current_risk_inr": current_total_risk_inr,
                "projected_risk_inr": current_total_risk_inr,
                "total_risk_reduction_inr": 0.0,
                "remaining_budget_inr": available_budget_inr,
                "efficiency_ratio": 0.0,
                "recommended_plan": []
            }

        # Scale costs to integer units (e.g. per ₹10,000) for exact DP knapsack
        SCALE = 10000.0
        budget_scaled = int(available_budget_inr // SCALE)

        # Build items
        items = []
        for ctrl in controls:
            cost = float(ctrl["cost_inr"])
            val = float(ctrl["estimated_risk_reduction_inr"])
            scaled_cost = int(cost // SCALE)
            items.append({
                "control_id": ctrl["control_id"],
                "name": ctrl["name"],
                "cost_inr": cost,
                "val_inr": val,
                "scaled_cost": max(1, scaled_cost),
                "roi": round(val / cost, 2) if cost > 0 else 0.0,
                "priority": "High" if (val / cost if cost > 0 else 0) >= 3.0 else "Medium"
            })

        # Dynamic programming knapsack table
        dp = [[0.0] * (budget_scaled + 1) for _ in range(n + 1)]

        for i in range(1, n + 1):
            wt = items[i - 1]["scaled_cost"]
            val = items[i - 1]["val_inr"]
            for w in range(budget_scaled + 1):
                if wt <= w:
                    dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - wt] + val)
                else:
                    dp[i][w] = dp[i - 1][w]

        # Backtrack selected items
        selected_indices = []
        w = budget_scaled
        for i in range(n, 0, -1):
            if dp[i][w] != dp[i - 1][w]:
                selected_indices.append(i - 1)
                w -= items[i - 1]["scaled_cost"]

        selected_indices.reverse()
        selected_items = [items[idx] for idx in selected_indices]

        total_investment = sum(item["cost_inr"] for item in selected_items)
        total_reduction = sum(item["val_inr"] for item in selected_items)

        # Ensure projected risk doesn't drop below reasonable threshold
        projected_risk = max(500000.0, current_total_risk_inr - total_reduction)
        remaining_budget = max(0.0, available_budget_inr - total_investment)
        efficiency_ratio = round(total_reduction / total_investment, 2) if total_investment > 0 else 0.0

        recommended_plan = [
            {
                "control_id": item["control_id"],
                "name": item["name"],
                "cost_inr": item["cost_inr"],
                "expected_risk_reduction_inr": item["val_inr"],
                "roi_multiplier": item["roi"],
                "priority": item["priority"]
            }
            for item in selected_items
        ]

        return {
            "available_budget_inr": available_budget_inr,
            "total_investment_inr": total_investment,
            "current_risk_inr": current_total_risk_inr,
            "projected_risk_inr": projected_risk,
            "total_risk_reduction_inr": total_reduction,
            "remaining_budget_inr": remaining_budget,
            "efficiency_ratio": efficiency_ratio,
            "recommended_plan": recommended_plan
        }
