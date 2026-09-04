from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.session import engine, Base
from app.api.routes import (
    dashboard,
    assets,
    vulnerabilities,
    threats,
    risks,
    controls,
    investments,
    simulation,
    recommendations,
    reports
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(dashboard.router, prefix=settings.API_V1_STR, tags=["Dashboard"])
app.include_router(assets.router, prefix=settings.API_V1_STR, tags=["Assets"])
app.include_router(vulnerabilities.router, prefix=settings.API_V1_STR, tags=["Vulnerabilities"])
app.include_router(threats.router, prefix=settings.API_V1_STR, tags=["Threats"])
app.include_router(risks.router, prefix=settings.API_V1_STR, tags=["Risks"])
app.include_router(controls.router, prefix=settings.API_V1_STR, tags=["Security Controls"])
app.include_router(investments.router, prefix=settings.API_V1_STR, tags=["Investment Optimizer"])
app.include_router(simulation.router, prefix=settings.API_V1_STR, tags=["What-If Simulator"])
app.include_router(recommendations.router, prefix=settings.API_V1_STR, tags=["Recommendations"])
app.include_router(reports.router, prefix=settings.API_V1_STR, tags=["Executive Reports"])

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs"
    }
