
import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    if (!db.addons || db.addons.length === 0) {
        db.addons = [
            { id: "ao-1", name: "Haftungsbefreiung", description: "Reduziert den Selbstbehalt im Schadensfall.", price: 15, priceType: "daily", categoryIds: [] },
            { id: "ao-2", name: "Bedienerschulung", description: "Einweisung durch zertifiziertes Personal.", price: 99, priceType: "one-time", categoryIds: [] },
            { id: "ao-3", name: "Sicherheitsgurt PSA", description: "Pflicht für Hubarbeitsbühnen.", price: 0, priceType: "one-time", categoryIds: ["cat-platforms"] },
            { id: "ao-4", name: "Extra Schlüssel", description: "Zweitschlüssel für das Mietgerät.", price: 5, priceType: "one-time", categoryIds: [] },
        ];
        await writeDb(db);
    }

    return NextResponse.json(db.addons || []);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const addon = await req.json();
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    if (!db.addons) db.addons = [];

    if (addon.id && db.addons.some((a: any) => a.id === addon.id)) {
        // Update
        const idx = db.addons.findIndex((a: any) => a.id === addon.id);
        db.addons[idx] = { ...db.addons[idx], ...addon };
    } else {
        // Create
        if (!addon.id) addon.id = `ao-${Date.now()}`;
        db.addons.push(addon);
    }

    await writeDb(db);
    return NextResponse.json(addon);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    const db = await readDb();

    if (db.addons) {
        db.addons = db.addons.filter((a: any) => a.id !== id);
        await writeDb(db);
    }

    return NextResponse.json({ success: true });
}
