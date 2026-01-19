"use client";

import { useEffect, useState } from "react";
import { KPICard } from "@/components/KPICard";
import { TrendAreaChart, StateBarChart, DistributionPieChart } from "@/components/Charts";
import { Card, Alert, Badge, DataTable, StatMini } from "@/components/ui";
import { AISummaryCard } from "@/components/AISummaryCard";
import { api, OverviewData, StatesData } from "@/lib/api";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { TrendingUp, AlertCircle, ArrowRight, Activity, Users } from "lucide-react";

export default function DashboardPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [states, setStates] = useState<StatesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [overviewData, statesData] = await Promise.all([
          api.overview.get(),
          api.enrolments.getStates(),
        ]);
        setOverview(overviewData);
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 140, borderRadius: 16 }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 350, borderRadius: 16 }} />
      </div>
    );
  }

  if (!overview) return null;

  // Chart Data
  const trendData = [
    { month: "Jan", enrolments: 12500000, updates: 7500000 },
    { month: "Feb", enrolments: 11800000, updates: 6800000 },
    { month: "Mar", enrolments: 13200000, updates: 8200000 },
    { month: "Apr", enrolments: 12900000, updates: 8900000 },
    { month: "May", enrolments: 13600000, updates: 8600000 },
    { month: "Jun", enrolments: 12100000, updates: 7100000 },
    { month: "Jul", enrolments: 11400000, updates: 6400000 },
    { month: "Aug", enrolments: 12700000, updates: 7700000 },
    { month: "Sep", enrolments: 13400000, updates: 8400000 },
    { month: "Oct", enrolments: 14100000, updates: 9100000 },
    { month: "Nov", enrolments: 13800000, updates: 8800000 },
    { month: "Dec", enrolments: 14500000, updates: 9300000 },
  ];

  const statesChartData = states?.states.slice(0, 7).map((s) => ({
    name: s.name,
    enrolments: s.enrolments,
  })) || [];

  const genderDistribution = [
    { name: "Male", value: overview.distribution.gender_split.male },
    { name: "Female", value: overview.distribution.gender_split.female },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Page Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: 700, color: "#f8fafc", marginBottom: 8 }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>
            Real-time insights into Aadhaar enrolment and update trends across India
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 16px",
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: 12,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
          <span style={{ color: "#22c55e", fontSize: "0.875rem", fontWeight: 500 }}>Live Data</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        <KPICard
          title="Total Enrolments"
          value={overview.summary.total_enrolments}
          change={overview.trends.enrolment_growth_yoy}
          trend="up"
          icon="users"
          delay={0}
        />
        <KPICard
          title="Total Updates"
          value={overview.summary.total_updates}
          change={overview.trends.update_growth_yoy}
          trend="up"
          icon="refresh"
          delay={100}
        />
        <KPICard
          title="Active Centres"
          value={overview.summary.active_centres}
          change={2.1}
          trend="up"
          icon="building"
          delay={200}
        />
        <KPICard
          title="States/UTs Covered"
          value={overview.summary.states_covered}
          icon="map"
          delay={300}
        />
      </div>

      {/* Alerts */}
      {overview.alerts.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
          {overview.alerts.map((alert, i) => (
            <Alert
              key={i}
              type={alert.type as "info" | "warning"}
              message={alert.message}
              region={alert.region}
            />
          ))}
        </div>
      )}

      {/* AI Summary */}
      <AISummaryCard />

      {/* Charts Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <Card title="Enrolment & Update Trends" subtitle="Monthly activity over the past year">
          <TrendAreaChart data={trendData} />
        </Card>

        <Card title="Daily Metrics" subtitle="Today's performance">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <StatMini
              label="Daily Enrolments"
              value={formatNumber(overview.trends.daily_average_enrolments)}
              trend="up"
              trendValue="5.2%"
            />
            <StatMini
              label="Daily Updates"
              value={formatNumber(overview.trends.daily_average_updates)}
              trend="up"
              trendValue="3.8%"
            />
            <StatMini
              label="Processing Time"
              value="4.2 mins"
              trend="down"
              trendValue="8.5%"
            />
            <StatMini
              label="Success Rate"
              value="99.2%"
              trend="up"
              trendValue="0.3%"
            />
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <Card title="Top Performing States" subtitle="By total enrolments">
          <StateBarChart data={statesChartData} />
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <Card title="Urban vs Rural" subtitle="Enrolment distribution">
            <div style={{ display: "flex", justifyContent: "center", gap: 40, padding: "16px 0" }}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "#fff" }}>
                    {overview.distribution.urban_rural_ratio.urban}%
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Urban</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f97316, #ea580c)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: "1.125rem", fontWeight: 700, color: "#fff" }}>
                    {overview.distribution.urban_rural_ratio.rural}%
                  </span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Rural</p>
              </div>
            </div>
          </Card>

          <Card title="Gender Distribution">
            <DistributionPieChart data={genderDistribution} />
          </Card>
        </div>
      </div>

      {/* Data Table */}
      <Card
        title="State Performance Summary"
        subtitle="Detailed breakdown of top performing states"
        headerAction={
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#60a5fa",
              fontSize: "0.875rem",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            View All <ArrowRight style={{ width: 16, height: 16 }} />
          </button>
        }
      >
        <DataTable
          columns={[
            { key: "rank", label: "#", align: "center" },
            { key: "state", label: "State" },
            { key: "enrolments", label: "Enrolments", align: "right" },
            { key: "growth", label: "YoY Growth", align: "right" },
            { key: "status", label: "Status", align: "center" },
          ]}
          data={overview.top_performing_states.map((state, i) => ({
            rank: i + 1,
            state: state.state,
            enrolments: formatNumber(state.enrolments),
            growth: <span style={{ color: "#22c55e" }}>{formatPercentage(state.growth)}</span>,
            status: <Badge variant="success">Active</Badge>,
          }))}
        />
      </Card>

      {/* Footer Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <div className="card-glass" style={{ padding: 24, textAlign: "center" }}>
          <Activity style={{ width: 28, height: 28, color: "#60a5fa", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>99.9%</p>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>System Uptime</p>
        </div>
        <div className="card-glass" style={{ padding: 24, textAlign: "center" }}>
          <TrendingUp style={{ width: 28, height: 28, color: "#22c55e", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>+15.4%</p>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>This Month</p>
        </div>
        <div className="card-glass" style={{ padding: 24, textAlign: "center" }}>
          <Users style={{ width: 28, height: 28, color: "#a855f7", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>1.4 Bn</p>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Total Aadhaar</p>
        </div>
        <div className="card-glass" style={{ padding: 24, textAlign: "center" }}>
          <AlertCircle style={{ width: 28, height: 28, color: "#f97316", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#f8fafc", marginBottom: 4 }}>47</p>
          <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Active Alerts</p>
        </div>
      </div>
    </div>
  );
}
