import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { COLLECTIONS, deleteByBusinessId, listSeededCollection, upsertByBusinessId } from "@/lib/mongo-admin";
import { I_Any } from "@/lib/types";

function formatDefaultDate() {
    return new Intl.DateTimeFormat("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(new Date());
}

function slugifyBlogId(value: string) {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");
}

function toUniqueStringArray(value: I_Any) {
    if (!Array.isArray(value)) return [];

    return Array.from(
        new Set(
            value
                .map((entry) => (typeof entry === "string" ? entry.trim() : ""))
                .filter(Boolean)
        )
    );
}

function normalizeBlogPost(post: I_Any) {
    const title = typeof post?.title === "string" ? post.title.trim() : "";
    const excerpt = typeof post?.excerpt === "string" ? post.excerpt.trim() : "";
    const image = typeof post?.image === "string" ? post.image.trim() : "";
    const content = typeof post?.content === "string" ? post.content : "";
    const categories = toUniqueStringArray(post?.categories);
    const fallbackCategory = typeof post?.category === "string" && post.category.trim()
        ? post.category.trim()
        : "Ratgeber";
    const primaryCategory = categories[0] || fallbackCategory;

    return {
        ...post,
        id: typeof post?.id === "string" && post.id.trim()
            ? post.id.trim()
            : slugifyBlogId(title) || `post-${Date.now()}`,
        title,
        excerpt,
        image,
        content,
        category: primaryCategory,
        categories: categories.length > 0 ? categories : [primaryCategory],
        tags: toUniqueStringArray(post?.tags),
        pageIds: toUniqueStringArray(post?.pageIds),
        date: typeof post?.date === "string" && post.date.trim() ? post.date.trim() : formatDefaultDate(),
        readTime: typeof post?.readTime === "string" && post.readTime.trim() ? post.readTime.trim() : "5 min",
        status: post?.status === "published" ? "published" : "draft",
    };
}

export async function GET() {
    const blog = await listSeededCollection(COLLECTIONS.blog, "blog");
    return NextResponse.json(blog);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const post = normalizeBlogPost(await req.json());
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
