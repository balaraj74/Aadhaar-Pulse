"use client";

import { useEffect, useState } from "react";
import { Card, Badge } from "@/components/ui";
import { api, RecommendationsData } from "@/lib/api";
import { FileText, CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";

const statusColors = {
    new: "info",
    in_progress: "warning",
    implemented: "success",
} as const;

const statusIcons = {
    new: AlertCircle,
    in_progress: Clock,
    implemented: CheckCircle,
};

export default function RecommendationsPage() {
    const [recommendations, setRecommendations] = useState<RecommendationsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await api.recommendations.get();
                setRecommendations(data);
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
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton" style={{ height: 200, borderRadius: 16 }} />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
                        Policy Recommendations
                    </h1>
                    <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                        Data-driven recommendations for infrastructure and operations
                    </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(139, 92, 246, 0.1)", border: "1px solid rgba(139, 92, 246, 0.3)", borderRadius: 12 }}>
                    <FileText style={{ width: 16, height: 16, color: "#a78bfa" }} />
                    <span style={{ color: "#a78bfa", fontSize: "0.875rem", fontWeight: 500 }}>
                        {recommendations?.total_recommendations} Recommendations
                    </span>
                </div>
            </div>

            {/* Status Summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                    { label: "New", count: recommendations?.recommendations.filter((r) => r.status === "new").length || 0, icon: AlertCircle, color: "#60a5fa", bg: "rgba(59, 130, 246, 0.1)", border: "rgba(59, 130, 246, 0.2)" },
                    { label: "In Progress", count: recommendations?.recommendations.filter((r) => r.status === "in_progress").length || 0, icon: Clock, color: "#eab308", bg: "rgba(234, 179, 8, 0.1)", border: "rgba(234, 179, 8, 0.2)" },
                    { label: "Implemented", count: 0, icon: CheckCircle, color: "#22c55e", bg: "rgba(34, 197, 94, 0.1)", border: "rgba(34, 197, 94, 0.2)" },
                ].map((stat) => (
                    <div key={stat.label} style={{ padding: 20, background: stat.bg, border: `1px solid ${stat.border}`, borderRadius: 12, display: "flex", alignItems: "center", gap: 16 }}>
                        <stat.icon style={{ width: 32, height: 32, color: stat.color }} />
                        <div>
                            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f8fafc" }}>{stat.count}</p>
                            <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recommendations List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {recommendations?.recommendations.map((rec) => {
                    const StatusIcon = statusIcons[rec.status as keyof typeof statusIcons] || AlertCircle;

                    return (
                        <Card key={rec.id}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <Badge variant={statusColors[rec.status as keyof typeof statusColors]}>
                                        <StatusIcon style={{ width: 12, height: 12 }} />
                                        {rec.status.replace("_", " ").toUpperCase()}
                                    </Badge>
                                    <Badge variant={rec.priority === "high" ? "danger" : "warning"}>
                                        {rec.priority.toUpperCase()}
                                    </Badge>
                                    <span style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>{rec.id}</span>
                                </div>
                                <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>{rec.category}</span>
                            </div>

                            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc", marginBottom: 12 }}>{rec.title}</h3>
                            <p style={{ fontSize: "0.9375rem", color: "#94a3b8", marginBottom: 24 }}>{rec.summary}</p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                                <div style={{ padding: 20, background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: 12 }}>
                                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#4ade80", marginBottom: 12 }}>Expected Impact</h4>
                                    {Object.entries(rec.expected_impact).map(([key, value]) => (
                                        <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: 6 }}>
                                            <span style={{ color: "#94a3b8", textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</span>
                                            <span style={{ color: "#f8fafc", fontWeight: 500 }}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ padding: 20, background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: 12 }}>
                                    <h4 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#60a5fa", marginBottom: 12 }}>Resources Required</h4>
                                    {Object.entries(rec.resource_requirement).map(([key, value]) => (
                                        <div key={key} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", marginBottom: 6 }}>
                                            <span style={{ color: "#94a3b8", textTransform: "capitalize" }}>{key.replace(/_/g, " ")}</span>
                                            <span style={{ color: "#f8fafc", fontWeight: 500 }}>{value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 12 }}>
                                <button style={{ padding: "10px 20px", background: "none", border: "none", color: "#94a3b8", fontSize: "0.875rem", cursor: "pointer" }}>
                                    View Details
                                </button>
                                <button className="btn-primary">
                                    Take Action
                                    <ArrowRight style={{ width: 16, height: 16 }} />
                                </button>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
