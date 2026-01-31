"use client";

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface Testimonial {
    id: number;
    name: string;
    role: string;
    image: string;
    text: string;
    rating: string;
}

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/admin/testimonials');
            const data = await res.json();
            setTestimonials(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const columns = [
        {
            header: 'Kunde',
            accessor: (item: Testimonial) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 relative bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden border border-zinc-100 dark:border-zinc-800">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                        <p className="font-bold text-zinc-900 dark:text-white">{item.name}</p>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{item.role}</p>
                    </div>
                </div>
            )
        },
        {
            header: 'Text',
            accessor: (item: Testimonial) => (
                <p className="max-w-md truncate text-zinc-500 italic">"{item.text}"</p>
            )
        },
        {
            header: 'Bewertung',
            accessor: (item: Testimonial) => (
                <div className="flex items-center gap-1 text-orange-400">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold text-xs">{item.rating}</span>
                </div>
            )
        },
    ];

    const handleDelete = async (item: Testimonial) => {
        if (confirm(`Testimonial von "${item.name}" wirklich löschen?`)) {
            await fetch('/api/admin/testimonials', {
                method: 'DELETE',
                body: JSON.stringify({ id: item.id }),
            });
            fetchTestimonials();
        }
    };

    return (
        <div className="p-10 space-y-10">
            <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Testimonials</h1>
                <p className="text-zinc-500 font-medium">Verwalten Sie Kundenmeinungen und Bewertungen.</p>
            </div>

            <DataTable
                title="Kundenstimmen"
                data={testimonials}
                columns={columns}
                onEdit={(item) => alert(`Bearbeiten: ${item.name}`)}
                onDelete={handleDelete}
                onAdd={() => alert('Neues Testimonial hinzufügen')}
                loading={loading}
            />
        </div>
    );
}
