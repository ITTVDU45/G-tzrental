import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { COLLECTIONS, getConfigValue, seedConfiguratorUpselling, seedProducts, setConfigValue } from "@/lib/mongo-admin";

export async function GET() {
    await Promise.all([seedProducts(), seedConfiguratorUpselling()]);
    const ids = await getConfigValue(COLLECTIONS.configuratorUpselling, "activeIds", "ids", []);
    return NextResponse.json(ids);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { ids } = await req.json();
    const saved = await setConfigValue(COLLECTIONS.configuratorUpselling, "activeIds", "ids", ids);
    return NextResponse.json(saved);
}
