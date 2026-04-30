import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { COLLECTIONS, deleteByBusinessId, listSeededCollection, seedTestimonials, upsertByBusinessId } from "@/lib/mongo-admin";

export async function GET() {
    const testimonials = await listSeededCollection(COLLECTIONS.testimonials, "testimonials");
    return NextResponse.json(testimonials);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await seedTestimonials();
    const testimonial = await req.json();
    const saved = await upsertByBusinessId(
        COLLECTIONS.testimonials,
        testimonial,
        () => Date.now()
    );

    return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await deleteByBusinessId(COLLECTIONS.testimonials, id);
    return NextResponse.json({ success: true });
}
