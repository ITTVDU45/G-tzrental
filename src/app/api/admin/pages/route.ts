import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { COLLECTIONS, deleteByBusinessId, listSeededCollection, seedPages, upsertByBusinessId } from "@/lib/mongo-admin";

export async function GET() {
    const pages = await listSeededCollection(COLLECTIONS.pages, "pages");
    return NextResponse.json(pages);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await seedPages();
    const page = await req.json();
    const saved = await upsertByBusinessId(
        COLLECTIONS.pages,
        page,
        () => `page-${Date.now()}`
    );

    return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await deleteByBusinessId(COLLECTIONS.pages, id);
    return NextResponse.json({ success: true });
}
