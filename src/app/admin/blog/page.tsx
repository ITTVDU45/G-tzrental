"use client";

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import Image from 'next/image';
import BlogModal from '@/components/admin/modals/BlogModal';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    date: string;
    readTime: string;
    status: string;
}

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const fetchPosts = async () => {
        try {
            const res = await fetch('/api/admin/blog');
            const data = await res.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const columns = [
        {
            header: 'Beitrag',
            accessor: (item: BlogPost) => (
                <div className="flex items-center gap-4">
                    <div className="w-16 h-10 relative bg-zinc-50 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-white line-clamp-1">{item.title}</span>
                </div>
            )
        },
        {
            header: 'Kategorie',
            accessor: (item: BlogPost) => (
                <span className="text-xs font-bold text-brand-teal bg-brand-teal/10 px-3 py-1 rounded-full uppercase tracking-widest">{item.category}</span>
            )
        },
        { header: 'Datum', accessor: 'date' as const },
        {
            header: 'Status',
            accessor: (item: BlogPost) => (
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${item.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                    }`}>
                    {item.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                </span>
            )
        },
    ];

    const handleDelete = async (item: BlogPost) => {
        if (confirm(`Beitrag "${item.title}" wirklich löschen?`)) {
            await fetch('/api/admin/blog', {
                method: 'DELETE',
                body: JSON.stringify({ id: item.id }),
            });
            fetchPosts();
        }
    };

    const handleSave = async (formData: Partial<BlogPost>) => {
        try {
            const res = await fetch('/api/admin/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchPosts();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-10 space-y-10">
            <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Blog & Ratgeber</h1>
                <p className="text-zinc-500 font-medium">Teilen Sie Fachwissen und Neuigkeiten mit Ihren Kunden.</p>
            </div>

            <DataTable
                title="Alle Beiträge"
                data={posts}
                columns={columns}
                onEdit={(item) => {
                    setSelectedPost(item);
                    setIsModalOpen(true);
                }}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedPost(null);
                    setIsModalOpen(true);
                }}
                loading={loading}
            />

            <BlogModal
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
                onSaveAction={handleSave}
                post={selectedPost}
            />
        </div>
    );
}
