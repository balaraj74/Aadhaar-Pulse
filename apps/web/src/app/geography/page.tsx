"use client";

import { useEffect, useState } from "react";
import { Card, Badge, DataTable } from "@/components/ui";
import { StateBarChart } from "@/components/Charts";
import { api, HeatmapData, GeographyStatesData } from "@/lib/api";
import { formatNumber } from "@/lib/utils";
import { Map } from "lucide-react";

export default function GeographyPage() {
    const [heatmap, setHeatmap] = useState<HeatmapData | null>(null);
    const [states, setStates] = useState<GeographyStatesData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [heatmapData, statesData] = await Promise.all([
                    api.geography.getHeatmap(),
                    api.geography.getStates(),
                ]);
                setHeatmap(heatmapData);
                setStates(statesData);
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

    const regionGroups = states?.states.reduce((acc, state) => {
        if (!acc[state.region]) acc[state.region] = [];
        acc[state.region].push(state);
        return acc;
    }, {} as Record<string, typeof states.states>) || {};

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
                        Geographic Analysis
                    </h1>
                    <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                        Regional distribution and state-wise analytics
                    </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: 12 }}>
                    <Map style={{ width: 16, height: 16, color: "#60a5fa" }} />
                    <span style={{ color: "#60a5fa", fontSize: "0.875rem", fontWeight: 500 }}>
                        {states?.states.length} States/UTs
                    </span>
                </div>
            </div>

            {/* Heatmap Grid */}
            <Card title="State-wise Enrolment Heatmap" subtitle="Enrolment volume by state">
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12 }}>
                    {heatmap?.data.map((item) => (
                        <div
                            key={item.code}
                            style={{
                                padding: 16,
                                borderRadius: 12,
                                textAlign: "center",
                                background: `rgba(59, 130, 246, ${0.1 + item.normalized * 0.4})`,
                                border: `1px solid rgba(59, 130, 246, ${0.2 + item.normalized * 0.3})`,
                                transition: "transform 0.2s ease",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                        >
                            <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>{item.code}</p>
                            <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{formatNumber(item.value)}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Region Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                {Object.entries(regionGroups).slice(0, 4).map(([region, regionStates]) => (
                    <Card key={region} title={region} subtitle={`${regionStates.length} States/UTs`}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
                            {regionStates.slice(0, 5).map((state) => (
                                <div
                                    key={state.code}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "8px 12px",
                                        background: "#1e293b",
                                        borderRadius: 8,
                                    }}
                                >
                                    <span style={{ fontSize: "0.875rem", color: "#cbd5e1" }}>{state.name}</span>
                                    <Badge variant="info">{state.code}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            {/* States Table */}
            <Card title="All States & Union Territories">
                <DataTable
                    columns={[
                        { key: "code", label: "Code", align: "center" },
                        { key: "name", label: "Name" },
                        { key: "region", label: "Region" },
                    ]}
                    data={states?.states.map((s) => ({
                        code: <Badge variant="info">{s.code}</Badge>,
                        name: s.name,
                        region: s.region,
                    })) || []}
                />
            </Card>
        </div>
    );
}
