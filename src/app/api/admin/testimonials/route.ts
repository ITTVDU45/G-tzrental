import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
    // Public endpoint for testimonials
    // const session = await getSession();
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await readDb();

    // Seed if empty
    if (!db.testimonials || db.testimonials.length === 0) {
        // Hardcode seeds since they are embedded in the component
        db.testimonials = [
            {
                id: 1,
                name: "Thomas Weber",
                role: "Bauleiter, Hochbau GmbH",
                image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
                text: "Die Anlieferung der Arbeitsbühnen war pünktlich auf die Minute. Die Geräte waren in top Zustand und die Einweisung durch das Personal war vorbildlich. Für uns die erste Wahl in der Region.",
                rating: "5.0 Stars",
            },
            {
                id: 2,
                name: "Sarah Müller",
                role: "Architektin",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800",
                text: "Wir brauchten kurzfristig eine Spezialbühne für Fassadenarbeiten. GoetzRental hat uns innerhalb von 2 Stunden geholfen. Dieser Service ist heutzutage nicht selbstverständlich.",
                rating: "5.0 Stars",
            },
            {
                id: 3,
                name: "Michael Klein",
                role: "Landschaftsbauer",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
                text: "Faire Preise und transparente Abrechnung. Besonders die unkomplizierte Rückgabe gefällt uns sehr gut. Wir mieten hier unsere Bagger und Radlader regelmäßig.",
                rating: "5.0 Stars",
            },
            {
                id: 4,
                name: "Andreas Meyer",
                role: "Projektleiter",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
                text: "Hervorragende Beratung bei der Auswahl der richtigen Hebebühne. Das Team ist kompetent und sehr freundlich. Absolute Empfehlung für jeden Bauherren.",
                rating: "5.0 Stars",
            }
        ];
        await writeDb(db);
    }

    return NextResponse.json(db.testimonials || []);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const testimonial = await req.json();
    const db = await readDb();

    if (testimonial.id) {
        const idx = db.testimonials.findIndex((t: any) => t.id === testimonial.id);
        if (idx !== -1) db.testimonials[idx] = testimonial;
        else db.testimonials.push(testimonial);
    } else {
        testimonial.id = Date.now();
        db.testimonials.push(testimonial);
    }

    await writeDb(db);
    return NextResponse.json(testimonial);
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await req.json();
    const db = await readDb();
    db.testimonials = db.testimonials.filter((t: any) => t.id !== id);
    await writeDb(db);
    return NextResponse.json({ success: true });
}
