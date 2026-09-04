from typing import Dict, List, Any

class RiskEngine:
    """
    Transparent Business-Aware Cyber Risk Engine for AI Guardian.
    Quantifies risk using Likelihood x Business Impact, normalized score (0-100),
    and expected financial annual loss (EAL) in INR.
    """

    CRITICALITY_MULTIPLIERS = {
        "Critical": 2.5,
        "High": 1.8,
        "Medium": 1.2,
        "Low": 0.8
    }

    @staticmethod
    def calculate_vulnerability_priority_score(
        cvss: float,
        exploit_available: bool,
        internet_exposed: bool,
        business_criticality: str,
        data_sensitivity: str
    ) -> float:
        """
        Business-Aware Vulnerability Prioritization Score (0-100).
        Different from raw CVSS because it factors exposure, criticality, & exploit availability.
        """
        # Base CVSS score normalized (0-100)
        base_cvss_score = cvss * 10.0
        
        # Exploit multiplier (1.0 to 1.4)
        exploit_factor = 1.4 if exploit_available else 1.0
        
        # Exposure multiplier (1.0 to 1.3)
        exposure_factor = 1.3 if internet_exposed else 1.0
        
        # Criticality factor (0.8 to 2.5)
        crit_factor = RiskEngine.CRITICALITY_MULTIPLIERS.get(business_criticality, 1.0)
        
        # Composite score
        composite = (base_cvss_score * 0.35 + (30.0 if exploit_available else 10.0) + (20.0 if internet_exposed else 5.0)) * (crit_factor / 1.5)
        
        return min(100.0, round(composite, 1))

    @staticmethod
    def calculate_expected_annual_loss(
        likelihood_pct: float,
        potential_financial_impact_inr: float
    ) -> float:
        """
        Expected Annual Loss (EAL) = Probability (%) x Financial Impact (₹)
        """
        probability = likelihood_pct / 100.0
        return round(probability * potential_financial_impact_inr, 2)

    @staticmethod
    def classify_severity(risk_score_or_loss: float, is_score: bool = True) -> str:
        """
        Classify Severity into Critical, High, Medium, Low.
        """
        if is_score:
            if risk_score_or_loss >= 75.0:
                return "Critical"
            elif risk_score_or_loss >= 50.0:
                return "High"
            elif risk_score_or_loss >= 25.0:
                return "Medium"
            else:
                return "Low"
        else:
            # Based on financial loss in INR
            if risk_score_or_loss >= 1500000.0: # ₹15L+
                return "Critical"
            elif risk_score_or_loss >= 750000.0: # ₹7.5L - ₹15L
                return "High"
            elif risk_score_or_loss >= 250000.0: # ₹2.5L - ₹7.5L
                return "Medium"
            else:
                return "Low"
