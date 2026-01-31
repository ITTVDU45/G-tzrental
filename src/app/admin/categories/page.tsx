"use client";

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import Image from 'next/image';

import CategoryModal from '@/components/admin/modals/CategoryModal';

interface Category {
    id: string;
    name: string;
    image: string;
    link: string;
    count: number;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (formData: Partial<Category>) => {
        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchCategories();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const columns = [
        {
            header: 'Kategorie',
            accessor: (item: Category) => (
                <div className="flex items-center gap-4">
                    <div className="w-16 h-10 relative bg-zinc-50 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-white">{item.name}</span>
                </div>
            )
        },
        { header: 'Link', accessor: 'link' as const },
        {
            header: 'Produkte',
            accessor: (item: Category) => (
                <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-black">{item.count}</span>
            )
        },
    ];

    const handleDelete = async (item: Category) => {
        if (confirm(`Kategorie "${item.name}" wirklich löschen?`)) {
            await fetch('/api/admin/categories', {
                method: 'DELETE',
                body: JSON.stringify({ id: item.id }),
            });
            fetchCategories();
        }
    };

    return (
        <div className="p-10 space-y-10">
            <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Kategorien</h1>
                <p className="text-zinc-500 font-medium">Strukturieren Sie Ihren Mietpark in sinnvolle Bereiche.</p>
            </div>

            <DataTable
                title="Kategorie Übersicht"
                data={categories}
                columns={columns}
                onEdit={(item) => {
                    setSelectedCategory(item);
                    setIsModalOpen(true);
                }}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedCategory(null);
                    setIsModalOpen(true);
                }}
                loading={loading}
            />

            <CategoryModal
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
                onSaveAction={handleSave}
                category={selectedCategory}
            />
        </div>
    );
}
