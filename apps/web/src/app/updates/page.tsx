"use client";

import { useEffect, useState } from "react";
import { Card, Badge, DataTable } from "@/components/ui";
import { DistributionPieChart, TimeSeriesLineChart, ProgressBar } from "@/components/Charts";
import { KPICard } from "@/components/KPICard";
import { api, UpdateTypesData, UpdatePatternsData } from "@/lib/api";
import { AlertTriangle } from "lucide-react";

export default function UpdatesPage() {
    const [updateTypes, setUpdateTypes] = useState<UpdateTypesData | null>(null);
    const [patterns, setPatterns] = useState<UpdatePatternsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [typesData, patternsData] = await Promise.all([
                    api.updates.getTypes(),
                    api.updates.getPatterns(),
                ]);
                setUpdateTypes(typesData);
                setPatterns(patternsData);
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

    const typeData = updateTypes?.update_types.map((t) => ({ name: t.type, value: t.percentage })) || [];
    const seasonalData = patterns?.seasonal_patterns.map((s) => ({ period: s.month, value: s.index * 100 })) || [];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div>
                <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
                    Update Behaviour Analysis
                </h1>
                <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                    Analyze update patterns, types, and fatigue indicators
                </p>
            </div>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                <KPICard title="Total Updates" value={89500000} change={18.3} trend="up" icon="refresh" delay={0} />
                <KPICard title="Daily Average" value={78000} change={3.8} trend="up" icon="users" delay={100} />
                <KPICard title="Fatigue Index" value="0.72" icon="building" delay={200} />
                <KPICard title="Most Common" value="Address" icon="map" delay={300} />
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                <Card title="Update Type Distribution" subtitle="Breakdown by update category">
                    <DistributionPieChart data={typeData} />
                    <div style={{ marginTop: 20 }}>
                        {updateTypes?.update_types.slice(0, 5).map((t) => (
                            <ProgressBar key={t.type} label={t.type} value={t.count} max={35000000} />
                        ))}
                    </div>
                </Card>

                <Card title="Seasonal Patterns" subtitle="Update activity index by month">
                    <TimeSeriesLineChart data={seasonalData} />
                    <div style={{ marginTop: 16, display: "flex", gap: 24, fontSize: "0.75rem", color: "#94a3b8" }}>
                        <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#3b82f6", marginRight: 8 }} />Peak: Oct-Dec</span>
                        <span><span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "#f97316", marginRight: 8 }} />Low: Jun-Aug</span>
                    </div>
                </Card>
            </div>

            {/* Repeat Updates */}
            <Card title="Repeat Update Analysis" subtitle="Residents with multiple updates">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                    {[
                        { pct: "58.1%", label: "Single Update", count: "52M residents", color: "#3b82f6" },
                        { pct: "26.8%", label: "Two Updates", count: "24M residents", color: "#8b5cf6" },
                        { pct: "15.1%", label: "Three+ Updates", count: "13.5M residents", color: "#f97316" },
                    ].map((item) => (
                        <div key={item.label} style={{ padding: 24, background: "#1e293b", borderRadius: 12, textAlign: "center" }}>
                            <p style={{ fontSize: "2rem", fontWeight: 700, color: item.color, marginBottom: 8 }}>{item.pct}</p>
                            <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginBottom: 4 }}>{item.label}</p>
                            <p style={{ fontSize: "0.75rem", color: "#64748b" }}>{item.count}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Fatigue Index */}
            <Card
                title="Update Fatigue Index"
                subtitle="Districts with high update backlogs"
                headerAction={<Badge variant="warning"><AlertTriangle style={{ width: 12, height: 12 }} /> Increasing Trend</Badge>}
            >
                <DataTable
                    columns={[
                        { key: "rank", label: "#", align: "center" },
                        { key: "district", label: "District" },
                        { key: "state", label: "State" },
                        { key: "score", label: "Fatigue Score", align: "right" },
                        { key: "status", label: "Status", align: "center" },
                    ]}
                    data={patterns?.update_fatigue_index.high_fatigue_districts.map((d, i) => ({
                        rank: i + 1,
                        district: d.district,
                        state: d.state,
                        score: d.score.toFixed(2),
                        status: <Badge variant={d.score > 0.85 ? "danger" : "warning"}>{d.score > 0.85 ? "Critical" : "High"}</Badge>,
                    })) || []}
                />
            </Card>
        </div>
    );
}
