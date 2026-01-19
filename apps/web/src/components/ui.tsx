"use client";

import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import React from "react";

/* ============================================
   ALERT COMPONENT
   ============================================ */
interface AlertProps {
    type: "info" | "warning" | "success" | "error";
    title?: string;
    message: string;
    region?: string;
    className?: string;
}

const alertIcons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    error: XCircle,
};

export function Alert({ type, title, message, region, className }: AlertProps) {
    const Icon = alertIcons[type];

    return (
        <div className={cn("alert", `alert-${type}`, className)}>
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
                {title && (
                    <p style={{ fontWeight: 600, marginBottom: "4px" }}>{title}</p>
                )}
                <p style={{ fontSize: "0.875rem", opacity: 0.9 }}>{message}</p>
                {region && (
                    <p style={{ fontSize: "0.75rem", marginTop: "6px", opacity: 0.7 }}>
                        Region: {region}
                    </p>
                )}
            </div>
        </div>
    );
}

/* ============================================
   CARD COMPONENT
   ============================================ */
interface CardProps {
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    headerAction?: React.ReactNode;
}

export function Card({ title, subtitle, icon, children, className, headerAction }: CardProps) {
    return (
        <div className={cn("card", className)}>
            {(title || headerAction) && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "20px",
                        gap: "16px",
                    }}
                >
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", minWidth: 0 }}>
                        {icon && (
                            <div style={{ marginTop: "2px" }}>
                                {icon}
                            </div>
                        )}
                        <div>
                            {title && (
                                <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#f8fafc", marginBottom: "4px" }}>
                                    {title}
                                </h3>
                            )}
                            {subtitle && (
                                <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>{subtitle}</p>
                            )}
                        </div>
                    </div>
                    {headerAction}
                </div>
            )}
            {children}
        </div>
    );
}

/* ============================================
   BADGE COMPONENT
   ============================================ */
interface BadgeProps {
    variant: "success" | "warning" | "danger" | "info";
    children: React.ReactNode;
    className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
    return (
        <span className={cn("badge", `badge-${variant}`, className)}>{children}</span>
    );
}

/* ============================================
   SKELETON LOADER
   ============================================ */
interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
    return <div className={cn("skeleton", className)} />;
}

/* ============================================
   DATA TABLE
   ============================================ */
interface DataTableProps {
    columns: { key: string; label: string; align?: "left" | "center" | "right" }[];
    data: Record<string, React.ReactNode>[];
    className?: string;
}

export function DataTable({ columns, data, className }: DataTableProps) {
    return (
        <div style={{ overflowX: "auto" }} className={className}>
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                style={{
                                    textAlign: col.align || "left",
                                }}
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i}>
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    style={{
                                        textAlign: col.align || "left",
                                    }}
                                >
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ============================================
   TABS COMPONENT
   ============================================ */
interface TabsProps {
    tabs: { id: string; label: string }[];
    activeTab: string;
    onChange: (id: string) => void;
    className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
    return (
        <div style={{ display: "flex", gap: "8px" }} className={className}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={activeTab === tab.id ? "tab-active" : "tab-inactive"}
                    style={{
                        padding: "8px 16px",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        border: "none",
                        transition: "all 0.2s ease",
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

/* ============================================
   STAT MINI COMPONENT
   ============================================ */
interface StatMiniProps {
    label: string;
    value: string | number;
    trend?: "up" | "down";
    trendValue?: string;
}

export function StatMini({ label, value, trend, trendValue }: StatMiniProps) {
    return (
        <div className="stat-mini">
            <div>
                <p className="stat-mini-label">{label}</p>
                <p className="stat-mini-value">{value}</p>
            </div>
            {trend && trendValue && (
                <div className={cn("stat-mini-trend", trend)}>
                    {trend === "up" ? "↑" : "↓"} {trendValue}
                </div>
            )}
        </div>
    );
}

/* ============================================
   EMPTY STATE COMPONENT
   ============================================ */
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "48px 24px",
                textAlign: "center",
            }}
        >
            {icon && <div style={{ color: "#64748b", marginBottom: "16px" }}>{icon}</div>}
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#f8fafc", marginBottom: "8px" }}>
                {title}
            </h3>
            {description && (
                <p style={{ fontSize: "0.875rem", color: "#94a3b8", maxWidth: "320px", marginBottom: "16px" }}>
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
