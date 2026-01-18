"""
Anomalies Router
Anomaly detection and explanation endpoints
"""
from fastapi import APIRouter, Query
from typing import Dict, Any, Optional
from services.anomaly_engine import anomaly_engine

router = APIRouter(prefix="/anomalies", tags=["Anomalies"])


@router.get("")
async def get_anomalies(
    severity: Optional[str] = Query(default=None, description="Filter by severity: high, medium, low"),
    type: Optional[str] = Query(default=None, description="Filter by anomaly type")
) -> Dict[str, Any]:
    """
    Get detected anomalies with explanations.
    
    Returns:
        - List of anomalies with severity, type, and recommendations
        - Summary statistics
    """
    anomalies = anomaly_engine.detect_all_anomalies()
    
    # Apply filters
    if severity:
        anomalies = [a for a in anomalies if a["severity"] == severity]
    if type:
        anomalies = [a for a in anomalies if a["type"] == type]
    
    # Count by severity
    by_severity = {"high": 0, "medium": 0, "low": 0, "critical": 0}
    for a in anomalies:
        by_severity[a["severity"]] = by_severity.get(a["severity"], 0) + 1
    
    return {
        "anomalies": anomalies,
        "total_anomalies": len(anomalies),
        "by_severity": by_severity,
    }


@router.get("/summary")
async def get_anomaly_summary() -> Dict[str, Any]:
    """Get anomaly detection summary statistics"""
    return anomaly_engine.get_anomaly_summary()


@router.get("/{anomaly_id}")
async def get_anomaly_detail(anomaly_id: str) -> Dict[str, Any]:
    """Get detailed information about a specific anomaly"""
    anomalies = anomaly_engine.detect_all_anomalies()
    anomaly = next((a for a in anomalies if a["id"] == anomaly_id), None)
    
    if not anomaly:
        return {"error": f"Anomaly {anomaly_id} not found"}
    
    return {"anomaly": anomaly}


@router.get("/explain/{anomaly_id}")
async def explain_anomaly(anomaly_id: str) -> Dict[str, Any]:
    """Get detailed explanation for an anomaly"""
    anomalies = anomaly_engine.detect_all_anomalies()
    anomaly = next((a for a in anomalies if a["id"] == anomaly_id), None)
    
    if not anomaly:
        return {"error": f"Anomaly {anomaly_id} not found"}
    
    return {
        "anomaly_id": anomaly_id,
        "type": anomaly["type"],
        "explanation": anomaly["description"],
        "evidence": anomaly.get("evidence", {}),
        "recommendation": anomaly["recommendation"],
        "confidence": 0.85,
    }
