
import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function GET() {
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    if (!db.configuratorFilters) {
        // Seed default filters if not present
        db.configuratorFilters = [
            // Sliders
            {
                id: 'f-height', type: 'slider', key: 'height', label: 'Arbeitshöhe', unit: 'm',
                min: 0, max: 60, step: 1, defaultValue: 12
            },
            {
                id: 'f-reach', type: 'slider', key: 'reach', label: 'Reichweite', unit: 'm',
                min: 0, max: 30, step: 1, defaultValue: 8
            },
            {
                id: 'f-load', type: 'slider', key: 'load', label: 'Korblast', unit: 'kg',
                min: 0, max: 1000, step: 50, defaultValue: 200
            },
            // Selects
            {
                id: 'f-drive', type: 'select', key: 'drive', label: 'Antriebsart',
                options: [
                    { value: "e", label: "Elektro (Innen)" },
                    { value: "d", label: "Diesel (Außen)" },
                    { value: "h", label: "Hybrid" }
                ]
            },
            {
                id: 'f-ground', type: 'select', key: 'ground', label: 'Untergrund',
                options: [
                    { value: "flat", label: "Eben / Fest" },
                    { value: "rough", label: "Gelände / Uneben" }
                ]
            },
            {
                id: 'f-env', type: 'select', key: 'environment', label: 'Einsatzort',
                options: [
                    { value: "indoor", label: "Innen" },
                    { value: "outdoor", label: "Außen" }
                ]
            }
        ];
        await writeDb(db);
    }

    return NextResponse.json(db.configuratorFilters);
}

export async function POST(req: NextRequest) {
    const filters = await req.json();
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    db.configuratorFilters = filters;
    await writeDb(db);

    return NextResponse.json(filters);
}
