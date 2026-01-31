"use client";

import { useEffect, useState } from 'react';
import DataTable from '@/components/admin/DataTable';
import { Mail, Calendar, User, CheckCircle, Clock, XCircle } from 'lucide-react';

interface Inquiry {
    id: string;
    customerName: string;
    customerEmail: string;
    productName: string;
    rentalStart: string;
    rentalEnd: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    date: string;
}

export default function AdminInquiriesPage() {
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

    const updateStatus = async (item: Inquiry, newStatus: string) => {
        const updated = { ...item, status: newStatus };
        await fetch('/api/admin/inquiries', {
            method: 'POST',
            body: JSON.stringify(updated),
        });
        fetchInquiries();
    };

    const columns = [
        {
            header: 'Kunde',
            accessor: (item: Inquiry) => (
                <div>
                    <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                        <User className="w-3 h-3 text-zinc-400" /> {item.customerName}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-medium flex items-center gap-2">
                        <Mail className="w-3 h-3" /> {item.customerEmail}
                    </p>
                </div>
            )
        },
        {
            header: 'Produkt',
            accessor: (item: Inquiry) => (
                <span className="font-bold text-brand-teal uppercase tracking-tight">{item.productName}</span>
            )
        },
        {
            header: 'Zeitraum',
            accessor: (item: Inquiry) => (
                <div className="text-[10px] font-bold text-zinc-500">
                    <p className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.rentalStart} bis</p>
                    <p className="pl-4">{item.rentalEnd}</p>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: (item: Inquiry) => (
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${item.status === 'confirmed' ? 'bg-green-500/10 text-green-500' :
                            item.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                'bg-orange-500/10 text-orange-500'
                        }`}>
                        {item.status === 'confirmed' && <CheckCircle className="w-3 h-3" />}
                        {item.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        {item.status === 'pending' && <Clock className="w-3 h-3" />}
                        {item.status === 'confirmed' ? 'Bestätigt' :
                            item.status === 'cancelled' ? 'Storniert' : 'Offen'}
                    </span>
                </div>
            )
        },
    ];

    const handleDelete = async (item: Inquiry) => {
        if (confirm(`Anfrage von "${item.customerName}" wirklich löschen?`)) {
            await fetch('/api/admin/inquiries', {
                method: 'DELETE',
                body: JSON.stringify({ id: item.id }),
            });
            fetchInquiries();
        }
    };

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
                onEdit={(item) => {
                    const nextStatus = item.status === 'pending' ? 'confirmed' : item.status === 'confirmed' ? 'cancelled' : 'pending';
                    updateStatus(item, nextStatus);
                }}
                onDelete={handleDelete}
                loading={loading}
            />
        </div>
    );
}
