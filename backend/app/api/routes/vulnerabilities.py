from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.database.models import Vulnerability, Asset
from app.schemas.schemas import VulnerabilityResponse

router = APIRouter()

@router.get("/vulnerabilities", response_model=List[VulnerabilityResponse])
def get_vulnerabilities(
    exploitable_only: Optional[bool] = False,
    exposed_only: Optional[bool] = False,
    min_cvss: Optional[float] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Vulnerability, Asset).join(Asset, Vulnerability.asset_id == Asset.id)
    
    if exploitable_only:
        query = query.filter(Vulnerability.exploit_available == True)
    if exposed_only:
        query = query.filter(Vulnerability.internet_exposed == True)
    if min_cvss:
        query = query.filter(Vulnerability.cvss_score >= min_cvss)
    if status:
        query = query.filter(Vulnerability.status == status)

    # Order by Business-Aware AI Priority Risk Score (NOT raw CVSS)
    query = query.order_by(Vulnerability.priority_risk_score.desc())
    results = query.all()

    return [
        VulnerabilityResponse(
            id=v.id,
            cve_id=v.cve_id,
            title=v.title,
            description=v.description,
            asset_id=a.asset_id,
            asset_name=a.name,
            cvss_score=v.cvss_score,
            exploit_available=v.exploit_available,
            internet_exposed=v.internet_exposed,
            business_criticality=a.business_criticality,
            priority_risk_score=v.priority_risk_score,
            status=v.status
        )
        for v, a in results
    ]
