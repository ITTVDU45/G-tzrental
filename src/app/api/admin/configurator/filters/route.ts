import { NextRequest, NextResponse } from "next/server";
import { COLLECTIONS, getConfigValue, seedConfiguratorFilters, setConfigValue } from "@/lib/mongo-admin";

export async function GET() {
    await seedConfiguratorFilters();
    const filters = await getConfigValue(COLLECTIONS.configuratorFilters, "filters", "items", []);
    return NextResponse.json(filters);
}

export async function POST(req: NextRequest) {
    const filters = await req.json();
    const saved = await setConfigValue(COLLECTIONS.configuratorFilters, "filters", "items", filters);
    return NextResponse.json(saved);
}
