"use client";

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { MapPin } from 'lucide-react';
import LocationModal from '@/components/admin/modals/LocationModal';

interface Location {
    id: string;
    name: string;
    status: string;
    productIds?: string[];
    lastModified: string;
}

interface Product {
    id: string;
    name: string;
}

export default function AdminLocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const fetchLocations = async () => {
        try {
            const res = await fetch('/api/admin/pages');
            const data = await res.json();
            setLocations(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/admin/products');
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchLocations();
        fetchProducts();
    }, []);

    const columns = [
        {
            header: 'Standortname',
            accessor: (item: Location) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-brand-teal" />
                    </div>
                    <span className="font-bold text-zinc-900 dark:text-white">{item.name}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (item: Location) => (
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${item.status === 'published' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'
                    }`}>
                    {item.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                </span>
            )
        },
        {
            header: 'Zugewiesene Produkte',
            accessor: (item: Location) => (
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-bold">
                    {(item.productIds || []).length} Produkt{(item.productIds || []).length !== 1 ? 'e' : ''}
                </span>
            )
        },
        { header: 'Geändert am', accessor: 'lastModified' as const },
    ];

    const handleDelete = async (item: Location) => {
        if (confirm(`Standort "${item.name}" wirklich löschen?`)) {
            await fetch('/api/admin/pages', {
                method: 'DELETE',
                body: JSON.stringify({ id: item.id }),
            });
            fetchLocations();
        }
    };

    const handleSave = async (formData: Partial<Location>) => {
        try {
            const res = await fetch('/api/admin/pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                fetchLocations();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-10 space-y-10">
            <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Standorte</h1>
                <p className="text-zinc-500 font-medium">Verwalten Sie Ihre Standorte und weisen Sie Produkte zu.</p>
            </div>

            <DataTable
                title="Standortverwaltung"
                data={locations}
                columns={columns}
                onEdit={(item) => {
                    setSelectedLocation(item);
                    setIsModalOpen(true);
                }}
                onDelete={handleDelete}
                onAdd={() => {
                    setSelectedLocation(null);
                    setIsModalOpen(true);
                }}
                loading={loading}
            />

            <LocationModal
                isOpen={isModalOpen}
                onCloseAction={() => setIsModalOpen(false)}
                onSaveAction={handleSave}
                location={selectedLocation}
                products={products}
            />
        </div>
    );
}
