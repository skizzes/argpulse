"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Clock } from "lucide-react";
import { useLanguage } from "@/components/shared/language-context";

const MOCK_NEWS = [
    {
        source: "Bloomberg",
        title: "Argentina's Central Bank Surpasses Targets in IMF Review",
        time: "2 hours ago",
        category: "Economy",
        url: "#",
    },
    {
        source: "Reuters",
        title: "Inflation continues slow deceleration path inside Argentina",
        time: "4 hours ago",
        category: "Economy",
        url: "#",
    },
    {
        source: "La Nación",
        title: "New deregulation package sent to Congress avoiding extraordinary sessions",
        time: "5 hours ago",
        category: "Politics",
        url: "#",
    },
    {
        source: "Financial Times",
        title: "Investors eye Argentine energy sector as Vaca Muerta exports rise",
        time: "12 hours ago",
        category: "Markets",
        url: "#",
    }
];

export function NewsHub({ liveNews }: { liveNews?: any[] }) {
    const { t } = useLanguage();
    // Show live news if available, or fall back to mock news
    const newsToDisplay = liveNews && liveNews.length > 0 ? liveNews : MOCK_NEWS;

    return (
        <div className="space-y-6">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">{t.markets.intelligence}</h2>
                <p className="text-sm text-muted-foreground">{t.markets.subtitle}</p>
            </div>

            <div className="flex flex-col gap-4">
                {newsToDisplay.map((news, i) => (
                    <a key={i} href={news.url} target="_blank" rel="noopener noreferrer" className="group block">
                        <Card className="transition-all hover:bg-muted/50 border-border/50">
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">
                                                {news.category}
                                            </span>
                                            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {news.time}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-lg leading-tight group-hover:text-blue-500 transition-colors">
                                            {news.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground font-medium">
                                            {news.source}
                                        </p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                                        <ExternalLink className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </a>
                ))}
            </div>
        </div>
    );
}
