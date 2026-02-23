import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "poll-data.json");

const DEFAULT_COUNTS: Record<string, number> = {
    down: 12,
    stable: 38,
    up_mild: 35,
    up_strong: 15,
};

async function readCounts(): Promise<Record<string, number>> {
    try {
        const raw = await fs.readFile(DATA_FILE, "utf-8");
        return JSON.parse(raw);
    } catch {
        return { ...DEFAULT_COUNTS };
    }
}

async function writeCounts(counts: Record<string, number>): Promise<void> {
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(counts, null, 2), "utf-8");
}

// GET /api/poll — returns current vote counts
export async function GET() {
    const counts = await readCounts();
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return NextResponse.json({ counts, total });
}

// POST /api/poll — body: { optionId: string }
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { optionId } = body as { optionId: string };

        const validOptions = ["down", "stable", "up_mild", "up_strong"];
        if (!optionId || !validOptions.includes(optionId)) {
            return NextResponse.json({ error: "Invalid option" }, { status: 400 });
        }

        const counts = await readCounts();
        counts[optionId] = (counts[optionId] || 0) + 1;
        await writeCounts(counts);

        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        return NextResponse.json({ counts, total });
    } catch (err) {
        console.error("Poll POST error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
