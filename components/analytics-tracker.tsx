"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function AnalyticsTracker() {
    const pathname = usePathname();
    const trackedPath = useRef<string | null>(null);

    useEffect(() => {
        if (!pathname) return;

        // Do not track in development/localhost environment
        if (process.env.NODE_ENV === "development") return;

        // Prevent strictly duplicate sequential tracking of the identical path
        // (strict mode fires useEffect twice)
        if (trackedPath.current === pathname) return;
        trackedPath.current = pathname;

        const trackVisit = async () => {
            try {
                await fetch("/api/track", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ path: pathname }),
                });
            } catch (error) {
                console.error("Failed to track visit:", error);
            }
        };

        trackVisit();
    }, [pathname]);

    return null;
}
