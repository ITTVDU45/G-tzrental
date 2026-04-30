import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { COLLECTIONS, getConfigValue, listSeededCollection, seedAddons, seedConfiguratorExtras, setConfigValue } from "@/lib/mongo-admin";

export async function GET() {
    await Promise.all([seedAddons(), seedConfiguratorExtras()]);
    const ids = await getConfigValue(COLLECTIONS.configuratorExtras, "activeIds", "ids", ["ao-1", "ao-2", "ao-3"]);
    const addons = await listSeededCollection(COLLECTIONS.addons, "addons");
    const validIds = ids.filter((id: string) => addons.some((addon) => addon.id === id));
    return NextResponse.json(validIds);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { ids } = await req.json();
    const saved = await setConfigValue(COLLECTIONS.configuratorExtras, "activeIds", "ids", ids);
    return NextResponse.json(saved);
}
