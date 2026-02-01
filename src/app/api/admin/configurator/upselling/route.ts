
import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    if (!db.configuratorUpselling) {
        db.configuratorUpselling = []; // Default empty
        await writeDb(db);
    }

    const { products } = require('@/data/mockProducts');
    // Ensure we filter efficiently. In real DB this would be a JOIN or efficient query.
    // For now we return just ID list to keep it consistent with extras
    return NextResponse.json(db.configuratorUpselling || []);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { ids } = await req.json(); // List of product IDs
    const db = await readDb();

    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    db.configuratorUpselling = ids;
    await writeDb(db);

    return NextResponse.json(ids);
}
