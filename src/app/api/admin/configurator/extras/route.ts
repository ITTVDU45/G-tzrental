
import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    // Seed defaults if missing
    if (!db.configuratorExtras) {
        db.configuratorExtras = ["ao-1", "ao-2", "ao-3"]; // Default active IDs
        await writeDb(db);
    }

    // Filter to ensure we only return IDs that actually exist in addons
    // (Optional data integrity check, but useful for frontend)
    const validIds = db.configuratorExtras.filter((id: string) =>
        db.addons?.some((a: any) => a.id === id)
    );

    return NextResponse.json(validIds);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { ids } = await req.json(); // Expect raw list of IDs
    const db = await readDb();

    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    db.configuratorExtras = ids;
    await writeDb(db);

    return NextResponse.json(ids);
}
