"use client";

import { useEffect, useState } from "react";
import { Card, Badge } from "@/components/ui";
import { api, InsightsData } from "@/lib/api";
import { Lightbulb, TrendingUp, Users, MapPin, Settings, AlertTriangle, ChevronRight } from "lucide-react";

const categoryIcons: Record<string, any> = {
    Migration: MapPin,
    Demographics: Users,
    Operations: Settings,
    Seasonal: TrendingUp,
    Anomalies: AlertTriangle,
};

const priorityColors = {
    high: "danger",
    medium: "warning",
    low: "info",
} as const;

export default function InsightsPage() {
    const [insights, setInsights] = useState<InsightsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedInsight, setSelectedInsight] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await api.insights.get();
                setInsights(data);
                if (data.insights.length > 0) {
                    setSelectedInsight(data.insights[0].id);
                }
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
                <div className="skeleton" style={{ height: 400, borderRadius: 16 }} />
            </div>
        );
    }

    const selectedInsightData = insights?.insights.find((i) => i.id === selectedInsight);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
                        AI-Generated Insights
                    </h1>
                    <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                        Data-driven patterns and actionable intelligence
                    </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: 12 }}>
                    <Lightbulb style={{ width: 16, height: 16, color: "#60a5fa" }} />
                    <span style={{ color: "#60a5fa", fontSize: "0.875rem", fontWeight: 500 }}>
                        {insights?.total_insights} Insights Generated
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                    { label: "High Priority", count: insights?.insights.filter((i) => i.priority === "high").length || 0, color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)", border: "rgba(239, 68, 68, 0.2)" },
                    { label: "Medium Priority", count: insights?.insights.filter((i) => i.priority === "medium").length || 0, color: "#eab308", bg: "rgba(234, 179, 8, 0.1)", border: "rgba(234, 179, 8, 0.2)" },
                    { label: "New Today", count: 3, color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.2)" },
                ].map((stat) => (
                    <div key={stat.label} style={{ padding: 20, background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 12, textAlign: "center" }}>
                        <p style={{ fontSize: "2rem", fontWeight: 700, color: stat.color }}>{stat.count}</p>
                        <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Insights List and Detail */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
                {/* List */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {insights?.insights.map((insight) => {
                        const Icon = categoryIcons[insight.category] || Lightbulb;
                        const isSelected = selectedInsight === insight.id;

                        return (
                            <button
                                key={insight.id}
                                onClick={() => setSelectedInsight(insight.id)}
                                style={{
                                    width: "100%",
                                    padding: 16,
                                    borderRadius: 12,
                                    textAlign: "left",
                                    cursor: "pointer",
                                    background: isSelected ? "rgba(59, 130, 246, 0.15)" : "#1e293b",
                                    border: isSelected ? "2px solid #3b82f6" : "1px solid #334155",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                                    <div style={{ padding: 8, borderRadius: 8, background: isSelected ? "rgba(59, 130, 246, 0.2)" : "#334155" }}>
                                        <Icon style={{ width: 18, height: 18, color: isSelected ? "#60a5fa" : "#94a3b8" }} />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                            <Badge variant={priorityColors[insight.priority as keyof typeof priorityColors]}>
                                                {insight.priority}
                                            </Badge>
                                            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>{insight.category}</span>
                                        </div>
                                        <h4 style={{ fontSize: "0.875rem", fontWeight: 500, color: "#f8fafc", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {insight.title}
                                        </h4>
                                    </div>
                                    <ChevronRight style={{ width: 18, height: 18, color: isSelected ? "#60a5fa" : "#64748b", flexShrink: 0 }} />
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Detail */}
                {selectedInsightData && (
                    <Card>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                            <Badge variant={priorityColors[selectedInsightData.priority as keyof typeof priorityColors]}>
                                {selectedInsightData.priority.toUpperCase()} PRIORITY
                            </Badge>
                            <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>{selectedInsightData.category}</span>
                        </div>

                        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f8fafc", marginBottom: 16 }}>
                            {selectedInsightData.title}
                        </h2>

                        <p style={{ fontSize: "0.9375rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: 24 }}>
                            {selectedInsightData.summary}
                        </p>

                        <div style={{ marginBottom: 24 }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#f8fafc", marginBottom: 12 }}>Key Data Points</h3>
                            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                                {selectedInsightData.data_points.map((point, i) => (
                                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#3b82f6", marginTop: 6, flexShrink: 0 }} />
                                        <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#f8fafc", marginBottom: 12 }}>Implications & Actions</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {selectedInsightData.implications.map((impl, i) => (
                                    <div key={i} style={{ padding: 12, background: "rgba(249, 115, 22, 0.1)", border: "1px solid rgba(249, 115, 22, 0.2)", borderRadius: 8 }}>
                                        <p style={{ fontSize: "0.875rem", color: "#fdba74" }}>{impl}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
