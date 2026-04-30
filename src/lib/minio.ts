import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Client } from "minio";
import type { BucketItemStat } from "minio";

const ROOT_ENV_PATH = path.join(process.cwd(), ".env");
const SRC_ENV_PATH = path.join(process.cwd(), "src", ".env");

if (fs.existsSync(ROOT_ENV_PATH)) {
    dotenv.config({ path: ROOT_ENV_PATH });
}

if (fs.existsSync(SRC_ENV_PATH)) {
    dotenv.config({ path: SRC_ENV_PATH, override: false });
}

type MediaObject = {
    name: string;
    url: string;
    size: number;
    type: string;
};

const allowedExtensions = new Set(["png", "jpg", "jpeg", "webp", "gif", "svg", "pdf"]);

function getRequiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

function encodeObjectPath(objectName: string): string {
    return objectName
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");
}

const bucket = getRequiredEnv("MINIO_BUCKET");
const region = process.env.MINIO_REGION || "us-east-1";

const minioClient = new Client({
    endPoint: getRequiredEnv("MINIO_ENDPOINT"),
    port: Number(process.env.MINIO_PORT || "443"),
    useSSL: process.env.MINIO_USE_SSL !== "false",
    accessKey: getRequiredEnv("MINIO_ACCESS_KEY"),
    secretKey: getRequiredEnv("MINIO_SECRET_KEY"),
    pathStyle: process.env.MINIO_PATH_STYLE === "true",
    region,
});

let bucketReadyPromise: Promise<void> | null = null;

async function ensureBucketReady() {
    if (!bucketReadyPromise) {
        bucketReadyPromise = (async () => {
            const exists = await minioClient.bucketExists(bucket);
            if (!exists) {
                await minioClient.makeBucket(bucket, region);
            }
        })();
    }

    return bucketReadyPromise;
}

function buildObjectUrl(objectName: string): string {
    return `/api/media/${encodeObjectPath(objectName)}`;
}

export async function listMediaObjects(): Promise<MediaObject[]> {
    await ensureBucketReady();

    const objects = await new Promise<MediaObject[]>((resolve, reject) => {
        const items: MediaObject[] = [];
        const stream = minioClient.listObjectsV2(bucket, "", true);

        stream.on("data", (obj) => {
            if (!obj.name) return;

            const type = path.extname(obj.name).slice(1).toLowerCase();
            if (!allowedExtensions.has(type)) return;

            items.push({
                name: obj.name,
                url: buildObjectUrl(obj.name),
                size: obj.size || 0,
                type,
            });
        });

        stream.on("error", reject);
        stream.on("end", () => resolve(items.sort((a, b) => b.name.localeCompare(a.name))));
    });

    return objects;
}

export async function uploadMediaObject(fileName: string, buffer: Buffer, contentType?: string) {
    await ensureBucketReady();

    await minioClient.putObject(bucket, fileName, buffer, buffer.byteLength, {
        "Content-Type": contentType || "application/octet-stream",
    });

    return {
        name: fileName,
        url: buildObjectUrl(fileName),
    };
}

export async function deleteMediaObject(fileName: string) {
    await ensureBucketReady();
    await minioClient.removeObject(bucket, fileName);
}

export async function getMediaObject(fileName: string) {
    await ensureBucketReady();
    return minioClient.getObject(bucket, fileName);
}

export async function statMediaObject(fileName: string): Promise<BucketItemStat> {
    await ensureBucketReady();
    return minioClient.statObject(bucket, fileName);
}
