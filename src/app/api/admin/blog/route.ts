import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { COLLECTIONS, deleteByBusinessId, listSeededCollection, seedBlog, upsertByBusinessId } from "@/lib/mongo-admin";

export async function GET() {
    const blog = await listSeededCollection(COLLECTIONS.blog, "blog");
    return NextResponse.json(blog);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await seedBlog();
    const post = await req.json();
    const saved = await upsertByBusinessId(
        COLLECTIONS.blog,
        post,
        () => `post-${Date.now()}`
    );

    return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await deleteByBusinessId(COLLECTIONS.blog, id);
    return NextResponse.json({ success: true });
}
