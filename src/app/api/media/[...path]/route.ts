import { NextRequest } from "next/server";
import { getMediaObject, statMediaObject } from "@/lib/minio";

function decodeObjectPath(parts: string[]) {
    return parts.map((part) => decodeURIComponent(part)).join("/");
}

export async function GET(
    _req: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path } = await context.params;
        const objectPath = decodeObjectPath(path);

        const [objectStream, objectStat] = await Promise.all([
            getMediaObject(objectPath),
            statMediaObject(objectPath),
        ]);

        const headers = new Headers();
        if (objectStat.metaData?.["content-type"]) {
            headers.set("Content-Type", objectStat.metaData["content-type"]);
        } else {
            headers.set("Content-Type", "application/octet-stream");
        }

        if (typeof objectStat.size === "number") {
            headers.set("Content-Length", String(objectStat.size));
        }

        headers.set("Cache-Control", "public, max-age=31536000, immutable");

        const chunks: Buffer[] = [];
        for await (const chunk of objectStream) {
            chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }

        return new Response(Buffer.concat(chunks), {
            headers,
        });
    } catch (error) {
        console.error("Media proxy error:", error);
        return new Response("Not found", { status: 404 });
    }
}
