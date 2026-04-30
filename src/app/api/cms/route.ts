import { NextRequest, NextResponse } from "next/server";
import { getCmsPayload } from "@/lib/mongo-admin";
import { getBlogPostPageDocument, getFrontendPageDocument, getLocationPageDocument, getProductPageDocument, getRentalCategoryPageDocument } from "@/lib/frontend-pages";
import { I_Any } from "@/lib/types";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const id = searchParams.get("id");

    if (type?.startsWith("page_")) {
        if (type.startsWith("page_location_")) {
            const locationSlug = type.replace(/^page_location_/, "");
            const doc = await getLocationPageDocument(locationSlug);
            return NextResponse.json(doc || { error: "Not found" }, { status: doc ? 200 : 404 });
        }

        if (type.startsWith("page_rental_category_")) {
            const categorySlug = type.replace(/^page_rental_category_/, "");
            const doc = await getRentalCategoryPageDocument(categorySlug);
            return NextResponse.json(doc || { error: "Not found" }, { status: doc ? 200 : 404 });
        }

        if (type.startsWith("page_product_")) {
            const productId = type.replace(/^page_product_/, "");
            const doc = await getProductPageDocument(productId);
            return NextResponse.json(doc || { error: "Not found" }, { status: doc ? 200 : 404 });
        }

        if (type.startsWith("page_blog_post_")) {
            const postId = type.replace(/^page_blog_post_/, "");
            const doc = await getBlogPostPageDocument(postId);
            return NextResponse.json(doc || { error: "Not found" }, { status: doc ? 200 : 404 });
        }

        const doc = await getFrontendPageDocument(type);
        return NextResponse.json(doc || { error: "Not found" }, { status: doc ? 200 : 404 });
    }

    const db = await getCmsPayload();

    if (type && type in db) {
        const collection = db[type as keyof typeof db];

        if (id && Array.isArray(collection)) {
            const item = collection.find((entry: I_Any) => entry.id === id || entry.slug === id);
            return NextResponse.json(item || { error: "Not found" }, { status: item ? 200 : 404 });
        }

        return NextResponse.json(collection);
    }

    return NextResponse.json(db);
}
