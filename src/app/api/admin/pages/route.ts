import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await readDb();

    // Seed if empty
    if (!db.pages || db.pages.length === 0) {
        db.pages = [
            { id: 'page-1', title: 'Startseite', slug: '/', status: 'published', lastModified: '2024-01-30' },
            { id: 'page-2', title: 'Mietpark', slug: '/mieten', status: 'published', lastModified: '2024-01-28' },
            { id: 'page-3', title: 'Unternehmen', slug: '/unternehmen/ueber-uns', status: 'published', lastModified: '2024-01-25' },
            { id: 'page-4', title: 'Kontakt', slug: '/kontakt', status: 'published', lastModified: '2024-01-20' },
        ];
        await writeDb(db);
    }

    return NextResponse.json(db.pages || []);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const page = await req.json();
    const db = await readDb();

    if (page.id) {
        const idx = db.pages.findIndex((p: any) => p.id === page.id);
        if (idx !== -1) db.pages[idx] = page;
        else db.pages.push(page);
    } else {
        page.id = 'page-' + Date.now();
        db.pages.push(page);
    }

    await writeDb(db);
    return NextResponse.json(page);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    const db = await readDb();
    db.pages = db.pages.filter((p: any) => p.id !== id);
    await writeDb(db);
    return NextResponse.json({ success: true });
}
