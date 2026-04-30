import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { COLLECTIONS, deleteByBusinessId, listSeededCollection, seedProducts, upsertByBusinessId } from "@/lib/mongo-admin";
import { products as mockProducts } from "@/data/mockProducts";

export async function GET() {
    const products = await listSeededCollection(COLLECTIONS.products, "products", mockProducts);
    return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await seedProducts();
    const product = await req.json();
    const saved = await upsertByBusinessId(
        COLLECTIONS.products,
        product,
        () => Math.random().toString(36).slice(2, 11)
    );

    return NextResponse.json(saved);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await deleteByBusinessId(COLLECTIONS.products, id);
    return NextResponse.json({ success: true });
}
