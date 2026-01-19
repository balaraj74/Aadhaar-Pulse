import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { SidebarProvider } from "@/context/SidebarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aadhaar Pulse | UIDAI Analytics Dashboard",
  description: "Government-Grade Decision Support Analytics Platform for UIDAI. Unlock societal trends in Aadhaar enrolment and updates.",
  keywords: ["Aadhaar", "UIDAI", "Analytics", "Dashboard", "Government", "India"],
  authors: [{ name: "UIDAI" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SidebarProvider>
          <div style={{ minHeight: "100vh", background: "#0f172a" }}>
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Main Content Area - dynamic margin based on sidebar state */}
            <MainContent>
              <Header />
              <main style={{ padding: 32 }}>
                {children}
              </main>
            </MainContent>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
