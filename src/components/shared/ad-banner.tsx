"use client";

import { useEffect } from "react";

interface AdBannerProps {
    slot: string;
    format?: "horizontal" | "rectangle" | "auto";
    className?: string;
}

/**
 * Non-intrusive Google AdSense banner.
 * Replace ca-pub-6795274738490710 with your actual publisher ID.
 * Replace slot with the ad unit slot ID from your AdSense dashboard.
 */
export function AdBanner({ slot, format = "auto", className = "" }: AdBannerProps) {
    useEffect(() => {
        try {
            const adsbygoogle = (window as any).adsbygoogle || [];
            adsbygoogle.push({});
        } catch {
            // AdSense not loaded yet — ignore
        }
    }, []);

    const sizeStyles = format === "horizontal"
        ? { display: "block", width: "100%", height: "90px" }
        : format === "rectangle"
            ? { display: "inline-block", width: "300px", height: "250px" }
            : { display: "block" };

    return (
        <div className={`flex justify-center my-6 ${className}`}>
            <div className="relative w-full max-w-4xl">
                <ins
                    className="adsbygoogle"
                    style={sizeStyles}
                    data-ad-client="ca-pub-6795274738490710"
                    data-ad-slot={slot}
                    data-ad-format={format === "auto" ? "auto" : undefined}
                    data-full-width-responsive={format === "auto" ? "true" : undefined}
                />
                {/* Subtle label for ad transparency */}
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[8px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    Ad
                </span>
            </div>
        </div>
    );
}
