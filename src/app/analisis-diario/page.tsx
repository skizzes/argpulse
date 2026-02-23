import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { HistoryContent } from "./content";
import { generateTodaysAnalysis } from "@/lib/daily-analysis";
import type { DailyAnalysisPost } from "@/lib/daily-analysis";
import historyData from "../../../data/analysis-history.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Historial de Análisis Diarios | ArgPulse",
    description: "Registro completo de los análisis económicos diarios de Argentina: dólar blue, riesgo país, MERVAL, inflación y reservas del BCRA.",
    alternates: { canonical: "https://argpulse.com/analisis-diario" },
};

export default async function AnalisisDiarioPage() {
    // Generate today's live analysis
    const todayPost = await generateTodaysAnalysis();

    // Merge: today's live data + historical records (avoid duplicates by id)
    const historyPosts = historyData as DailyAnalysisPost[];
    const allPosts: DailyAnalysisPost[] = [
        todayPost,
        ...historyPosts.filter((p) => p.id !== todayPost.id),
    ];

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
