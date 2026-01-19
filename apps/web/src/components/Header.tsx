"use client";

import { Bell, Search, User, Calendar, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useSidebar } from "@/context/SidebarContext";

export function Header() {
    const [currentTime, setCurrentTime] = useState<string>("");
    const [currentDate, setCurrentDate] = useState<string>("");
    const { toggleSidebar } = useSidebar();

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(
                now.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            );
            setCurrentDate(
                now.toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                })
            );
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header
            style={{
                height: 72,
                background: "rgba(15, 23, 42, 0.85)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid #334155",
                position: "sticky",
                top: 0,
                zIndex: 40,
            }}
        >
            <div
                style={{
                    height: "100%",
                    padding: "0 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                }}
            >
                {/* Left - Mobile Menu + Search */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                    {/* Mobile menu toggle */}
                    <button
                        onClick={toggleSidebar}
                        style={{
                            display: "none", // Only show on mobile
                            padding: 8,
                            borderRadius: 8,
                            background: "transparent",
                            border: "none",
                            color: "#94a3b8",
                            cursor: "pointer",
                        }}
                    >
                        <Menu style={{ width: 20, height: 20 }} />
                    </button>

                    {/* Search */}
                    <div style={{ position: "relative", maxWidth: 320, flex: 1 }}>
                        <Search
                            style={{
                                width: 18,
                                height: 18,
                                position: "absolute",
                                left: 14,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#64748b",
                            }}
                        />
                        <input
                            type="text"
                            placeholder="Search states, districts, metrics..."
                            style={{
                                width: "100%",
                                padding: "10px 16px 10px 44px",
                                background: "#1e293b",
                                border: "1px solid #334155",
                                borderRadius: 10,
                                fontSize: 14,
                                color: "#f8fafc",
                                outline: "none",
                                transition: "all 0.2s ease",
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#3b82f6";
                                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#334155";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    {/* Date/Time */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "8px 16px",
                            background: "#1e293b",
                            borderRadius: 10,
                            border: "1px solid #334155",
                        }}
                    >
                        <Calendar style={{ width: 16, height: 16, color: "#64748b" }} />
                        <div style={{ fontSize: 13 }}>
                            <span style={{ color: "#f8fafc", fontWeight: 500 }}>{currentTime}</span>
                            <span style={{ color: "#64748b", margin: "0 8px" }}>•</span>
                            <span style={{ color: "#94a3b8" }}>{currentDate}</span>
                        </div>
                    </div>

                    {/* Notifications */}
                    <button
                        style={{
                            position: "relative",
                            padding: 10,
                            borderRadius: 10,
                            background: "#1e293b",
                            border: "1px solid #334155",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#334155";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#1e293b";
                        }}
                    >
                        <Bell style={{ width: 18, height: 18, color: "#94a3b8" }} />
                        <span
                            style={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                background: "#f97316",
                                animation: "pulse 2s infinite",
                            }}
                        />
                    </button>

                    {/* Divider */}
                    <div style={{ width: 1, height: 32, background: "#334155" }} />

                    {/* User */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: "6px 12px 6px 6px",
                            background: "#1e293b",
                            borderRadius: 12,
                            border: "1px solid #334155",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#334155";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "#1e293b";
                        }}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <User style={{ width: 18, height: 18, color: "#fff" }} />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 500, color: "#f8fafc", margin: 0 }}>Admin User</p>
                            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>UIDAI HQ</p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
