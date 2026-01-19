"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line,
    ComposedChart,
} from "recharts";
import { formatNumber } from "@/lib/utils";

// Colors
const COLORS = {
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#f97316",
    success: "#22c55e",
    warning: "#eab308",
    danger: "#ef4444",
};

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#f97316", "#22c55e", "#eab308", "#ef4444", "#06b6d4"];

// Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    background: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
            >
                <p style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: "6px" }}>{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p
                        key={index}
                        style={{ color: entry.color, fontSize: "0.875rem", fontWeight: 600 }}
                    >
                        {entry.name}: {formatNumber(entry.value)}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

interface ChartProps {
    data: any[];
    className?: string;
}

// Area Chart
export function TrendAreaChart({ data, className }: ChartProps) {
    return (
        <div className={className} style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorEnrolments" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorUpdates" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                        width={45}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: 16 }}
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span style={{ color: "#94a3b8", fontSize: 12, marginLeft: 4 }}>{value}</span>}
                    />
                    <Area
                        type="monotone"
                        dataKey="enrolments"
                        name="Enrolments"
                        stroke={COLORS.primary}
                        strokeWidth={2}
                        fill="url(#colorEnrolments)"
                    />
                    <Area
                        type="monotone"
                        dataKey="updates"
                        name="Updates"
                        stroke={COLORS.accent}
                        strokeWidth={2}
                        fill="url(#colorUpdates)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

// Bar Chart
export function StateBarChart({ data, className }: ChartProps) {
    return (
        <div className={className} style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal vertical={false} />
                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                        width={80}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="enrolments" name="Enrolments" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// Pie Chart
export function DistributionPieChart({ data, className }: ChartProps) {
    return (
        <div className={className} style={{ width: "100%", height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                    >
                        {data.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span style={{ color: "#94a3b8", fontSize: 11, marginLeft: 4 }}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

// Line Chart
export function TimeSeriesLineChart({ data, className }: ChartProps) {
    return (
        <div className={className} style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        dataKey="period"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        tickFormatter={(v) => formatNumber(v)}
                        width={50}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="value"
                        name="Value"
                        stroke={COLORS.primary}
                        strokeWidth={2}
                        dot={{ fill: COLORS.primary, strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 5, fill: COLORS.primary }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// Forecast Chart
interface ForecastChartProps extends ChartProps {
    showConfidence?: boolean;
}

export function ForecastChart({ data, className }: ForecastChartProps) {
    return (
        <div className={className} style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        dataKey="period"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        tickFormatter={(v) => formatNumber(v)}
                        width={50}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="upper" stroke="none" fill="url(#confidenceGradient)" />
                    <Line
                        type="monotone"
                        dataKey="predicted"
                        name="Forecast"
                        stroke={COLORS.primary}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: COLORS.primary, strokeWidth: 2, r: 3 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

// Progress Bar
interface ProgressBarProps {
    value: number;
    max: number;
    label: string;
    color?: string;
}

export function ProgressBar({ value, max, label, color = COLORS.primary }: ProgressBarProps) {
    const percentage = Math.min((value / max) * 100, 100);

    return (
        <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{label}</span>
                <span style={{ fontSize: "0.75rem", color: "#f8fafc", fontWeight: 500 }}>{formatNumber(value)}</span>
            </div>
            <div className="progress-bar">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%`, background: color }}
                />
            </div>
        </div>
    );
}
