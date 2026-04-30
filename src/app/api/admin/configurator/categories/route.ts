import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { COLLECTIONS, getConfigValue, seedCategories, seedConfiguratorCategories, setConfigValue } from "@/lib/mongo-admin";

export async function GET() {
    await Promise.all([seedCategories(), seedConfiguratorCategories()]);
    const ids = await getConfigValue(COLLECTIONS.configuratorCategories, "activeIds", "ids", []);
    return NextResponse.json(ids);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { ids } = await req.json();
    const saved = await setConfigValue(COLLECTIONS.configuratorCategories, "activeIds", "ids", ids);
    return NextResponse.json(saved);
}
