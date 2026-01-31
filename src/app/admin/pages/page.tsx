"use client";

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { ExternalLink } from 'lucide-react';

interface Page {
    id: string;
    title: string;
    slug: string;
    status: string;
    lastModified: string;
}

export default function AdminPagesPage() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPages = async () => {
        try {
            const res = await fetch('/api/admin/pages');
            const data = await res.json();
            setPages(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const columns = [
        {
            header: 'Seitentitel',
            accessor: (item: Page) => (
                <div>
                    <span className="font-bold text-zinc-900 dark:text-white block">{item.title}</span>
                    <span className="text-[10px] text-zinc-400 font-mono tracking-tight">{item.slug}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (item: Page) => (
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${item.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                    }`}>
                    {item.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                </span>
            )
        },
        { header: 'Geändert am', accessor: 'lastModified' as const },
        {
            header: 'Link',
            accessor: (item: Page) => (
                <a href={item.slug} target="_blank" className="text-zinc-400 hover:text-brand-teal transition-colors">
                    <ExternalLink className="w-4 h-4" />
                </a>
            )
        }
    ];

    const handleDelete = async (item: Page) => {
        if (confirm(`Seite "${item.title}" wirklich löschen?`)) {
            await fetch('/api/admin/pages', {
                method: 'DELETE',
                body: JSON.stringify({ id: item.id }),
            });
            fetchPages();
        }
    };

    return (
        <div className="p-10 space-y-10">
            <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Seiten</h1>
                <p className="text-zinc-500 font-medium">Verwalten Sie die Hauptseiten und deren Inhalte.</p>
            </div>

            <DataTable
                title="Inhaltsstruktur"
                data={pages}
                columns={columns}
                onEdit={(item) => alert(`Bearbeiten: ${item.title}`)}
                onDelete={handleDelete}
                onAdd={() => alert('Neue Seite erstellen')}
                loading={loading}
            />
        </div>
    );
}
