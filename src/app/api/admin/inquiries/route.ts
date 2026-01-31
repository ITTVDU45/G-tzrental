import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await readDb();

    // Seed if empty
    if (!db.inquiries || db.inquiries.length === 0) {
        db.inquiries = [
            {
                id: 'inq-1',
                customerName: 'Max Mustermann',
                customerEmail: 'max@example.com',
                productName: 'MB 80-E',
                rentalStart: '2024-02-15',
                rentalEnd: '2024-02-20',
                status: 'pending',
                date: '2024-01-31'
            },
            {
                id: 'inq-2',
                customerName: 'Bau GmbH Köln',
                customerEmail: 'info@bau-koeln.de',
                productName: 'Teleskopbühne T 160',
                rentalStart: '2024-03-01',
                rentalEnd: '2024-03-05',
                status: 'confirmed',
                date: '2024-01-30'
            }
        ];
        await writeDb(db);
    }

    return NextResponse.json(db.inquiries || []);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const inquiry = await req.json();
    const db = await readDb();

    if (inquiry.id) {
        const idx = db.inquiries.findIndex((i: any) => i.id === inquiry.id);
        if (idx !== -1) db.inquiries[idx] = inquiry;
        else db.inquiries.push(inquiry);
    } else {
        inquiry.id = 'inq-' + Date.now();
        db.inquiries.push(inquiry);
    }

    await writeDb(db);
    return NextResponse.json(inquiry);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    const db = await readDb();
    db.inquiries = db.inquiries.filter((i: any) => i.id !== id);
    await writeDb(db);
    return NextResponse.json({ success: true });
}
