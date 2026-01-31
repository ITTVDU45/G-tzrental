import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { setSession, clearSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const { username, password, action } = await req.json();

    if (action === 'logout') {
        await clearSession();
        return NextResponse.json({ success: true });
    }

    const db = await readDb();
    const user = db.users.find((u: any) => u.username === username && u.password === password);

    if (user) {
        await setSession(user.id);
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Ungültige Zugangsdaten' }, { status: 401 });
}
