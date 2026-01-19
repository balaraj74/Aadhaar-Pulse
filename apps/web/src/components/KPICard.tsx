"use client";

import { cn, formatNumber, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, RefreshCw, Building2, MapPin } from "lucide-react";

interface KPICardProps {
    title: string;
    value: number | string;
    change?: number;
    trend?: "up" | "down";
    icon?: "users" | "refresh" | "building" | "map";
    className?: string;
    delay?: number;
}

const icons = {
    users: Users,
    refresh: RefreshCw,
    building: Building2,
    map: MapPin,
};

export function KPICard({
    title,
    value,
    change,
    trend,
    icon = "users",
    className,
    delay = 0,
}: KPICardProps) {
    const Icon = icons[icon];
    const isPositive = trend === "up" || (change && change > 0);

    return (
        <div
            className={cn("kpi-card opacity-0 animate-fade-in", className)}
            style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div
                    className="p-2.5 rounded-lg"
                    style={{ background: "rgba(59, 130, 246, 0.15)" }}
                >
                    <Icon className="w-5 h-5" style={{ color: "#60a5fa" }} />
                </div>
                {change !== undefined && (
                    <div className={cn("badge", isPositive ? "badge-success" : "badge-danger")}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{formatPercentage(change)}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="mt-auto">
                <p
                    className="mb-1"
                    style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 500 }}
                >
                    {title}
                </p>
                <p
                    className="animate-count-up"
                    style={{
                        fontSize: "1.75rem",
                        fontWeight: 700,
                        color: "#f8fafc",
                        lineHeight: 1.2,
                        animationFillMode: "forwards",
                    }}
                >
                    {typeof value === "number" ? formatNumber(value) : value}
                </p>
            </div>
        </div>
    );
}
