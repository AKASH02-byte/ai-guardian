import sys
import os
import json
from datetime import datetime, timedelta

# Append backend directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.session import SessionLocal, engine, Base
from app.database.models import (
    Organization, Asset, Vulnerability, Threat, SecurityControl,
    RiskScore, Incident, RiskHistory, Recommendation
)
from app.services.risk_engine import RiskEngine

def seed_database():
    print("Initializing database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        print("Seeding Organization...")
        org = Organization(
            name="Bharat Financial Services Ltd.",
            industry="Banking & Financial Services",
            currency="INR",
            total_budget=1000000.0, # ₹10 Lakhs
            security_score=68.0
        )
        db.add(org)
        db.commit()

        print("Seeding Assets...")
        asset_definitions = [
            ("DB-PROD-01", "Production Core Database", "Database", "Core Banking", "IT Infrastructure", "Critical", True, 25000000.0, "PII/PCI", 88.5),
            ("PAY-API-01", "Payment Gateway API", "API Server", "FinTech Ops", "Digital Payments", "Critical", True, 18000000.0, "PCI-DSS", 84.0),
            ("HR-SERVER-01", "Human Resources ERP", "Application Server", "HR Dept", "Internal IT", "Medium", False, 4000000.0, "Confidential", 45.0),
            ("CRM-DB-02", "Customer Relations DB", "Database", "Sales Ops", "Marketing", "High", False, 8000000.0, "Confidential", 62.0),
            ("CLOUD-VM-07", "Kubernetes Ingress VM", "Cloud VM", "DevOps", "Cloud Ops", "High", True, 12000000.0, "Internal", 76.0),
            ("AUTH-SRV-01", "Active Directory & Identity", "Active Directory", "SecOps", "Security", "Critical", True, 30000000.0, "Restricted", 91.0),
            ("SWIFT-GW-01", "SWIFT Financial Gateway", "Financial Gateway", "Treasury", "Banking", "Critical", False, 45000000.0, "Strict Confidential", 82.0),
            ("WAF-EDGE-01", "Edge Firewall & WAF", "Network Appliance", "SecOps", "Network Security", "High", True, 9000000.0, "Internal", 55.0),
            ("DEV-BUILD-04", "CI/CD Build Worker 04", "Workstation", "DevOps", "Engineering", "Low", False, 1500000.0, "Internal", 32.0),
            ("ANALYTICS-DB", "Data Warehouse & BI", "Database", "Data Science", "Analytics", "Medium", False, 6000000.0, "Confidential", 48.0),
            ("MOBILE-API-02", "Mobile Banking Backend API", "API Server", "Digital Banking", "Consumer Products", "Critical", True, 20000000.0, "PCI-DSS", 79.0),
            ("VPN-GATEWAY", "Enterprise Remote Access VPN", "Network Appliance", "IT Admin", "Network Security", "High", True, 7000000.0, "Internal", 68.0),
            ("EMAIL-EXCH-01", "Enterprise Exchange Server", "Email Server", "IT Admin", "Corporate IT", "High", True, 10000000.0, "Confidential", 71.0),
            ("BACKUP-NAS-01", "Primary Backup Storage NAS", "Storage", "DevOps", "Infrastructure", "High", False, 11000000.0, "Confidential", 58.0),
            ("SIEM-LOG-01", "Splunk Log Aggregator", "Security Appliance", "SecOps", "SOC", "High", False, 8500000.0, "Internal", 42.0),
            ("STAGING-DB-01", "Staging Environment DB", "Database", "QA Team", "Engineering", "Low", False, 1000000.0, "Public", 22.0),
            ("ATM-ROUTER-09", "Regional ATM Gateway Switch", "Network Router", "Retail Banking", "Operations", "Critical", False, 15000000.0, "PCI-DSS", 74.0),
            ("KMS-HSM-01", "Hardware Security Module", "Key Management", "SecOps", "Security", "Critical", False, 35000000.0, "Top Secret", 65.0),
            ("TRADE-PORTAL", "Treasury Trading Desk Web", "Web App", "Treasury", "Trading", "Critical", True, 22000000.0, "Confidential", 80.0),
            ("INTERNAL-WIKI", "Confluence Knowledgebase", "Web Server", "IT Admin", "Corporate IT", "Low", False, 500000.0, "Internal", 18.0)
        ]

        created_assets = []
        for aid, name, atype, owner, dept, crit, exposed, val, sens, rscore in asset_definitions:
            a = Asset(
                asset_id=aid,
                name=name,
                type=atype,
                owner=owner,
                department=dept,
                business_criticality=crit,
                internet_exposed=exposed,
                business_value_inr=val,
                data_sensitivity=sens,
                risk_score=rscore,
                status="Active"
            )
            db.add(a)
            created_assets.append(a)
        
        db.commit()

        print("Seeding Vulnerabilities...")
        vulnerabilities_data = [
            ("CVE-2024-3094", "XZ Utils Malicious Backdoor in SSHD", "Critical backdoor in compressed library affecting remote SSH access", 1, 10.0, True, True),
            ("CVE-2024-21626", "runc Container Escape RCE Vulnerability", "Container breakout allowing root host access from Kubernetes POD", 5, 8.6, True, True),
            ("CVE-2023-48795", "SSH Terrapin Prefix Truncation Attack", "Cryptographic weakness in SSH binary integrity checks", 6, 5.9, True, True),
            ("CVE-2024-1709", "ConnectWise ScreenConnect Auth Bypass", "Authentication bypass enabling unauthenticated admin RCE", 2, 10.0, True, True),
            ("CVE-2023-34048", "VMware vCenter Server Out-of-bounds Write", "RCE in vCenter Server via DCERPC protocol", 12, 9.8, True, True),
            ("CVE-2024-27198", "JetBrains TeamCity Auth Bypass", "Remote admin takeover vulnerability", 9, 9.8, True, False),
            ("CVE-2023-22518", "Confluence Data Center Auth Bypass", "Improper authorization leading to administrative account creation", 20, 9.1, False, False),
            ("CVE-2024-21887", "Ivanti Connect Secure Command Injection", "Command injection vulnerability in web components of VPN", 12, 9.1, True, True),
            ("CVE-2023-3519", "Citrix ADC / Gateway Unauthenticated RCE", "Buffer overflow vulnerability exploited in the wild", 11, 9.8, True, True),
            ("CVE-2024-23897", "Jenkins CLI Arbitrary File Read", "Unauthenticated file disclosure leading to credential extraction", 9, 9.8, True, False),
            ("CVE-2023-4966", "Citrix Bleed Sensitive Information Disclosure", "Session token leak vulnerability in Citrix NetScaler", 8, 9.4, True, True),
            ("CVE-2024-20337", "Cisco Secure Client Linux VPN Arbitrary Code Execution", "Local privilege escalation and remote code execution", 12, 8.2, True, True),
            ("CVE-2023-38831", "WinRAR Zero-Day File Extension Spoofing", "Malicious archive execution used in financial targeted phishing", 13, 7.8, True, False),
            ("CVE-2024-21762", "Fortinet FortiOS Out-of-bound Write", "SSL-VPN unauthenticated arbitrary code execution", 8, 9.8, True, True),
            ("CVE-2023-20198", "Cisco IOS XE Web UI Privilege Escalation", "Privilege escalation vulnerability exploited extensively", 17, 10.0, True, False),
            ("CVE-2024-2722", "PostgreSQL Unauthenticated Memory Corruption", "Buffer overflow in binary protocol parsing", 1, 8.1, False, False),
            ("CVE-2023-44487", "HTTP/2 Rapid Reset DDoS Vulnerability", "Protocol-level denial of service flaw affecting web proxies", 8, 7.5, True, True),
            ("CVE-2024-22252", "Spring Framework SpEL Injection", "Spring Expression Language injection vulnerability", 11, 8.1, True, False),
            ("CVE-2023-36884", "Office and Windows HTML RCE Vulnerability", "Remote code execution via crafted Office document", 3, 8.3, True, False),
            ("CVE-2024-23222", "iOS & macOS WebKit Memory Corruption", "Arbitrary code execution via WebKit rendering engine", 11, 8.8, True, True)
        ]

        for cve, title, desc, asset_idx, cvss, exploit, exposed in vulnerabilities_data:
            target_asset = created_assets[asset_idx - 1]
            score = RiskEngine.calculate_vulnerability_priority_score(
                cvss=cvss,
                exploit_available=exploit,
                internet_exposed=exposed,
                business_criticality=target_asset.business_criticality,
                data_sensitivity=target_asset.data_sensitivity
            )
            v = Vulnerability(
                cve_id=cve,
                title=title,
                description=desc,
                asset_id=target_asset.id,
                cvss_score=cvss,
                exploit_available=exploit,
                internet_exposed=exposed,
                business_criticality=target_asset.business_criticality,
                priority_risk_score=score,
                status="Open"
            )
            db.add(v)

        db.commit()

        print("Seeding Threats...")
        threat_definitions = [
            ("THR-001", "Ransomware Attack (LockBit / BlackCat)", "Malware", 32.0, "Critical", 6, "High activity observed targeting Indian BFSI sector", 1792000.0),
            ("THR-002", "Privileged Credential Theft", "Phishing / Credential Harvesting", 28.0, "Critical", 4, "Increased spear-phishing campaigns on domain admins", 980000.0),
            ("THR-003", "PCI-DSS Data Exfiltration", "Data Leakage", 18.0, "High", 3, "Unencrypted API endpoint probe detected from TOR exit node", 620000.0),
            ("THR-004", "HTTP/2 Rapid Reset DDoS", "DDoS", 24.0, "High", 5, "Volumetric HTTP flooding attack targeting payment gateway", 450000.0),
            ("THR-005", "Cloud S3 Bucket Misconfiguration", "Cloud Misconfig", 15.0, "Medium", 2, "Public read permissions detected during audit scan", 260000.0),
            ("THR-006", "Malicious Insider Database Dump", "Insider Threat", 8.0, "Medium", 1, "Abnormal bulk export query executed outside office hours", 158000.0),
            ("THR-007", "Third-Party Supply Chain Compromise", "Supply Chain", 12.0, "High", 4, "Vulnerability detected in third-party analytics SDK", 310000.0),
            ("THR-008", "Active Directory Kerberoasting", "Identity Attack", 22.0, "High", 2, "Kerberos ticket requests observed for service accounts", 520000.0)
        ]

        for tid, name, ttype, lik, sev, aff, act, contrib in threat_definitions:
            t = Threat(
                threat_id=tid,
                name=name,
                type=ttype,
                likelihood_percentage=lik,
                severity=sev,
                affected_assets_count=aff,
                recent_activity=act,
                risk_contribution_inr=contrib
            )
            db.add(t)

        db.commit()

        print("Seeding Security Controls...")
        controls_data = [
            ("CTL-MFA", "Multi-Factor Authentication (MFA)", "Identity", 100000.0, 62.0, "High", 450000.0, "Partially Implemented"),
            ("CTL-EDR", "Endpoint Detection & Response (EDR)", "Endpoint", 400000.0, 58.0, "High", 750000.0, "Partially Implemented"),
            ("CTL-BACKUP", "Immutable Air-Gapped Backup", "Backup", 300000.0, 70.0, "High", 650000.0, "Partially Implemented"),
            ("CTL-TRAIN", "Employee Security Awareness Training", "Training", 100000.0, 45.0, "Medium", 250000.0, "Planned"),
            ("CTL-FW", "Next-Gen Firewall & WAF Upgrade", "Network", 500000.0, 65.0, "High", 500000.0, "Partially Implemented"),
            ("CTL-NETSEG", "Micro-segmentation & Zero Trust", "Network", 350000.0, 40.0, "High", 420000.0, "Planned"),
            ("CTL-ENCRYPT", "Database Field-Level Encryption", "Encryption", 250000.0, 80.0, "High", 380000.0, "Implemented"),
            ("CTL-PATCH", "Automated Patch Management System", "Vulnerability", 150000.0, 52.0, "Medium", 290000.0, "Partially Implemented")
        ]

        for cid, name, cat, cost, cov, eff, red, stat in controls_data:
            c = SecurityControl(
                control_id=cid,
                name=name,
                category=cat,
                cost_inr=cost,
                current_coverage_pct=cov,
                effectiveness_rating=eff,
                estimated_risk_reduction_inr=red,
                status=stat
            )
            db.add(c)

        db.commit()

        print("Seeding Top Risks...")
        top_risks_data = [
            ("Ransomware Outbreak on Core DB", "Ransomware", "Production Core Database", 32.0, 5600000.0, 1792000.0, "Critical", "UP", 88.0),
            ("Privileged Account Hijacking via Auth Server", "Account Takeover", "Active Directory & Identity", 28.0, 3500000.0, 980000.0, "Critical", "UP", 91.0),
            ("Payment Gateway API PCI-DSS Breach", "Data Breach", "Payment Gateway API", 22.0, 2800000.0, 616000.0, "High", "STABLE", 85.0),
            ("Unauthenticated Container Escape in Kubernetes", "Cloud Misconfiguration", "Kubernetes Ingress VM", 25.0, 1800000.0, 450000.0, "High", "UP", 82.0),
            ("SWIFT Financial Gateway Compromise", "Supply Chain", "SWIFT Financial Gateway", 12.0, 3000000.0, 360000.0, "High", "STABLE", 94.0),
            ("Insider Data Dumping on Customer CRM", "Insider Threat", "Customer Relations DB", 14.0, 1500000.0, 210000.0, "Medium", "DOWN", 79.0),
            ("Remote Access VPN Session Hijacking", "Account Takeover", "Enterprise Remote Access VPN", 19.0, 1200000.0, 228000.0, "Medium", "STABLE", 83.0)
        ]

        for title, cat, asset_name, lik, imp, loss, sev, trend, conf in top_risks_data:
            r = RiskScore(
                risk_title=title,
                category=cat,
                asset_name=asset_name,
                likelihood_pct=lik,
                impact_inr=imp,
                expected_loss_inr=loss,
                severity=sev,
                trend=trend,
                confidence_score_pct=conf
            )
            db.add(r)

        db.commit()

        print("Seeding Risk History...")
        today = datetime.utcnow()
        for i in range(30, 0, -1):
            date_str = (today - timedelta(days=i)).strftime("%Y-%m-%d")
            # Gradual historical trend
            risk_val = round(4800000.0 - (30 - i) * 18000.0 + (i % 5) * 15000.0, 2)
            loss_val = round(2100000.0 - (30 - i) * 8600.0 + (i % 3) * 7000.0, 2)
            posture_val = round(62.0 + (30 - i) * 0.2, 1)

            rh = RiskHistory(
                date=date_str,
                overall_risk_inr=risk_val,
                expected_annual_loss_inr=loss_val,
                security_posture_score=posture_val,
                critical_risks_count=7 if i > 10 else 6
            )
            db.add(rh)

        db.commit()

        print("Seeding Recommendations...")
        recommendations_data = [
            (
                "Enforce MFA across 38% Unprotected Privileged Accounts",
                "Identity Security",
                "CTL-MFA",
                "Critical",
                450000.0,
                100000.0,
                4.5,
                89.0,
                "Implementing MFA is prioritized because 38% of privileged accounts currently lack MFA. These accounts are associated with high-value assets (DB-PROD-01, SWIFT-GW-01) and recent abnormal authentication activity.",
                json.dumps(["Asset Criticality: High", "Threat Activity: Elevated", "Exploitability: High", "Control Weakness: 38% Unprotected"])
            ),
            (
                "Deploy Endpoint Detection & Response (EDR) to Core Database Nodes",
                "Endpoint Protection",
                "CTL-EDR",
                "Critical",
                750000.0,
                400000.0,
                1.88,
                92.0,
                "EDR coverage is currently at 58% across critical database servers. Deploying EDR prevents active ransomware execution chains (LockBit 3.0) observed in financial sector intelligence feeds.",
                json.dumps(["Asset Criticality: Critical", "Threat Activity: High (Ransomware)", "Exposure: Internet Facing API", "Control Coverage: 58%"])
            ),
            (
                "Establish Immutable Air-Gapped Backup Vaults",
                "Data Resilience",
                "CTL-BACKUP",
                "High",
                650000.0,
                300000.0,
                2.17,
                86.0,
                "Air-gapped immutable backup storage mitigates catastrophe risk from ransomware encryption attacks on primary NAS storage (BACKUP-NAS-01).",
                json.dumps(["Ransomware Risk", "RTO Mitigation", "Data Sensitivity: PII/PCI"])
            ),
            (
                "Implement Zero Trust Network Segmentation for SWIFT & Payment Gateway",
                "Network Security",
                "CTL-NETSEG",
                "High",
                420000.0,
                350000.0,
                1.2,
                84.0,
                "Micro-segmentation restricts lateral movement between lower-tier development VMs and core banking SWIFT network switches.",
                json.dumps(["Lateral Movement Risk", "PCI-DSS Compliance", "High Business Value"])
            )
        ]

        for title, cat, ctrl_id, prio, red, cost, roi, conf, why, factors in recommendations_data:
            rec = Recommendation(
                title=title,
                category=cat,
                target_control_id=ctrl_id,
                priority=prio,
                expected_loss_reduction_inr=red,
                cost_inr=cost,
                roi_multiplier=roi,
                ai_confidence_pct=conf,
                why_text=why,
                risk_factors=factors
            )
            db.add(rec)

        db.commit()

        print("Database seeded successfully!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
