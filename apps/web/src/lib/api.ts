/**
 * Aadhaar Pulse API Client
 * Full TypeScript client for all backend endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Types
export interface OverviewData {
    summary: {
        total_enrolments: number;
        total_updates: number;
        active_centres: number;
        states_covered: number;
    };
    trends: {
        enrolment_growth_yoy: number;
        update_growth_yoy: number;
        daily_average_enrolments: number;
        daily_average_updates: number;
    };
    distribution: {
        urban_rural_ratio: { urban: number; rural: number };
        gender_split: { male: number; female: number };
    };
    top_performing_states: Array<{
        state: string;
        code: string;
        enrolments: number;
        growth: number;
    }>;
    alerts: Array<{
        type: string;
        message: string;
        region: string;
        severity: string;
    }>;
    metadata: {
        data_source: string;
        last_refresh: string;
        computed_at: string;
    };
}

export interface TimeSeriesData {
    series: Array<{
        period: string;
        month_name: string;
        value: number;
        cumulative?: number;
        yoy_growth?: number;
    }>;
    count: number;
}

export interface StatesData {
    states: Array<{
        name: string;
        code: string;
        enrolments: number;
        monthly_enrolments?: number;
        growth: number;
        region?: string;
    }>;
    total_states?: number;
}

export interface DemographicsData {
    age_distribution: Array<{ age_group: string; count: number; percentage: number }>;
    gender_distribution: Array<{ gender: string; count: number; percentage: number }>;
    location_distribution: Array<{ location: string; count: number; percentage: number }>;
}

export interface UpdateTypesData {
    update_types: Array<{
        type: string;
        count: number;
        percentage: number;
    }>;
    most_common?: string;
}

export interface UpdatePatternsData {
    seasonal_patterns: Array<{
        month: string;
        month_num: number;
        index: number;
    }>;
    update_fatigue_index: {
        national_index: number;
        high_fatigue_districts: Array<{
            district: string;
            state: string;
            score: number;
        }>;
        trend: string;
    };
}

export interface AnomaliesData {
    anomalies: Array<{
        id: string;
        type: string;
        severity: string;
        state: string;
        district: string;
        description: string;
        deviation_score: number;
        detected_at: string;
        recommendation: string;
        evidence?: Record<string, any>;
    }>;
    total_anomalies: number;
    by_severity: {
        high: number;
        medium: number;
        low: number;
        critical: number;
    };
}

export interface AnomalySummaryData {
    total_anomalies: number;
    by_severity: Record<string, number>;
    by_type: Array<{ type: string; count: number }>;
    summary: {
        resolved: number;
        under_investigation: number;
        new: number;
    };
    trend: {
        direction: string;
        change: number;
    };
}

export interface ForecastData {
    metric: string;
    historical: Array<{
        period: string;
        month_name: string;
        value: number;
    }>;
    forecast: Array<{
        period: string;
        month_name: string;
        predicted: number;
        lower: number;
        upper: number;
        confidence: number;
    }>;
    accuracy_metrics: {
        r_squared: number;
        mape: number;
        mae: number;
        rmse: number;
    };
    model_info: {
        name: string;
        last_trained: string;
        training_samples: number;
    };
}

export interface CapacityData {
    capacity_analysis: {
        current_capacity: number;
        current_utilization: number;
        predicted_demand_peak: number;
        capacity_gap: number;
        recommendation: string;
    };
    by_region: Array<{
        region: string;
        current_capacity: number;
        predicted_demand: number;
        utilization: number;
        status: string;
    }>;
}

export interface InsightsData {
    insights: Array<{
        id: string;
        title: string;
        category: string;
        priority: string;
        summary: string;
        data_points: string[];
        implications: string[];
        confidence: number;
        generated_at: string;
    }>;
    total_insights: number;
}

export interface RecommendationsData {
    recommendations: Array<{
        id: string;
        title: string;
        category: string;
        priority: string;
        status: string;
        summary: string;
        rationale: string[];
        expected_impact: Record<string, string>;
        resource_requirement: Record<string, string>;
        generated_at: string;
    }>;
    total_recommendations: number;
}

export interface HeatmapData {
    data: Array<{
        code: string;
        name: string;
        value: number;
        normalized: number;
    }>;
    total: number;
}

export interface GeographyStatesData {
    states: Array<{
        code: string;
        name: string;
        region: string;
        enrolments: number;
        growth: number;
        urban_pct: number;
    }>;
    total: number;
}

// API Client
async function fetchAPI<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}/api/v1${endpoint}`;

    try {
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        throw error;
    }
}

// API Methods
export const api = {
    overview: {
        get: () => fetchAPI<OverviewData>("/overview"),
        getKPIs: () => fetchAPI<any>("/overview/kpis"),
        getSummary: () => fetchAPI<any>("/overview/summary"),
        getTrends: () => fetchAPI<any>("/overview/trends"),
        getAlerts: () => fetchAPI<any>("/overview/alerts"),
    },

    enrolments: {
        get: () => fetchAPI<any>("/enrolments"),
        getTimeSeries: (months = 24) => fetchAPI<TimeSeriesData>(`/enrolments/timeseries?months=${months}`),
        getStates: () => fetchAPI<StatesData>("/enrolments/states"),
        getDemographics: () => fetchAPI<DemographicsData>("/enrolments/demographics"),
        getStateDetails: (code: string) => fetchAPI<any>(`/enrolments/state/${code}`),
    },

    updates: {
        get: () => fetchAPI<any>("/updates"),
        getTypes: () => fetchAPI<UpdateTypesData>("/updates/types"),
        getTimeSeries: (months = 24) => fetchAPI<TimeSeriesData>(`/updates/timeseries?months=${months}`),
        getPatterns: () => fetchAPI<UpdatePatternsData>("/updates/patterns"),
        getFatigue: () => fetchAPI<any>("/updates/fatigue"),
    },

    anomalies: {
        get: (severity?: string, type?: string) => {
            let url = "/anomalies";
            const params = [];
            if (severity) params.push(`severity=${severity}`);
            if (type) params.push(`type=${type}`);
            if (params.length) url += `?${params.join("&")}`;
            return fetchAPI<AnomaliesData>(url);
        },
        getSummary: () => fetchAPI<AnomalySummaryData>("/anomalies/summary"),
        getDetail: (id: string) => fetchAPI<any>(`/anomalies/${id}`),
        explain: (id: string) => fetchAPI<any>(`/anomalies/explain/${id}`),
    },

    forecasts: {
        get: (metric = "enrolments") => fetchAPI<ForecastData>(`/forecasts?metric=${metric}`),
        getEnrolments: () => fetchAPI<ForecastData>("/forecasts/enrolments"),
        getUpdates: () => fetchAPI<ForecastData>("/forecasts/updates"),
        getCapacity: () => fetchAPI<CapacityData>("/forecasts/capacity"),
        getAccuracy: () => fetchAPI<any>("/forecasts/accuracy"),
    },

    insights: {
        get: (category?: string, priority?: string) => {
            let url = "/insights";
            const params = [];
            if (category) params.push(`category=${category}`);
            if (priority) params.push(`priority=${priority}`);
            if (params.length) url += `?${params.join("&")}`;
            return fetchAPI<InsightsData>(url);
        },
        getStats: () => fetchAPI<any>("/insights/stats"),
        getDetail: (id: string) => fetchAPI<any>(`/insights/${id}`),
        getCategories: () => fetchAPI<any>("/insights/categories"),
    },

    recommendations: {
        get: (category?: string, status?: string) => {
            let url = "/recommendations";
            const params = [];
            if (category) params.push(`category=${category}`);
            if (status) params.push(`status=${status}`);
            if (params.length) url += `?${params.join("&")}`;
            return fetchAPI<RecommendationsData>(url);
        },
        getStats: () => fetchAPI<any>("/recommendations/stats"),
        getDetail: (id: string) => fetchAPI<any>(`/recommendations/${id}`),
        getImpact: (id: string) => fetchAPI<any>(`/recommendations/impact/${id}`),
    },

    geography: {
        get: () => fetchAPI<any>("/geography"),
        getHeatmap: () => fetchAPI<HeatmapData>("/geography/heatmap"),
        getStates: (region?: string) => {
            let url = "/geography/states";
            if (region) url += `?region=${region}`;
            return fetchAPI<GeographyStatesData>(url);
        },
        getRegions: () => fetchAPI<any>("/geography/regions"),
        getStateDetail: (code: string) => fetchAPI<any>(`/geography/state/${code}`),
        getDistricts: (stateCode: string) => fetchAPI<any>(`/geography/districts/${stateCode}`),
    },

    metadata: {
        get: () => fetchAPI<any>("/metadata"),
    },

    ai: {
        getStatus: () => fetchAPI<any>("/ai/status"),
        getExecutiveSummary: () => fetchAPI<any>("/ai/executive-summary"),
        analyzeOverview: () => fetchAPI<any>("/ai/analyze/overview"),
        explainAnomaly: (id: string) => fetchAPI<any>(`/ai/explain/anomaly/${id}`),
        chat: (question: string) =>
            fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question })
            }).then(res => res.json()),
    },
};
