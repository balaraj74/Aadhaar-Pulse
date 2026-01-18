"""
Gemini AI Analytics Service
Advanced AI-powered analysis using Google Gemini 2.5 Flash
"""
import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import google.generativeai as genai
from config import settings

logger = logging.getLogger(__name__)


class GeminiAnalyticsService:
    """
    AI-powered analytics using Gemini 2.5 Flash.
    Provides intelligent insights, anomaly explanations, and recommendations.
    """
    
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._initialized = False
        self._model = None
        
        self._initialize()
    
    def _initialize(self):
        """Initialize Gemini API"""
        try:
            if self.api_key:
                genai.configure(api_key=self.api_key)
                self._model = genai.GenerativeModel(self.model_name)
                self._initialized = True
                logger.info(f"✅ Gemini AI initialized with {self.model_name}")
            else:
                logger.warning("⚠️ Gemini API key not configured")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini: {e}")
            self._initialized = False
    
    async def analyze_data(self, data: Dict[str, Any], analysis_type: str = "general") -> Dict[str, Any]:
        """
        Perform AI-powered analysis on Aadhaar data.
        
        Args:
            data: The data to analyze
            analysis_type: Type of analysis (general, anomaly, forecast, recommendation)
        
        Returns:
            AI-generated analysis results
        """
        if not self._initialized:
            return {"error": "Gemini AI not initialized", "fallback": True}
        
        try:
            prompt = self._build_prompt(data, analysis_type)
            response = self._model.generate_content(prompt)
            
            return {
                "analysis": response.text,
                "model": self.model_name,
                "analysis_type": analysis_type,
                "generated_at": datetime.now().isoformat(),
                "ai_powered": True,
            }
        except Exception as e:
            logger.error(f"Gemini analysis error: {e}")
            return {"error": str(e), "fallback": True}
    
    def analyze_data_sync(self, data: Dict[str, Any], analysis_type: str = "general") -> Dict[str, Any]:
        """Synchronous version of analyze_data"""
        if not self._initialized:
            return {"error": "Gemini AI not initialized", "fallback": True}
        
        try:
            prompt = self._build_prompt(data, analysis_type)
            response = self._model.generate_content(prompt)
            
            return {
                "analysis": response.text,
                "model": self.model_name,
                "analysis_type": analysis_type,
                "generated_at": datetime.now().isoformat(),
                "ai_powered": True,
            }
        except Exception as e:
            logger.error(f"Gemini analysis error: {e}")
            return {"error": str(e), "fallback": True}
    
    def _build_prompt(self, data: Dict[str, Any], analysis_type: str) -> str:
        """Build appropriate prompt based on analysis type"""
        
        base_context = """You are an expert data analyst working for UIDAI (Unique Identification Authority of India) 
analyzing Aadhaar enrolment and update data. Provide actionable, data-driven insights for government decision-makers.
Be specific with numbers and percentages. Keep responses concise but impactful."""
        
        if analysis_type == "overview":
            return f"""{base_context}

Analyze this Aadhaar dashboard overview data and provide 3-5 key executive insights:

{json.dumps(data, indent=2)}

Focus on:
1. Key performance trends
2. Areas of concern
3. Growth opportunities
4. Operational recommendations

Format as bullet points, be specific with numbers."""
        
        elif analysis_type == "anomaly":
            return f"""{base_context}

Analyze these detected anomalies in Aadhaar data and explain their likely causes and recommended actions:

{json.dumps(data, indent=2)}

For each anomaly, provide:
1. Root cause analysis (why this might be happening)
2. Impact assessment (what this means for operations)
3. Immediate action items
4. Long-term prevention measures

Be specific and actionable."""
        
        elif analysis_type == "forecast":
            return f"""{base_context}

Analyze this forecast data and provide strategic planning recommendations:

{json.dumps(data, indent=2)}

Provide:
1. Demand outlook summary
2. Capacity planning recommendations
3. Resource allocation suggestions
4. Risk factors to monitor
5. Key dates or periods requiring attention

Be quantitative where possible."""
        
        elif analysis_type == "recommendation":
            return f"""{base_context}

Based on this Aadhaar operational data, generate strategic policy recommendations:

{json.dumps(data, indent=2)}

For each recommendation:
1. Clear action title
2. Rationale based on the data
3. Expected impact (quantified)
4. Implementation timeline
5. Resource requirements
6. Success metrics

Prioritize by impact and feasibility."""
        
        elif analysis_type == "geographic":
            return f"""{base_context}

Analyze this geographic distribution of Aadhaar enrolments:

{json.dumps(data, indent=2)}

Provide insights on:
1. Regional performance disparities
2. States requiring intervention
3. Urban-rural coverage gaps
4. Resource reallocation recommendations
5. Targeted outreach strategies

Be specific about which states and districts need attention."""
        
        elif analysis_type == "demographic":
            return f"""{base_context}

Analyze this demographic data of Aadhaar enrolments:

{json.dumps(data, indent=2)}

Identify:
1. Age group trends
2. Gender parity analysis
3. Underserved populations
4. Saturation levels by segment
5. Targeted campaign recommendations

Provide actionable insights for inclusive coverage."""
        
        else:  # general
            return f"""{base_context}

Analyze this Aadhaar data and provide comprehensive insights:

{json.dumps(data, indent=2)}

Provide:
1. Key observations
2. Trend analysis
3. Recommendations
4. Risk factors

Be concise but thorough."""
    
    def generate_executive_summary(self, overview_data: Dict, 
                                   anomalies: List[Dict],
                                   forecasts: Dict) -> Dict[str, Any]:
        """Generate an AI-powered executive summary"""
        if not self._initialized:
            return self._fallback_summary(overview_data)
        
        try:
            prompt = f"""You are a senior data analyst at UIDAI creating a daily executive briefing for leadership.

Based on the following data, create a concise executive summary:

## Overview Metrics
{json.dumps(overview_data, indent=2)}

## Active Anomalies
{json.dumps(anomalies[:5], indent=2)}

## Forecast Outlook
{json.dumps(forecasts, indent=2)}

Generate an executive summary with:
1. ONE-LINE HEADLINE: A single impactful sentence summarizing today's status
2. KEY METRICS BOX: 3-4 critical numbers leaders need to see
3. ATTENTION REQUIRED: Top 2-3 issues needing immediate attention
4. POSITIVE DEVELOPMENTS: 1-2 areas of good performance
5. RECOMMENDATION: Single most important action to take today

Keep it under 300 words. Be direct and actionable."""

            response = self._model.generate_content(prompt)
            
            return {
                "executive_summary": response.text,
                "generated_by": "Gemini 2.5 Flash",
                "generated_at": datetime.now().isoformat(),
                "ai_powered": True,
            }
        except Exception as e:
            logger.error(f"Executive summary generation error: {e}")
            return self._fallback_summary(overview_data)
    
    def _fallback_summary(self, data: Dict) -> Dict[str, Any]:
        """Fallback summary when AI is unavailable"""
        return {
            "executive_summary": f"""
## Daily Briefing - {datetime.now().strftime('%B %d, %Y')}

**Status**: Operational

**Key Metrics**:
- Total Enrolments: {data.get('summary', {}).get('total_enrolments', 0):,}
- Active Centres: {data.get('summary', {}).get('active_centres', 0):,}

**Note**: AI-powered analysis temporarily unavailable.
""",
            "generated_by": "fallback",
            "generated_at": datetime.now().isoformat(),
            "ai_powered": False,
        }
    
    def explain_anomaly(self, anomaly: Dict[str, Any]) -> Dict[str, Any]:
        """Generate AI explanation for a specific anomaly"""
        if not self._initialized:
            return {"explanation": anomaly.get("description", ""), "ai_powered": False}
        
        try:
            prompt = f"""You are an Aadhaar operations expert. Explain this anomaly to a government official:

Anomaly Type: {anomaly.get('type')}
Severity: {anomaly.get('severity')}
Location: {anomaly.get('state')}, {anomaly.get('district')}
Description: {anomaly.get('description')}
Deviation Score: {anomaly.get('deviation_score')}
Evidence: {json.dumps(anomaly.get('evidence', {}))}

Provide:
1. Plain English explanation (2-3 sentences)
2. Most likely cause
3. Recommended action (specific and actionable)
4. Timeline urgency (immediate/this week/this month)

Be concise and professional."""

            response = self._model.generate_content(prompt)
            
            return {
                "anomaly_id": anomaly.get("id"),
                "explanation": response.text,
                "ai_powered": True,
                "model": self.model_name,
            }
        except Exception as e:
            return {
                "explanation": anomaly.get("description", ""),
                "error": str(e),
                "ai_powered": False,
            }
    
    def generate_smart_insight(self, data: Dict[str, Any], context: str = "") -> Dict[str, Any]:
        """Generate a smart insight from data patterns"""
        if not self._initialized:
            return {"insight": "AI insights unavailable", "ai_powered": False}
        
        try:
            prompt = f"""You are an AI assistant analyzing Aadhaar data patterns for UIDAI.

Context: {context}
Data: {json.dumps(data, indent=2)}

Generate ONE high-impact insight in this format:
{{
    "title": "Brief, attention-grabbing title",
    "summary": "2-3 sentence explanation of the pattern",
    "impact": "What this means for operations",
    "action": "Specific recommended action",
    "confidence": 0.0-1.0 confidence score
}}

Return ONLY valid JSON, no other text."""

            response = self._model.generate_content(prompt)
            
            # Try to parse JSON from response
            try:
                insight = json.loads(response.text)
            except:
                insight = {"title": "AI Insight", "summary": response.text, "confidence": 0.8}
            
            insight["ai_powered"] = True
            insight["model"] = self.model_name
            return insight
            
        except Exception as e:
            return {"insight": str(e), "ai_powered": False}
    
    def chat_with_data(self, question: str, data_context: Dict[str, Any]) -> Dict[str, Any]:
        """Answer natural language questions about the data"""
        if not self._initialized:
            return {"answer": "AI chat unavailable", "ai_powered": False}
        
        try:
            prompt = f"""You are an AI assistant for the Aadhaar Pulse dashboard.
Answer the user's question based on this data context:

{json.dumps(data_context, indent=2)}

User Question: {question}

Provide a clear, accurate answer based on the data. If the data doesn't contain the answer, say so.
Be specific with numbers and dates when available."""

            response = self._model.generate_content(prompt)
            
            return {
                "question": question,
                "answer": response.text,
                "ai_powered": True,
                "model": self.model_name,
                "generated_at": datetime.now().isoformat(),
            }
        except Exception as e:
            return {"answer": f"Error: {e}", "ai_powered": False}
    
    def is_available(self) -> bool:
        """Check if Gemini AI is available"""
        return self._initialized


# Singleton instance
gemini_service = GeminiAnalyticsService()
