import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    // Seed if empty
    if (!db.blog || db.blog.length === 0) {
        db.blog = [
            {
                id: "arbeitssicherheit-2024",
                title: "Arbeitssicherheit auf Baustellen: Die wichtigsten Regeln 2024",
                excerpt: "Erfahren Sie, welche Sicherheitsvorschriften beim Einsatz von Arbeitsbühnen unbedingt beachtet werden müssen.",
                image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=800",
                category: "Sicherheit",
                date: "15. Januar 2024",
                readTime: "5 min",
                status: "published"
            },
            {
                id: "richtige-arbeitsbuehne",
                title: "Die richtige Arbeitsbühne für Ihr Projekt wählen",
                excerpt: "Schere, Teleskop oder Gelenkbühne? Wir zeigen Ihnen, welche Bühne für welchen Einsatz am besten geeignet ist.",
                image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&q=80&w=800",
                category: "Ratgeber",
                date: "10. Januar 2024",
                readTime: "7 min",
                status: "published"
            }
        ];
        await writeDb(db);
    }

    return NextResponse.json(db.blog || []);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const post = await req.json();
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    if (post.id) {
        const idx = db.blog.findIndex((p: any) => p.id === post.id);
        if (idx !== -1) db.blog[idx] = post;
        else db.blog.push(post);
    } else {
        post.id = 'post-' + Date.now();
        db.blog.push(post);
    }

    await writeDb(db);
    return NextResponse.json(post);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    const db = await readDb();
    if (!db) return NextResponse.json({ error: 'Database error' }, { status: 500 });

    db.blog = db.blog.filter((p: any) => p.id !== id);
    await writeDb(db);
    return NextResponse.json({ success: true });
}
