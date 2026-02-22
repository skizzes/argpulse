import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;

        // Fallbacks if missing
        const score = searchParams.get("score") || "48.5";
        const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
        const inflation = searchParams.get("inflation") || "2.8%";
        const reserves = searchParams.get("reserves") || "$29.5B";
        const usd = searchParams.get("usd") || "$1,180";

        return new ImageResponse(
            (
                <div
                    style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#09090b", // Dark mode default
                        color: "#fafafa",
                        fontFamily: "Inter, sans-serif",
                        padding: "80px 40px",
                        border: "12px solid #27272a",
                    }}
                >
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h1 style={{ fontSize: 48, fontWeight: "bold", color: "#a1a1aa", margin: 0 }}>
                            ARGPULSE / LIVE STATUS
                        </h1>
                        <p style={{ fontSize: 24, color: "#71717a", marginTop: 10 }}>{date}</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "40px 0" }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                            <span style={{ fontSize: 160, fontWeight: "900", color: "#22c55e", lineHeight: 1 }}>
                                {score}
                            </span>
                            <span style={{ fontSize: 40, color: "#a1a1aa" }}>/ 100</span>
                        </div>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            justifyContent: "space-around",
                            backgroundColor: "#18181b",
                            padding: "30px",
                            borderRadius: "20px",
                            border: "2px solid #27272a",
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: 24, color: "#a1a1aa" }}>Inflation</span>
                            <span style={{ fontSize: 48, fontWeight: "bold" }}>{inflation}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: 24, color: "#a1a1aa" }}>Reserves</span>
                            <span style={{ fontSize: 48, fontWeight: "bold" }}>{reserves}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <span style={{ fontSize: 24, color: "#a1a1aa" }}>USD Blue</span>
                            <span style={{ fontSize: 48, fontWeight: "bold" }}>{usd}</span>
                        </div>
                    </div>

                    <div style={{ position: "absolute", bottom: "30px", right: "40px", fontSize: 24, color: "#71717a", display: "flex", alignItems: "center" }}>
                        <div style={{ width: 12, height: 12, backgroundColor: "#22c55e", borderRadius: '50%', marginRight: 10 }}></div>
                        Live at argpulse.com
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        return new Response("Failed to generate image", { status: 500 });
    }
}
