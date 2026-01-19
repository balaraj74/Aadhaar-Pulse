import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
    if (num >= 10000000) {
        return (num / 10000000).toFixed(2) + " Cr";
    } else if (num >= 100000) {
        return (num / 100000).toFixed(2) + " L";
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    }
    return num.toLocaleString("en-IN");
}

export function formatPercentage(num: number): string {
    const sign = num >= 0 ? "+" : "";
    return `${sign}${num.toFixed(1)}%`;
}

export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
