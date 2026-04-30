import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { COLLECTIONS, deleteByBusinessId, listSeededCollection, seedLocations, upsertByBusinessId } from "@/lib/mongo-admin";

export async function GET() {
    const locations = await listSeededCollection(COLLECTIONS.locations, "locations", []);
    return NextResponse.json(locations);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await seedLocations();
    const location = await req.json();
    const saved = await upsertByBusinessId(
        COLLECTIONS.locations,
        {
            ...location,
            lastModified: new Date().toISOString().split("T")[0],
        },
        () => `loc-${Date.now()}`
    );

    return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await deleteByBusinessId(COLLECTIONS.locations, id);
    return NextResponse.json({ success: true });
}
