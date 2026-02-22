"use client";

import { useLanguage } from "./language-context";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    badge?: React.ReactNode;
    icon?: React.ReactNode;
}

/**
 * Standardized section header for consistent typography across all dashboard sections.
 * Standard: text-2xl font-bold tracking-tight for title, text-sm text-muted-foreground for subtitle
 */
export function SectionHeader({ title, subtitle, badge, icon }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    {icon}
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
            </div>
            {badge && <div>{badge}</div>}
        </div>
    );
}
