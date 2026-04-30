import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { getSession } from "@/lib/auth";
import { deleteMediaObject, listMediaObjects, uploadMediaObject } from "@/lib/minio";

function sanitizeFileName(fileName: string) {
    const extension = path.extname(fileName);
    const baseName = path.basename(fileName, extension);

    const safeBaseName = baseName
        .normalize("NFKD")
        .replace(/[^\w.-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

    const safeExtension = extension.replace(/[^\w.]/g, "").toLowerCase();

    return `${Date.now()}-${safeBaseName || "file"}${safeExtension}`;
}

export async function GET() {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const media = await listMediaObjects();
        return NextResponse.json(media);
    } catch (error) {
        console.error("Media list error:", error);
        return NextResponse.json({ error: "Media listing failed" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file");

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = sanitizeFileName(file.name);
        const uploaded = await uploadMediaObject(fileName, buffer, file.type);

        return NextResponse.json({
            success: true,
            url: uploaded.url,
            name: uploaded.name,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name } = await req.json();

        if (typeof name !== "string" || !name.trim()) {
            return NextResponse.json({ error: "Missing file name" }, { status: 400 });
        }

        await deleteMediaObject(name);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
