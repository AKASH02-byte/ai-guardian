from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.database.models import Asset, Vulnerability, Incident
from app.schemas.schemas import AssetResponse, AssetDetailResponse

router = APIRouter()

@router.get("/assets", response_model=List[AssetResponse])
def get_assets(
    type: Optional[str] = None,
    criticality: Optional[str] = None,
    exposed: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Asset)
    if type:
        query = query.filter(Asset.type == type)
    if criticality:
        query = query.filter(Asset.business_criticality == criticality)
    if exposed is not None:
        query = query.filter(Asset.internet_exposed == exposed)

    assets = query.all()
    results = []
    for a in assets:
        open_vulns = db.query(Vulnerability).filter(
            Vulnerability.asset_id == a.id,
            Vulnerability.status == "Open"
        ).count()

        results.append(AssetResponse(
            id=a.id,
            asset_id=a.asset_id,
            name=a.name,
            type=a.type,
            owner=a.owner,
            department=a.department,
            business_criticality=a.business_criticality,
            internet_exposed=a.internet_exposed,
            business_value_inr=a.business_value_inr,
            data_sensitivity=a.data_sensitivity,
            risk_score=a.risk_score,
            open_vulnerabilities_count=open_vulns,
            status=a.status
        ))
    return results

@router.get("/assets/{id}", response_model=AssetDetailResponse)
def get_asset_detail(id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.id == id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    vulns = db.query(Vulnerability).filter(Vulnerability.asset_id == asset.id).all()
    incidents = db.query(Incident).filter(Incident.asset_id == asset.id).all()
    
    open_vulns_count = len([v for v in vulns if v.status == "Open"])

    return AssetDetailResponse(
        id=asset.id,
        asset_id=asset.asset_id,
        name=asset.name,
        type=asset.type,
        owner=asset.owner,
        department=asset.department,
        business_criticality=asset.business_criticality,
        internet_exposed=asset.internet_exposed,
        business_value_inr=asset.business_value_inr,
        data_sensitivity=asset.data_sensitivity,
        risk_score=asset.risk_score,
        open_vulnerabilities_count=open_vulns_count,
        status=asset.status,
        vulnerabilities=[
            {
                "cve_id": v.cve_id,
                "title": v.title,
                "cvss_score": v.cvss_score,
                "priority_risk_score": v.priority_risk_score,
                "exploit_available": v.exploit_available,
                "status": v.status
            }
            for v in vulns
        ],
        incidents=[
            {
                "incident_id": inc.incident_id,
                "title": inc.title,
                "severity": inc.severity,
                "financial_loss_inr": inc.financial_loss_inr,
                "status": inc.status
            }
            for inc in incidents
        ],
        threats=[
            {
                "name": "Ransomware Targeting " + asset.name,
                "severity": asset.business_criticality,
                "likelihood": "32%"
            }
        ],
        risk_history=[
            {"date": "2026-08-01", "score": asset.risk_score + 4.0},
            {"date": "2026-08-15", "score": asset.risk_score + 2.0},
            {"date": "2026-09-01", "score": asset.risk_score}
        ]
    )
