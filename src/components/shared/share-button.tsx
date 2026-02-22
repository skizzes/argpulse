"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "./language-context";

interface SharePulseButtonProps {
    score: number;
}

export function SharePulseButton({ score }: SharePulseButtonProps) {
    const { t } = useLanguage();
    const handleShare = () => {
        const text = `Argentina's economic condition is currently rated at ${score}/100 🇦🇷\n\nTrack inflation, reserves, and the Dólar Blue live on ARGPULSE.`;
        const url = "https://argpulse.com";

        // Construct intent URL
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

        window.open(twitterUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <Button onClick={handleShare} className="gap-2 font-semibold">
            <Share2 className="h-4 w-4" />
            {t.common.share} Pulse on X
        </Button>
    );
}
