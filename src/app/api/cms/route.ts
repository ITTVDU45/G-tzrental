import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    const db = await readDb();

    if (type && db[type]) {
        if (id) {
            const item = db[type].find((i: any) => i.id === id || i.slug === id);
            return NextResponse.json(item || { error: 'Not found' }, { status: item ? 200 : 404 });
        }
        return NextResponse.json(db[type]);
    }

    return NextResponse.json(db);
}
