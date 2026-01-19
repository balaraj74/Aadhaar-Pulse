"use client";

import { useEffect, useState } from "react";
import { Card, Badge, DataTable } from "@/components/ui";
import { DistributionPieChart } from "@/components/Charts";
import { KPICard } from "@/components/KPICard";
import { api, AnomaliesData, AnomalySummaryData } from "@/lib/api";
import { Eye } from "lucide-react";

export default function AnomaliesPage() {
    const [anomalies, setAnomalies] = useState<AnomaliesData | null>(null);
    const [summary, setSummary] = useState<AnomalySummaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [anomaliesData, summaryData] = await Promise.all([
                    api.anomalies.get(),
                    api.anomalies.getSummary(),
                ]);
                setAnomalies(anomaliesData);
                setSummary(summaryData);
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />
                    ))}
                </div>
            </div>
        );
    }

    const severityData = anomalies ? [
        { name: "High", value: anomalies.by_severity.high },
        { name: "Medium", value: anomalies.by_severity.medium },
        { name: "Low", value: anomalies.by_severity.low },
    ] : [];

    const typeData = summary?.by_type.map((t) => ({ name: t.type, value: t.count })) || [];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
                        Anomaly Explorer
                    </h1>
                    <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                        Statistical anomaly detection with explanations and recommendations
                    </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.3)", borderRadius: 12 }}>
                    <span style={{ color: "#f97316", fontSize: "0.875rem", fontWeight: 500 }}>
                        {anomalies?.total_anomalies} Active Anomalies
                    </span>
                </div>
            </div>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                <KPICard title="Total Detected" value={anomalies?.total_anomalies || 0} change={summary?.trend.change || 0} trend={(summary?.trend.change || 0) < 0 ? "down" : "up"} icon="users" delay={0} />
                <KPICard title="High Severity" value={anomalies?.by_severity.high || 0} icon="refresh" delay={100} />
                <KPICard title="Resolved This Month" value={summary?.summary.resolved || 0} icon="building" delay={200} />
                <KPICard title="Under Investigation" value={summary?.summary.under_investigation || 0} icon="map" delay={300} />
            </div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <Card title="Anomalies by Severity" subtitle="Distribution by severity level">
                    <DistributionPieChart data={severityData} />
                </Card>
                <Card title="Anomalies by Type" subtitle="Distribution by anomaly category">
                    <DistributionPieChart data={typeData} />
                </Card>
            </div>

            {/* Anomaly List */}
            <Card title="Recent Anomalies" subtitle="Detected anomalies requiring attention">
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {anomalies?.anomalies.map((anomaly) => (
                        <div
                            key={anomaly.id}
                            style={{
                                padding: 20,
                                background: "#1e293b",
                                borderRadius: 12,
                                border: "1px solid #334155",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <Badge variant={anomaly.severity === "high" ? "danger" : anomaly.severity === "medium" ? "warning" : "info"}>
                                        {anomaly.severity.toUpperCase()}
                                    </Badge>
                                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>{anomaly.id}</span>
                                </div>
                                <button style={{ display: "flex", alignItems: "center", gap: 6, color: "#60a5fa", fontSize: "0.875rem", background: "none", border: "none", cursor: "pointer" }}>
                                    <Eye style={{ width: 16, height: 16 }} />
                                    View Details
                                </button>
                            </div>
                            <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "#f8fafc", marginBottom: 8 }}>{anomaly.type}</h4>
                            <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginBottom: 12 }}>{anomaly.description}</p>
                            <div style={{ display: "flex", gap: 16, fontSize: "0.75rem", color: "#64748b", marginBottom: 12 }}>
                                <span>📍 {anomaly.district}, {anomaly.state}</span>
                                <span>📊 Deviation: {anomaly.deviation_score > 0 ? "+" : ""}{anomaly.deviation_score.toFixed(1)}σ</span>
                            </div>
                            <div style={{ padding: 12, background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 8 }}>
                                <p style={{ fontSize: "0.875rem", color: "#93c5fd" }}>
                                    <strong>Recommendation:</strong> {anomaly.recommendation}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
