"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    RefreshCw,
    AlertTriangle,
    TrendingUp,
    Lightbulb,
    FileText,
    Map,
    Settings,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

const navItems = [
    { name: "Overview", href: "/", icon: LayoutDashboard },
    { name: "Enrolments", href: "/enrolments", icon: Users },
    { name: "Updates", href: "/updates", icon: RefreshCw },
    { name: "Anomalies", href: "/anomalies", icon: AlertTriangle },
    { name: "Forecasts", href: "/forecasts", icon: TrendingUp },
    { name: "Insights", href: "/insights", icon: Lightbulb },
    { name: "Recommendations", href: "/recommendations", icon: FileText },
    { name: "Geography", href: "/geography", icon: Map },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();

    const sidebarWidth = isCollapsed ? 80 : 260;

    return (
        <aside
            style={{
                width: sidebarWidth,
                background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
                borderRight: "1px solid #334155",
                position: "fixed",
                left: 0,
                top: 0,
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                zIndex: 50,
                transition: "width 0.3s ease",
            }}
        >
            {/* Logo */}
            <div
                style={{
                    height: 72,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    padding: isCollapsed ? "0 16px" : "0 20px",
                    borderBottom: "1px solid #334155",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #3b82f6, #f97316)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                            flexShrink: 0,
                        }}
                    >
                        <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>A</span>
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h1 style={{ fontSize: 16, fontWeight: 700, color: "#f8fafc", margin: 0, whiteSpace: "nowrap" }}>
                                Aadhaar Pulse
                            </h1>
                            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>UIDAI Analytics</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <li key={item.href} style={{ marginBottom: 4 }}>
                                <Link
                                    href={item.href}
                                    title={isCollapsed ? item.name : undefined}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: isCollapsed ? "center" : "flex-start",
                                        gap: 12,
                                        padding: isCollapsed ? "12px" : "10px 14px",
                                        borderRadius: 10,
                                        textDecoration: "none",
                                        fontSize: 14,
                                        fontWeight: 500,
                                        transition: "all 0.2s ease",
                                        background: isActive
                                            ? "linear-gradient(135deg, #3b82f6, #2563eb)"
                                            : "transparent",
                                        color: isActive ? "#ffffff" : "#94a3b8",
                                        boxShadow: isActive ? "0 4px 12px rgba(59, 130, 246, 0.25)" : "none",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = "rgba(51, 65, 85, 0.5)";
                                            e.currentTarget.style.color = "#f8fafc";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = "transparent";
                                            e.currentTarget.style.color = "#94a3b8";
                                        }
                                    }}
                                >
                                    <Icon style={{ width: 20, height: 20, flexShrink: 0 }} />
                                    {!isCollapsed && <span>{item.name}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Toggle Button */}
            <div style={{ padding: "12px", borderTop: "1px solid #334155" }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: 12,
                        padding: isCollapsed ? "12px" : "10px 14px",
                        borderRadius: 10,
                        background: "rgba(51, 65, 85, 0.3)",
                        border: "1px solid #334155",
                        color: "#94a3b8",
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(51, 65, 85, 0.6)";
                        e.currentTarget.style.color = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(51, 65, 85, 0.3)";
                        e.currentTarget.style.color = "#94a3b8";
                    }}
                >
                    {isCollapsed ? (
                        <ChevronRight style={{ width: 20, height: 20 }} />
                    ) : (
                        <>
                            <ChevronLeft style={{ width: 20, height: 20 }} />
                            <span>Collapse</span>
                        </>
                    )}
                </button>
            </div>

            {/* Settings */}
            <div style={{ padding: "0 12px 12px" }}>
                <Link
                    href="/settings"
                    title={isCollapsed ? "Settings" : undefined}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: 12,
                        padding: isCollapsed ? "12px" : "10px 14px",
                        borderRadius: 10,
                        textDecoration: "none",
                        fontSize: 14,
                        fontWeight: 500,
                        color: "#94a3b8",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(51, 65, 85, 0.5)";
                        e.currentTarget.style.color = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#94a3b8";
                    }}
                >
                    <Settings style={{ width: 20, height: 20 }} />
                    {!isCollapsed && <span>Settings</span>}
                </Link>
            </div>
        </aside>
    );
}
