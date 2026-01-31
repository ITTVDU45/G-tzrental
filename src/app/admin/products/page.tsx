"use client";

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import Image from 'next/image';

interface Product {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    image: string;
    price: number;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const columns = [
        {
            header: 'Produkt',
            accessor: (item: Product) => (
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-white">{item.name}</span>
                </div>
            )
        },
        { header: 'Kategorie', accessor: 'category' as const },
        { header: 'Unterkategorie', accessor: 'subcategory' as const },
        {
            header: 'Preis',
            accessor: (item: Product) => (
                <span className="text-brand-teal font-black">{item.price}€ <small className="text-zinc-400 font-bold uppercase text-[9px]">/ Tag</small></span>
            )
        },
    ];

    const handleDelete = async (item: Product) => {
        if (confirm(`Möchten Sie "${item.name}" wirklich löschen?`)) {
            await fetch('/api/admin/products', {
                method: 'DELETE',
                body: JSON.stringify({ id: item.id }),
            });
            fetchProducts();
        }
    };

    return (
        <div className="p-10 space-y-10">
            <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Produkte</h1>
                <p className="text-zinc-500 font-medium">Verwalten Sie Ihre Geräte und deren Spezifikationen.</p>
            </div>

            <DataTable
                title="Mietpark Liste"
                data={products}
                columns={columns}
                onEdit={(item) => alert(`Bearbeiten: ${item.name}`)}
                onDelete={handleDelete}
                onAdd={() => alert('Neues Produkt hinzufügen')}
                loading={loading}
            />
        </div>
    );
}
