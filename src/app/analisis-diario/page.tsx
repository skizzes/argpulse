import fs from "fs";
import path from "path";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { HistoryContent } from "./content";
import { generateTodaysAnalysis } from "@/lib/daily-analysis";
import type { DailyAnalysisPost } from "@/lib/daily-analysis";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Historial de Análisis Diarios | ArgPulse",
    description: "Registro completo de los análisis económicos diarios de Argentina: dólar blue, riesgo país, MERVAL, inflación y reservas del BCRA.",
    alternates: { canonical: "https://argpulse.com/analisis-diario" },
};

export const revalidate = 600;

export default async function AnalisisDiarioPage() {
    // Read historical data via fs (reliable in production — avoids static import issues)
    let historyPosts: DailyAnalysisPost[] = [];
    try {
        const filePath = path.join(process.cwd(), "data", "analysis-history.json");
        const raw = fs.readFileSync(filePath, "utf-8");
        historyPosts = JSON.parse(raw) as DailyAnalysisPost[];
    } catch {
        historyPosts = [];
    }

    // Generate today's live analysis (with fallback if API is down)
    let todayPost: DailyAnalysisPost | null = null;
    try {
        todayPost = await generateTodaysAnalysis();
    } catch {
        todayPost = null;
    }

    // Merge: today's live data + historical (avoid duplicates by id)
    const allPosts: DailyAnalysisPost[] = todayPost
        ? [todayPost, ...historyPosts.filter((p) => p.id !== todayPost!.id)]
        : historyPosts;

    // Sort newest first
    allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <Navbar />
            <main className="flex-1 container mx-auto max-w-5xl px-4 md:px-8 py-10">
                <HistoryContent posts={allPosts} />
            </main>
            <Footer />
        </>
    );
}
