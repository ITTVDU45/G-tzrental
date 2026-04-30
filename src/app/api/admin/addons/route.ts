import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { COLLECTIONS, deleteByBusinessId, listSeededCollection, seedAddons, upsertByBusinessId } from "@/lib/mongo-admin";

export async function GET() {
    const addons = await listSeededCollection(COLLECTIONS.addons, "addons");
    return NextResponse.json(addons);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await seedAddons();
    const addon = await req.json();
    const saved = await upsertByBusinessId(
        COLLECTIONS.addons,
        addon,
        () => `ao-${Date.now()}`
    );

    return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await deleteByBusinessId(COLLECTIONS.addons, id);
    return NextResponse.json({ success: true });
}
