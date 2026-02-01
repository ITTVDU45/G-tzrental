import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    // Seed if empty
    if (!db.categories || db.categories.length === 0) {
        db.categories = [
            { id: 'cat-1', name: "Arbeitsbühnen", image: "https://images.unsplash.com/photo-1581094794329-cd132ad97c55?auto=format&fit=crop&q=80&w=600", link: "/mieten/arbeitsbuehnen", count: 12 },
            { id: 'cat-2', name: "Stapler", image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=600", link: "/mieten/stapler", count: 8 },
            { id: 'cat-3', name: "Baumaschinen", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=600", link: "/mieten/baumaschinen", count: 5 },
        ];
        await writeDb(db);
    }

    return NextResponse.json(db.categories || []);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const category = await req.json();
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    if (category.id) {
        const idx = db.categories.findIndex((c: any) => c.id === category.id);
        if (idx !== -1) db.categories[idx] = category;
        else db.categories.push(category);
    } else {
        category.id = 'cat-' + Date.now();
        db.categories.push(category);
    }

    await writeDb(db);
    return NextResponse.json(category);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    db.categories = db.categories.filter((c: any) => c.id !== id);
    await writeDb(db);
    return NextResponse.json({ success: true });
}
