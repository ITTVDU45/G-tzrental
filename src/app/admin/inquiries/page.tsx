"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/admin/DataTable';
import { Mail, Calendar, User, CheckCircle, Clock, XCircle, Eye, Building2 } from 'lucide-react';

interface Inquiry {
    id: string;
    type: 'configurator' | 'product';
    status: 'new' | 'contacted' | 'offered' | 'confirmed' | 'canceled';
    createdAt: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerCompany?: string;
    customerMessage?: string;
    rentalStart: string | null;
    rentalEnd: string | null;
    location?: string;
    delivery?: boolean;
    categoryLabel?: string;
    deviceTypeLabel?: string;
    selectedProducts?: any[];
    requirements?: any;
    selectedExtras?: any[];
    upsellingProducts?: any[];
    productName?: string;
    locationName?: string;
}

export default function AdminInquiriesPage() {
    const router = useRouter();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchInquiries = async () => {
        try {
            const res = await fetch('/api/admin/inquiries');
            const data = await res.json();
            setInquiries(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleDelete = async (item: Inquiry) => {
        if (confirm(`Anfrage von "${item.customerName}" wirklich löschen?`)) {
            await fetch('/api/admin/inquiries', {
                method: 'DELETE',
                body: JSON.stringify({ id: item.id }),
            });
            fetchInquiries();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500/10 text-blue-500';
            case 'contacted': return 'bg-purple-500/10 text-purple-500';
            case 'offered': return 'bg-yellow-500/10 text-yellow-500';
            case 'confirmed': return 'bg-green-500/10 text-green-500';
            case 'canceled': return 'bg-red-500/10 text-red-500';
            default: return 'bg-zinc-500/10 text-zinc-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'confirmed': return <CheckCircle className="w-3 h-3" />;
            case 'canceled': return <XCircle className="w-3 h-3" />;
            default: return <Clock className="w-3 h-3" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'Neu';
            case 'contacted': return 'Kontaktiert';
            case 'offered': return 'Angebot erstellt';
            case 'confirmed': return 'Bestätigt';
            case 'canceled': return 'Storniert';
            default: return status;
        }
    };

    const columns = [
        {
            header: 'Kunde',
            accessor: (item: Inquiry) => (
                <div>
                    <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <User className="w-3 h-3 text-zinc-400" /> {item.customerName}
                    </p>
                    {item.customerCompany && (
                        <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-2">
                            <Building2 className="w-3 h-3" /> {item.customerCompany}
                        </p>
                    )}
                    <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {item.customerEmail}
                    </p>
                </div>
            )
        },
        {
            header: 'Typ',
            accessor: (item: Inquiry) => (
                <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-[10px] font-bold uppercase">
                    {item.type === 'configurator' ? 'Konfigurator' : 'Produkt'}
                </span>
            )
        },
        {
            header: 'Anfrage',
            accessor: (item: Inquiry) => (
                <div>
                    {item.type === 'configurator' ? (
                        <>
                            <p className="font-bold text-brand-teal">{item.deviceTypeLabel || item.categoryLabel}</p>
                            {item.selectedProducts && item.selectedProducts.length > 0 && (
                                <p className="text-[10px] text-zinc-500">{item.selectedProducts.length} Produkt(e)</p>
                            )}
                        </>
                    ) : (
                        <p className="font-bold text-brand-teal">{item.productName}</p>
                    )}
                </div>
            )
        },
        {
            header: 'Zeitraum',
            accessor: (item: Inquiry) => (
                <div className="text-[10px] font-bold text-zinc-500">
                    {item.rentalStart && item.rentalEnd ? (
                        <>
                            <p className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(item.rentalStart).toLocaleDateString('de-DE')}</p>
                            <p className="pl-4">bis {new Date(item.rentalEnd).toLocaleDateString('de-DE')}</p>
                        </>
                    ) : (
                        <p className="text-zinc-400 italic">Nicht angegeben</p>
                    )}
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (item: Inquiry) => (
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        {getStatusLabel(item.status)}
                    </span>
                </div>
            )
        }
    ];

    return (
        <div className="p-10 space-y-10">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Mietanfragen</h1>
                    <p className="text-zinc-500 font-medium">Behalten Sie alle aktuellen Reservierungen und Anfragen im Blick.</p>
                </div>
            </div>

            <DataTable
                title="Eingegangene Anfragen"
                data={inquiries}
                columns={columns}
                onEdit={(item) => router.push(`/admin/inquiries/${item.id}`)}
                onDelete={handleDelete}
                loading={loading}
            />
        </div>
    );
}
