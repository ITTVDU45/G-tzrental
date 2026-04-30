import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { COLLECTIONS, deleteByBusinessId, listSeededCollection, seedCategories, upsertByBusinessId } from "@/lib/mongo-admin";

export async function GET() {
    const categories = await listSeededCollection(COLLECTIONS.categories, "categories");
    return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await seedCategories();
    const category = await req.json();
    const saved = await upsertByBusinessId(
        COLLECTIONS.categories,
        category,
        () => `cat-${Date.now()}`
    );

    return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await deleteByBusinessId(COLLECTIONS.categories, id);
    return NextResponse.json({ success: true });
}
