"""
Recommendation Engine
Policy recommendations based on data analysis
"""
import numpy as np
from typing import Dict, List, Any
from datetime import datetime
from dataclasses import dataclass
from enum import Enum
import logging
from services.data_repository import aadhaar_repository
from services.analytics_service import analytics_service
from services.anomaly_engine import anomaly_engine

logger = logging.getLogger(__name__)


class RecommendationCategory(Enum):
    INFRASTRUCTURE = "Infrastructure"
    POLICY = "Policy"
    OPERATIONS = "Operations"
    TECHNOLOGY = "Technology"
    OUTREACH = "Outreach"


class RecommendationStatus(Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    IMPLEMENTED = "implemented"
    REJECTED = "rejected"


class RecommendationEngine:
    """
    Generates data-driven policy recommendations.
    """
    
    def __init__(self):
        self.repo = aadhaar_repository
        self.analytics = analytics_service
        self.anomaly_detector = anomaly_engine
        self._rec_counter = 0
    
    def _generate_rec_id(self) -> str:
        """Generate unique recommendation ID"""
        self._rec_counter += 1
        return f"REC-{datetime.now().strftime('%Y')}-{self._rec_counter:03d}"
    
    def generate_all_recommendations(self) -> List[Dict[str, Any]]:
        """Generate all policy recommendations"""
        recommendations = []
        
        # Infrastructure recommendations
        recommendations.extend(self._infrastructure_recommendations())
        
        # Operational recommendations
        recommendations.extend(self._operational_recommendations())
        
        # Outreach recommendations
        recommendations.extend(self._outreach_recommendations())
        
        # Technology recommendations
        recommendations.extend(self._technology_recommendations())
        
        # Sort by priority
        priority_order = {"high": 0, "medium": 1, "low": 2}
        recommendations.sort(key=lambda x: priority_order.get(x["priority"], 3))
        
        return recommendations
    
    def _infrastructure_recommendations(self) -> List[Dict[str, Any]]:
        """Generate infrastructure-related recommendations"""
        recommendations = []
        states = self.repo.get_state_data()
        
        # Find high-demand states
        high_demand = [s for s in states if s["monthly_enrolments"] > 1_000_000]
        
        if high_demand:
            top = max(high_demand, key=lambda x: x["monthly_enrolments"])
            recommendations.append({
                "id": self._generate_rec_id(),
                "title": f"Expand Enrolment Centres in {top['name']}",
                "category": RecommendationCategory.INFRASTRUCTURE.value,
                "priority": "high",
                "status": "new",
                "summary": f"With {top['monthly_enrolments']:,} monthly transactions, {top['name']} requires additional permanent and mobile enrolment centres to maintain service quality.",
                "rationale": [
                    f"Current volume: {top['monthly_enrolments']:,}/month",
                    f"YoY growth: {top['yoy_growth']:.1f}%",
                    "Wait times exceeding SLA in metro districts",
                ],
                "expected_impact": {
                    "wait_time_reduction": "35%",
                    "coverage_increase": f"{top['name']} +15%",
                    "customer_satisfaction": "+12 NPS points",
                },
                "resource_requirement": {
                    "budget": "₹25-30 Cr",
                    "timeline": "6-9 months",
                    "new_centres": "50-75",
                },
                "generated_at": datetime.now().isoformat(),
            })
        
        return recommendations
    
    def _operational_recommendations(self) -> List[Dict[str, Any]]:
        """Generate operational recommendations"""
        recommendations = []
        update_analytics = self.analytics.get_update_analytics()
        fatigue = update_analytics.get("update_fatigue_index", {})
        
        if fatigue.get("national_index", 0) > 0.65:
            high_fatigue = fatigue.get("high_fatigue_districts", [])
            if high_fatigue:
                recommendations.append({
                    "id": self._generate_rec_id(),
                    "title": "Implement Express Update Lanes",
                    "category": RecommendationCategory.OPERATIONS.value,
                    "priority": "medium",
                    "status": "in_progress",
                    "summary": "Create dedicated express lanes for simple updates (mobile, email) to reduce queue times and improve throughput in high-traffic centres.",
                    "rationale": [
                        f"Update fatigue index: {fatigue.get('national_index', 0.72):.2f}",
                        f"Top affected: {high_fatigue[0]['district']}",
                        "Simple updates taking same time as complex ones",
                    ],
                    "expected_impact": {
                        "throughput_increase": "40%",
                        "average_wait_time": "-45 minutes",
                        "staff_efficiency": "+25%",
                    },
                    "resource_requirement": {
                        "budget": "₹5-8 Cr",
                        "timeline": "2-3 months",
                        "training": "500 operators",
                    },
                    "generated_at": datetime.now().isoformat(),
                })
        
        return recommendations
    
    def _outreach_recommendations(self) -> List[Dict[str, Any]]:
        """Generate outreach recommendations"""
        recommendations = []
        states = self.repo.get_state_data()
        
        # Find states with low urban coverage
        low_urban = [s for s in states if s["urban_pct"] < 0.4]
        
        if low_urban:
            recommendations.append({
                "id": self._generate_rec_id(),
                "title": "Rural Outreach Campaign",
                "category": RecommendationCategory.OUTREACH.value,
                "priority": "medium",
                "status": "new",
                "summary": f"Deploy mobile enrolment vans in {len(low_urban)} states with rural coverage below 40% to reach underserved populations.",
                "rationale": [
                    f"{len(low_urban)} states with <40% urban coverage",
                    "Rural saturation estimated at 85% vs 99% urban",
                    "Last mile coverage gap identified",
                ],
                "expected_impact": {
                    "new_enrolments": "500K-800K",
                    "coverage_increase": "+5% national",
                    "inclusion_index": "+8 points",
                },
                "resource_requirement": {
                    "budget": "₹15-20 Cr",
                    "timeline": "12 months",
                    "mobile_units": "100",
                },
                "generated_at": datetime.now().isoformat(),
            })
        
        return recommendations
    
    def _technology_recommendations(self) -> List[Dict[str, Any]]:
        """Generate technology recommendations"""
        recommendations = []
        
        recommendations.append({
            "id": self._generate_rec_id(),
            "title": "Deploy Self-Service Update Kiosks",
            "category": RecommendationCategory.TECHNOLOGY.value,
            "priority": "high",
            "status": "in_progress",
            "summary": "Install self-service kiosks at high-traffic locations for simple updates like mobile and email, reducing operator workload.",
            "rationale": [
                "Mobile/Email updates: 42% of all updates",
                "These require minimal verification",
                "Can be self-served with OTP authentication",
            ],
            "expected_impact": {
                "operator_load_reduction": "30%",
                "cost_per_transaction": "-60%",
                "24x7_availability": "Yes",
            },
            "resource_requirement": {
                "budget": "₹40-50 Cr",
                "timeline": "9-12 months",
                "kiosks": "5000 units",
            },
            "generated_at": datetime.now().isoformat(),
        })
        
        return recommendations
    
    def get_recommendation_stats(self) -> Dict[str, Any]:
        """Get summary statistics about recommendations"""
        recommendations = self.generate_all_recommendations()
        
        by_category = {}
        by_status = {"new": 0, "in_progress": 0, "implemented": 0}
        by_priority = {"high": 0, "medium": 0, "low": 0}
        
        for rec in recommendations:
            cat = rec["category"]
            by_category[cat] = by_category.get(cat, 0) + 1
            by_status[rec["status"]] = by_status.get(rec["status"], 0) + 1
            by_priority[rec["priority"]] = by_priority.get(rec["priority"], 0) + 1
        
        return {
            "total_recommendations": len(recommendations),
            "by_category": by_category,
            "by_status": by_status,
            "by_priority": by_priority,
            "generated_at": datetime.now().isoformat(),
        }


# Singleton instance
recommendation_engine = RecommendationEngine()
