from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    industry = Column(String, default="Banking & Financial Services")
    currency = Column(String, default="INR")
    total_budget = Column(Float, default=1000000.0) # ₹10 Lakhs
    security_score = Column(Float, default=68.0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String, unique=True, index=True, nullable=False) # e.g. DB-PROD-01
    name = Column(String, nullable=False) # e.g. Production Database
    type = Column(String, nullable=False) # Database, API Server, Cloud VM, Workstation, Active Directory
    owner = Column(String, nullable=False) # SecOps, DevOps, IT Admin, Core Banking
    department = Column(String, default="IT Infrastructure")
    business_criticality = Column(String, nullable=False) # Critical, High, Medium, Low
    internet_exposed = Column(Boolean, default=False)
    business_value_inr = Column(Float, default=5000000.0) # Asset valuation in INR
    data_sensitivity = Column(String, default="Confidential") # PII/PCI, Confidential, Internal, Public
    risk_score = Column(Float, default=75.0) # 0 - 100
    status = Column(String, default="Active") # Active, Under Maintenance, Decommissioned
    created_at = Column(DateTime, default=datetime.utcnow)

    vulnerabilities = relationship("Vulnerability", back_populates="asset")
    incidents = relationship("Incident", back_populates="asset")


class Vulnerability(Base):
    __tablename__ = "vulnerabilities"

    id = Column(Integer, primary_key=True, index=True)
    cve_id = Column(String, index=True, nullable=False) # e.g. CVE-2024-3094
    title = Column(String, nullable=False)
    description = Column(Text)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    cvss_score = Column(Float, nullable=False) # 0.0 - 10.0
    exploit_available = Column(Boolean, default=False)
    internet_exposed = Column(Boolean, default=False)
    business_criticality = Column(String, default="High")
    priority_risk_score = Column(Float, default=50.0) # Business-aware calculated score
    status = Column(String, default="Open") # Open, In Progress, Mitigated, Ignored
    created_at = Column(DateTime, default=datetime.utcnow)

    asset = relationship("Asset", back_populates="vulnerabilities")


class Threat(Base):
    __tablename__ = "threats"

    id = Column(Integer, primary_key=True, index=True)
    threat_id = Column(String, unique=True, index=True, nullable=False) # e.g. THR-001
    name = Column(String, nullable=False) # e.g. Ransomware Attack
    type = Column(String, nullable=False) # Malware, Phishing, Insider Threat, DDoS, Cloud Misconfig
    likelihood_percentage = Column(Float, nullable=False) # e.g. 32.0 (%)
    severity = Column(String, nullable=False) # Critical, High, Medium, Low
    affected_assets_count = Column(Integer, default=1)
    recent_activity = Column(String, default="High activity observed in industry")
    risk_contribution_inr = Column(Float, default=1500000.0)
    created_at = Column(DateTime, default=datetime.utcnow)


class SecurityControl(Base):
    __tablename__ = "security_controls"

    id = Column(Integer, primary_key=True, index=True)
    control_id = Column(String, unique=True, index=True, nullable=False) # e.g. CTL-MFA
    name = Column(String, nullable=False) # e.g. Multi-Factor Authentication (MFA)
    category = Column(String, nullable=False) # Identity, Endpoint, Backup, Network, Encryption, Training
    cost_inr = Column(Float, nullable=False) # e.g. 100000.0
    current_coverage_pct = Column(Float, default=50.0) # Coverage percentage
    effectiveness_rating = Column(String, default="High") # High, Medium, Low
    estimated_risk_reduction_inr = Column(Float, nullable=False) # Expected financial loss reduction
    status = Column(String, default="Partially Implemented") # Implemented, Partially Implemented, Planned, Not Implemented
    created_at = Column(DateTime, default=datetime.utcnow)


class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(Integer, primary_key=True, index=True)
    risk_title = Column(String, nullable=False) # e.g. Ransomware on Prod DB
    category = Column(String, nullable=False) # Ransomware, Data Breach, Account Takeover, Cloud Misconfiguration, Supply Chain, Insider Threat
    asset_name = Column(String, nullable=False)
    likelihood_pct = Column(Float, nullable=False) # e.g. 32.0%
    impact_inr = Column(Float, nullable=False) # e.g. 5600000.0
    expected_loss_inr = Column(Float, nullable=False) # e.g. 1792000.0
    severity = Column(String, nullable=False) # Critical, High, Medium, Low
    trend = Column(String, default="UP") # UP, DOWN, STABLE
    confidence_score_pct = Column(Float, default=87.0)
    created_at = Column(DateTime, default=datetime.utcnow)


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    severity = Column(String, nullable=False)
    financial_loss_inr = Column(Float, default=0.0)
    status = Column(String, default="Resolved")
    created_at = Column(DateTime, default=datetime.utcnow)

    asset = relationship("Asset", back_populates="incidents")


class RiskHistory(Base):
    __tablename__ = "risk_history"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, nullable=False) # YYYY-MM-DD
    overall_risk_inr = Column(Float, nullable=False) # e.g. 4260000.0
    expected_annual_loss_inr = Column(Float, nullable=False) # e.g. 1840000.0
    security_posture_score = Column(Float, nullable=False) # e.g. 68.0
    critical_risks_count = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    target_control_id = Column(String, nullable=True)
    priority = Column(String, default="High")
    expected_loss_reduction_inr = Column(Float, nullable=False)
    cost_inr = Column(Float, nullable=False)
    roi_multiplier = Column(Float, nullable=False)
    ai_confidence_pct = Column(Float, default=87.0)
    why_text = Column(Text, nullable=False)
    risk_factors = Column(Text, nullable=False) # JSON or comma separated
    created_at = Column(DateTime, default=datetime.utcnow)
