
import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    if (!db.configuratorCategories) {
        // Default to first few categories if not set
        const firstCats = (db.categories || []).slice(0, 3).map((c: any) => c.id);
        db.configuratorCategories = firstCats;
        await writeDb(db);
    }

    return NextResponse.json(db.configuratorCategories || []);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { ids } = await req.json(); // List of category IDs
    const db = await readDb();

    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    db.configuratorCategories = ids;
    await writeDb(db);

    return NextResponse.json(ids);
}
