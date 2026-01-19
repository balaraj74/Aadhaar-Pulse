"use client";

import { useEffect, useState } from "react";
import { Card, Badge, DataTable } from "@/components/ui";
import { ForecastChart } from "@/components/Charts";
import { api, ForecastData, CapacityData } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react";

export default function ForecastsPage() {
    const [forecast, setForecast] = useState<ForecastData | null>(null);
    const [capacity, setCapacity] = useState<CapacityData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [forecastData, capacityData] = await Promise.all([
                    api.forecasts.get(),
                    api.forecasts.getCapacity(),
                ]);
                setForecast(forecastData);
                setCapacity(capacityData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div className="skeleton" style={{ height: 40, width: 300, borderRadius: 8 }} />
                <div className="skeleton" style={{ height: 350, borderRadius: 16 }} />
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div>
                <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
                    Predictive Insights
                </h1>
                <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                    AI-powered demand forecasting and capacity planning
                </p>
            </div>

            {/* Model Info */}
            <div style={{ padding: 20, background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ padding: 12, borderRadius: 12, background: "rgba(59, 130, 246, 0.2)" }}>
                        <TrendingUp style={{ width: 24, height: 24, color: "#60a5fa" }} />
                    </div>
                    <div>
                        <p style={{ fontSize: "1rem", fontWeight: 600, color: "#f8fafc" }}>Prophet Time Series Model</p>
                        <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Last trained: Dec 1, 2024</p>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 32 }}>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#22c55e" }}>{forecast?.accuracy_metrics.r_squared}</p>
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>R² Score</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#60a5fa" }}>{forecast?.accuracy_metrics.mape}%</p>
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>MAPE</p>
                    </div>
                </div>
            </div>

            {/* Forecast Chart */}
            <Card
                title="6-Month Demand Forecast"
                subtitle="Predicted enrolment volume with 95% confidence interval"
                headerAction={<Badge variant="info"><Target style={{ width: 12, height: 12 }} /> High Confidence</Badge>}
            >
                <ForecastChart data={forecast?.forecast || []} />
                <div style={{ marginTop: 16, display: "flex", gap: 24, fontSize: "0.75rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 16, height: 3, background: "#3b82f6", borderRadius: 2 }} />
                        <span style={{ color: "#94a3b8" }}>Forecast</span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 16, height: 16, background: "rgba(59, 130, 246, 0.2)", borderRadius: 4 }} />
                        <span style={{ color: "#94a3b8" }}>Confidence Interval</span>
                    </span>
                </div>
            </Card>

            {/* Forecast Table */}
            <Card title="Detailed Forecast Values">
                <DataTable
                    columns={[
                        { key: "period", label: "Period" },
                        { key: "predicted", label: "Predicted", align: "right" },
                        { key: "lower", label: "Lower Bound", align: "right" },
                        { key: "upper", label: "Upper Bound", align: "right" },
                    ]}
                    data={forecast?.forecast.map((f) => ({
                        period: f.period,
                        predicted: formatNumber(f.predicted),
                        lower: formatNumber(f.lower),
                        upper: formatNumber(f.upper),
                    })) || []}
                />
            </Card>

            {/* Capacity Planning */}
            <Card title="Capacity Planning" subtitle="Infrastructure readiness assessment">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                    {[
                        { label: "Current Capacity", value: formatNumber(capacity?.capacity_analysis.current_capacity || 0), color: "#f8fafc" },
                        { label: "Utilization", value: `${((capacity?.capacity_analysis.current_utilization || 0) * 100).toFixed(0)}%`, color: "#eab308" },
                        { label: "Predicted Peak", value: formatNumber(capacity?.capacity_analysis.predicted_demand_peak || 0), color: "#f97316" },
                        { label: "Capacity Gap", value: formatNumber(capacity?.capacity_analysis.capacity_gap || 0), color: "#ef4444" },
                    ].map((item) => (
                        <div key={item.label} style={{ padding: 16, background: "#1e293b", borderRadius: 12 }}>
                            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginBottom: 4 }}>{item.label}</p>
                            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: item.color }}>{item.value}</p>
                        </div>
                    ))}
                </div>

                <div style={{ padding: 16, background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.2)", borderRadius: 12, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                    <AlertCircle style={{ width: 20, height: 20, color: "#f97316" }} />
                    <p style={{ fontSize: "0.875rem", color: "#fdba74" }}>{capacity?.capacity_analysis.recommendation}</p>
                </div>

                <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#f8fafc", marginBottom: 16 }}>Regional Capacity Status</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                    {capacity?.by_region.map((region) => (
                        <div
                            key={region.region}
                            style={{
                                padding: 16,
                                borderRadius: 12,
                                background: region.status === "adequate" ? "rgba(34, 197, 94, 0.1)" : "rgba(249, 115, 22, 0.1)",
                                border: `1px solid ${region.status === "adequate" ? "rgba(34, 197, 94, 0.2)" : "rgba(249, 115, 22, 0.2)"}`,
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#f8fafc" }}>{region.region}</p>
                                <Badge variant={region.status === "adequate" ? "success" : "warning"}>
                                    {region.status === "adequate" ? <CheckCircle style={{ width: 12, height: 12 }} /> : <AlertCircle style={{ width: 12, height: 12 }} />}
                                    {region.status === "adequate" ? "OK" : "Stress"}
                                </Badge>
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span>Capacity</span>
                                    <span style={{ color: "#f8fafc" }}>{formatNumber(region.current_capacity)}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Demand</span>
                                    <span style={{ color: "#f8fafc" }}>{formatNumber(region.predicted_demand)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
