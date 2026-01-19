"use client";

import { useEffect, useState } from "react";
import { Card, Badge, Tabs, DataTable, StatMini } from "@/components/ui";
import { TimeSeriesLineChart, StateBarChart, DistributionPieChart } from "@/components/Charts";
import { KPICard } from "@/components/KPICard";
import { api, StatesData, DemographicsData, TimeSeriesData } from "@/lib/api";
import { formatNumber } from "@/lib/utils";

export default function EnrolmentsPage() {
    const [activeTab, setActiveTab] = useState("overview");
    const [states, setStates] = useState<StatesData | null>(null);
    const [demographics, setDemographics] = useState<DemographicsData | null>(null);
    const [timeSeries, setTimeSeries] = useState<TimeSeriesData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [statesData, demoData, tsData] = await Promise.all([
                    api.enrolments.getStates(),
                    api.enrolments.getDemographics(),
                    api.enrolments.getTimeSeries(),
                ]);
                setStates(statesData);
                setDemographics(demoData);
                setTimeSeries(tsData);
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

    const ageData = demographics?.age_distribution.map((d) => ({
        name: d.age_group,
        value: d.percentage,
    })) || [];

    const statesChartData = states?.states.slice(0, 6).map((s) => ({
        name: s.name,
        enrolments: s.enrolments,
    })) || [];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                    <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
                        Enrolment Analytics
                    </h1>
                    <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
                        Comprehensive analysis of Aadhaar enrolment data across India
                    </p>
                </div>
                <Tabs
                    tabs={[
                        { id: "overview", label: "Overview" },
                        { id: "timeseries", label: "Time Series" },
                        { id: "demographics", label: "Demographics" },
                    ]}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                />
            </div>

            {/* KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
                <KPICard title="Total Enrolments" value={145000000} change={12.5} trend="up" icon="users" delay={0} />
                <KPICard title="Daily Average" value={125000} change={5.2} trend="up" icon="refresh" delay={100} />
                <KPICard title="Peak Day Volume" value={186430} icon="building" delay={200} />
                <KPICard title="Active States" value={36} icon="map" delay={300} />
            </div>

            {activeTab === "overview" && (
                <>
                    {/* Charts */}
                    <Card title="Enrolment Trends" subtitle="Monthly enrolment volume over time">
                        <TimeSeriesLineChart data={timeSeries?.series || []} />
                    </Card>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                        <Card title="Top States by Enrolments">
                            <StateBarChart data={statesChartData} />
                        </Card>
                        <Card title="State Performance">
                            <DataTable
                                columns={[
                                    { key: "rank", label: "#", align: "center" },
                                    { key: "state", label: "State" },
                                    { key: "enrolments", label: "Enrolments", align: "right" },
                                    { key: "growth", label: "Growth", align: "right" },
                                ]}
                                data={states?.states.slice(0, 5).map((s, i) => ({
                                    rank: i + 1,
                                    state: s.name,
                                    enrolments: formatNumber(s.enrolments),
                                    growth: <span style={{ color: "#22c55e" }}>+{s.growth}%</span>,
                                })) || []}
                            />
                        </Card>
                    </div>
                </>
            )}

            {activeTab === "timeseries" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <Card title="Monthly Enrolment Volume" subtitle="12-month trend analysis">
                        <TimeSeriesLineChart data={timeSeries?.series || []} />
                    </Card>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                        <StatMini label="Highest Month" value="Dec 2024" />
                        <StatMini label="Lowest Month" value="Jul 2024" />
                        <StatMini label="Average Monthly" value="12.8M" />
                        <StatMini label="Growth Rate" value="+12.5%" trend="up" trendValue="YoY" />
                    </div>
                </div>
            )}

            {activeTab === "demographics" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                    <Card title="Age Distribution">
                        <DistributionPieChart data={ageData} />
                    </Card>
                    <Card title="Gender Distribution">
                        <DistributionPieChart data={demographics?.gender_distribution.map((d) => ({ name: d.gender, value: d.percentage })) || []} />
                    </Card>
                    <Card title="Location Distribution">
                        <DistributionPieChart data={demographics?.location_distribution.map((d) => ({ name: d.location, value: d.percentage })) || []} />
                    </Card>
                </div>
            )}
        </div>
    );
}
