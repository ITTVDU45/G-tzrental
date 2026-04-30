import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { Db, MongoClient } from "mongodb";

const ROOT_ENV_PATH = path.join(process.cwd(), ".env");
const SRC_ENV_PATH = path.join(process.cwd(), "src", ".env");

if (fs.existsSync(ROOT_ENV_PATH)) {
    dotenv.config({ path: ROOT_ENV_PATH });
}

if (fs.existsSync(SRC_ENV_PATH)) {
    dotenv.config({ path: SRC_ENV_PATH, override: false });
}

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("Missing required environment variable: MONGODB_URI");
}

const mongoUri: string = uri;

const dbNameFromUri = (() => {
    try {
        const parsed = new URL(uri);
        const pathname = parsed.pathname.replace(/^\//, "").trim();
        return pathname || "goetzrental";
    } catch {
        return "goetzrental";
    }
})();

type MongoCache = {
    client: MongoClient | null;
    promise: Promise<MongoClient> | null;
};

declare global {
    var __mongoCache__: MongoCache | undefined;
}

const globalCache = globalThis.__mongoCache__ || { client: null, promise: null };

if (!globalThis.__mongoCache__) {
    globalThis.__mongoCache__ = globalCache;
}

export async function getMongoClient() {
    if (globalCache.client) {
        return globalCache.client;
    }

    if (!globalCache.promise) {
        const client = new MongoClient(mongoUri);
        globalCache.promise = client.connect();
    }

    globalCache.client = await globalCache.promise;
    return globalCache.client;
}

export async function getDb(): Promise<Db> {
    const client = await getMongoClient();
    return client.db(dbNameFromUri);
}
