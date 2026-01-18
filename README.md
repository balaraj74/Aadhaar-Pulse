# 🔷 Aadhaar Pulse

## Government-Grade Decision Support Analytics Platform for UIDAI

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Transform aggregated Aadhaar data into actionable insights for policymakers and administrators.

---

## 🎯 Overview

**Aadhaar Pulse** is a comprehensive analytics dashboard designed for UIDAI decision-makers. It provides real-time insights into Aadhaar enrolment and update patterns across India, powered by official Data.gov.in datasets.

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| **📊 Real-Time Analytics** | Dynamically computed KPIs, trends, and growth metrics |
| **🔍 Anomaly Detection** | Z-score based detection of unusual patterns |
| **📈 Forecasting** | 6-month demand prediction with confidence intervals |
| **💡 AI Insights** | Rule-based pattern analysis with actionable recommendations |
| **🗺️ Geographic Analysis** | State-wise heatmaps and regional breakdowns |
| **🛡️ Privacy-Safe** | Only aggregated data - no individual-level information |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ Dashboard│ │ Forecast │ │ Insights │ │ Geography│           │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              │ REST API
┌─────────────────────────────────────────────────────────────────┐
│                       Backend (FastAPI)                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    API Layer (Routers)                      ││
│  │  /overview  /enrolments  /updates  /anomalies  /forecasts  ││
│  │  /insights  /recommendations  /geography                   ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Services Layer                           ││
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ ││
│  │  │ Data Repo    │ │ Analytics    │ │ Anomaly Detection   │ ││
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘ ││
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ ││
│  │  │ Forecasting  │ │ Insights     │ │ Recommendations     │ ││
│  │  └──────────────┘ └──────────────┘ └──────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                 Data Sources                                 ││
│  │  ┌───────────────────┐  ┌─────────────────────────────────┐ ││
│  │  │ Data.gov.in APIs  │  │ Simulated Data (UIDAI Patterns) │ ││
│  │  └───────────────────┘  └─────────────────────────────────┘ ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 📦 Project Structure

```
Aadhaar Pulse/
├── apps/
│   ├── api/                          # FastAPI Backend
│   │   ├── main.py                   # Application entry point
│   │   ├── config.py                 # Configuration management
│   │   ├── routers/                  # API endpoints
│   │   │   ├── overview.py           # Dashboard KPIs
│   │   │   ├── enrolments.py         # Enrolment analytics
│   │   │   ├── updates.py            # Update patterns
│   │   │   ├── anomalies.py          # Anomaly detection
│   │   │   ├── forecasts.py          # Time-series forecasting
│   │   │   ├── insights.py           # AI-generated insights
│   │   │   ├── recommendations.py    # Policy recommendations
│   │   │   └── geography.py          # Geographic analysis
│   │   └── services/                 # Business logic
│   │       ├── data_repository.py    # Data management
│   │       ├── analytics_service.py  # Computed metrics
│   │       ├── anomaly_engine.py     # Anomaly detection
│   │       ├── forecast_engine.py    # Forecasting
│   │       ├── insight_engine.py     # Insight generation
│   │       └── recommendation_engine.py
│   │
│   └── web/                          # Next.js Frontend
│       ├── src/
│       │   ├── app/                  # App Router pages
│       │   │   ├── page.tsx          # Dashboard
│       │   │   ├── enrolments/
│       │   │   ├── updates/
│       │   │   ├── anomalies/
│       │   │   ├── forecasts/
│       │   │   ├── insights/
│       │   │   ├── recommendations/
│       │   │   └── geography/
│       │   ├── components/           # UI components
│       │   └── lib/                  # API client
│       └── package.json
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites

- **Python** 3.10+ ([Download](https://python.org))
- **Node.js** 18+ ([Download](https://nodejs.org))
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/balaraj74/Aadhaar-Pulse.git
cd Aadhaar-Pulse
```

### 2. Setup Backend (FastAPI)

```bash
# Navigate to API directory
cd apps/api

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate        # Linux/macOS
# OR
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your API keys:
# - GEMINI_API_KEY (for AI insights)
# - DATA_GOV_API_KEY (for data.gov.in)

# Start the API server
python -m uvicorn main:app --reload --port 8000
```

The API will be running at **http://localhost:8000**

### 3. Setup Frontend (Next.js)

Open a **new terminal** and run:

```bash
# Navigate to web directory
cd apps/web

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be running at **http://localhost:3000**

### 4. Access the Application

| Service | URL |
|---------|-----|
| **Dashboard** | http://localhost:3000 |
| **API Documentation** | http://localhost:8000/docs |
| **API Health Check** | http://localhost:8000/api/v1/overview |

### 🔑 Environment Variables

Create a `.env` file in `apps/api/` with the following:

```env
# Environment
ENVIRONMENT=development
DEBUG=true

# Data.gov.in API (optional - uses simulated data if not set)
DATA_GOV_API_KEY=your_data_gov_api_key

# Gemini AI (required for AI insights)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

# Cache Settings
CACHE_TTL_SECONDS=300

# Analytics Settings
FORECAST_HORIZON_MONTHS=6
ANOMALY_ZSCORE_THRESHOLD=2.5
```

### 🛑 Stopping the Servers

- Press `Ctrl+C` in each terminal to stop the servers

### 🔄 Running Both Servers Together

For convenience, you can use two terminals:

**Terminal 1 (API):**
```bash
cd apps/api && source venv/bin/activate && python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 (Web):**
```bash
cd apps/web && npm run dev
```

---

## 📡 API Endpoints

All endpoints return computed values - never static data.

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/overview` | Dashboard summary with KPIs and alerts |
| `GET /api/v1/enrolments` | Enrolment analytics and demographics |
| `GET /api/v1/enrolments/timeseries` | Monthly enrolment time series |
| `GET /api/v1/updates` | Update type distribution and patterns |
| `GET /api/v1/updates/fatigue` | Update fatigue index by region |
| `GET /api/v1/anomalies` | Detected anomalies with explanations |
| `GET /api/v1/forecasts` | 6-month demand forecasts |
| `GET /api/v1/forecasts/capacity` | Capacity planning analysis |
| `GET /api/v1/insights` | AI-generated pattern insights |
| `GET /api/v1/recommendations` | Policy recommendations |
| `GET /api/v1/geography` | State-wise heatmap and regions |
| `GET /api/v1/geography/state/{code}` | State detail data |

---

## 🔮 Analytics Capabilities

### 📊 Metrics Computed

- **Total Enrolments**: Cumulative Aadhaar registrations (1.45B+)
- **Monthly Growth**: YoY and MoM trends
- **Update Patterns**: Type distribution (Address, Mobile, Biometric, etc.)
- **Seasonal Indices**: Monthly variation patterns
- **Regional Distribution**: State and region aggregates

### ⚠️ Anomaly Detection

Uses statistical methods:
- **Z-Score Analysis**: Detects values > 2.5 standard deviations
- **Rule-Based Detection**: Specific pattern rules
  - Enrolment surges (>20% above expected)
  - Update fatigue (high repeat rates)
  - Demographic imbalances
  - Geographic disparities

### 📈 Forecasting

- **Model**: Prophet-style decomposition (trend + seasonal)
- **Horizon**: 6 months ahead
- **Metrics**: R², MAPE, MAE, RMSE
- **Output**: Point forecast + 95% confidence interval

### 💡 Insight Categories

| Category | Example |
|----------|---------|
| Migration | "23% increase in address updates in Mumbai metropolitan region" |
| Demographics | "Youth enrolment surge in Bihar aligns with academic calendar" |
| Operations | "Update fatigue index at 0.72 in metro areas" |
| Seasonal | "October-March sees 15% higher enrolment activity" |

---

## 🏛️ Data Sources

### Official Government Datasets

| Dataset | Source | Use |
|---------|--------|-----|
| Aadhaar Monthly Enrolment | Data.gov.in | Enrolment trends |
| Aadhaar by Gender & Age | Data.gov.in | Demographics |
| Demographic Updates | Data.gov.in | Update patterns |
| Biometric Updates | Data.gov.in | Biometric analysis |

### Data Notes

- **Privacy**: All data is aggregated at state/district level
- **No PII**: No individual-level data is processed or stored
- **Compliance**: Adheres to UIDAI data guidelines
- **Fallback**: When API unavailable, uses simulated data based on official patterns

---

## 🛡️ Privacy & Compliance

✅ **No Individual Data** - Only aggregated statistics  
✅ **No PII** - No personal identifiable information  
✅ **Government Sources Only** - Official Data.gov.in datasets  
✅ **UIDAI Guidelines** - Compliant with data handling policies  
✅ **Audit Trail** - All data sources documented  

---

## 🧪 Development

### Running Tests

```bash
# Backend
cd apps/api
pytest

# Frontend
cd apps/web
npm test
```

### Adding New Features

1. **New API Endpoint**: Add router in `apps/api/routers/`
2. **New Service**: Add logic in `apps/api/services/`
3. **Frontend Page**: Add page in `apps/web/src/app/`
4. **API Client**: Update `apps/web/src/lib/api.ts`

---

## 🔄 Extending the System

### Adding New Data Sources

```python
# In services/data_repository.py
async def fetch_new_dataset(self):
    data = await data_gov_client.fetch_resource(
        resource_id="your-resource-id",
        limit=1000
    )
    # Process and store
```

### Adding New Insights

```python
# In services/insight_engine.py
def _detect_new_pattern(self) -> List[Dict]:
    # Analyze data
    if condition_met:
        return [{
            "title": "New Pattern Detected",
            "category": "Custom",
            "priority": "high",
            # ...
        }]
```

---

## 📋 Hackathon Evaluation Criteria

| Criteria | Implementation |
|----------|----------------|
| **Functionality** | Full-featured dashboard with 8 pages |
| **Real Data** | Data.gov.in integration + realistic simulation |
| **Analytics** | Computed metrics, never hard-coded |
| **ML/AI** | Anomaly detection, forecasting, insights |
| **Privacy** | Aggregated data only, no PII |
| **Scalability** | Service-oriented architecture |
| **UX** | Premium dark theme, responsive design |
| **Documentation** | Comprehensive README and API docs |

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- **UIDAI** - For Aadhaar infrastructure
- **Data.gov.in** - For open government data
- **Open Source** - FastAPI, Next.js, Recharts, Tailwind CSS

---

<div align="center">

**Built for UIDAI Hackathon 2026** 🇮🇳

[API Docs](http://localhost:8000/docs) | [Dashboard](http://localhost:3000) | [Data.gov.in](https://data.gov.in)

</div>
