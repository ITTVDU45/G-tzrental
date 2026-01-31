import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await readDb();

    // Seed if empty
    if (!db.products || db.products.length === 0) {
        const { products } = require('@/data/mockProducts');
        db.products = products;
        await writeDb(db);
    }

    return NextResponse.json(db.products || []);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const product = await req.json();
    const db = await readDb();

    if (product.id) {
        // Update
        const idx = db.products.findIndex((p: any) => p.id === product.id);
        if (idx !== -1) {
            db.products[idx] = product;
        } else {
            db.products.push(product);
        }
    } else {
        // Create
        product.id = Math.random().toString(36).substr(2, 9);
        db.products.push(product);
    }

    await writeDb(db);
    return NextResponse.json(product);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    const db = await readDb();
    db.products = db.products.filter((p: any) => p.id !== id);
    await writeDb(db);
    return NextResponse.json({ success: true });
}
