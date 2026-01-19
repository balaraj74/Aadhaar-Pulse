"use client";

import { useSidebar } from "@/context/SidebarContext";

export function MainContent({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();

    const marginLeft = isCollapsed ? 80 : 260;

    return (
        <div
            style={{
                marginLeft: marginLeft,
                minHeight: "100vh",
                transition: "margin-left 0.3s ease",
            }}
        >
            {children}
        </div>
    );
}
