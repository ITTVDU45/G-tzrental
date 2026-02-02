"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Save,
    Trash2,
    User,
    Mail,
    Phone,
    Building2,
    Calendar,
    MapPin,
    Package,
    Tag,
    Settings,
    MessageSquare,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';

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

export default function InquiryDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editedInquiry, setEditedInquiry] = useState<Inquiry | null>(null);

    useEffect(() => {
        fetchInquiry();
    }, [id]);

    const fetchInquiry = async () => {
        try {
            const res = await fetch('/api/admin/inquiries');
            const data = await res.json();
            const found = data.find((inq: Inquiry) => inq.id === id);

            if (found) {
                setInquiry(found);
                setEditedInquiry(found);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!editedInquiry) return;

        setSaving(true);
        try {
            await fetch('/api/admin/inquiries', {
                method: 'POST',
                body: JSON.stringify(editedInquiry),
            });
            setInquiry(editedInquiry);
            alert('Änderungen gespeichert!');
        } catch (err) {
            console.error(err);
            alert('Fehler beim Speichern');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Anfrage "${inquiry?.customerName}" wirklich löschen?`)) return;

        try {
            await fetch('/api/admin/inquiries', {
                method: 'DELETE',
                body: JSON.stringify({ id }),
            });
            router.push('/admin/inquiries');
        } catch (err) {
            console.error(err);
            alert('Fehler beim Löschen');
        }
    };

    const updateField = (field: string, value: any) => {
        if (!editedInquiry) return;
        setEditedInquiry({ ...editedInquiry, [field]: value });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-500';
            case 'contacted': return 'bg-purple-500';
            case 'offered': return 'bg-yellow-500';
            case 'confirmed': return 'bg-green-500';
            case 'canceled': return 'bg-red-500';
            default: return 'bg-zinc-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'new': return <AlertCircle className="w-5 h-5" />;
            case 'contacted': return <Clock className="w-5 h-5" />;
            case 'offered': return <MessageSquare className="w-5 h-5" />;
            case 'confirmed': return <CheckCircle className="w-5 h-5" />;
            case 'canceled': return <XCircle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    if (loading) {
        return (
            <div className="p-10 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-zinc-600 dark:text-zinc-400">Laden...</p>
                </div>
            </div>
        );
    }

    if (!inquiry || !editedInquiry) {
        return (
            <div className="p-10">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-4">Anfrage nicht gefunden</h1>
                    <button
                        onClick={() => router.push('/admin/inquiries')}
                        className="text-brand-teal hover:underline font-bold"
                    >
                        Zurück zur Übersicht
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/admin/inquiries')}
                        className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                            Anfrage Details
                        </h1>
                        <p className="text-zinc-500 font-medium mt-1">ID: {inquiry.id}</p>
                        <p className="text-xs text-zinc-400">
                            Erstellt: {new Date(inquiry.createdAt).toLocaleString('de-DE')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Speichern...' : 'Speichern'}
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all"
                    >
                        <Trash2 className="w-5 h-5" />
                        Löschen
                    </button>
                </div>
            </div>

            {/* Status Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4"
            >
                <div className={`flex items-center gap-3 px-6 py-3 ${getStatusColor(editedInquiry.status)} text-white rounded-2xl font-bold shadow-lg`}>
                    {getStatusIcon(editedInquiry.status)}
                    <span className="uppercase tracking-wider">
                        {editedInquiry.status === 'new' && 'Neu'}
                        {editedInquiry.status === 'contacted' && 'Kontaktiert'}
                        {editedInquiry.status === 'offered' && 'Angebot erstellt'}
                        {editedInquiry.status === 'confirmed' && 'Bestätigt'}
                        {editedInquiry.status === 'canceled' && 'Storniert'}
                    </span>
                </div>
                <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                    <span className="text-sm font-bold uppercase text-zinc-600 dark:text-zinc-400">
                        {editedInquiry.type === 'configurator' ? 'Konfigurator-Anfrage' : 'Produkt-Anfrage'}
                    </span>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Management */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                    >
                        <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-tight">
                            Status & Verwaltung
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                                    Anfrage-Status
                                </label>
                                <select
                                    value={editedInquiry.status}
                                    onChange={(e) => updateField('status', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                >
                                    <option value="new">🔵 Neu</option>
                                    <option value="contacted">🟣 Kontaktiert</option>
                                    <option value="offered">🟡 Angebot erstellt</option>
                                    <option value="confirmed">🟢 Bestätigt</option>
                                    <option value="canceled">🔴 Storniert</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Customer Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                    >
                        <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                            <User className="w-6 h-6 text-brand-teal" />
                            Kundendaten
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={editedInquiry.customerName}
                                    onChange={(e) => updateField('customerName', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                                    <Building2 className="w-4 h-4" />
                                    Firma
                                </label>
                                <input
                                    type="text"
                                    value={editedInquiry.customerCompany || ''}
                                    onChange={(e) => updateField('customerCompany', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    E-Mail
                                </label>
                                <input
                                    type="email"
                                    value={editedInquiry.customerEmail}
                                    onChange={(e) => updateField('customerEmail', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold text-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Telefon
                                </label>
                                <input
                                    type="tel"
                                    value={editedInquiry.customerPhone}
                                    onChange={(e) => updateField('customerPhone', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                />
                            </div>
                        </div>
                        {editedInquiry.customerMessage && (
                            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Nachricht vom Kunden
                                </label>
                                <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                                    <p className="text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
                                        "{editedInquiry.customerMessage}"
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Rental Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                    >
                        <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-brand-teal" />
                            Mietdetails
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {editedInquiry.rentalStart && (
                                <div>
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                                        Mietbeginn
                                    </label>
                                    <input
                                        type="date"
                                        value={new Date(editedInquiry.rentalStart).toISOString().split('T')[0]}
                                        onChange={(e) => updateField('rentalStart', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                    />
                                </div>
                            )}
                            {editedInquiry.rentalEnd && (
                                <div>
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                                        Mietende
                                    </label>
                                    <input
                                        type="date"
                                        value={new Date(editedInquiry.rentalEnd).toISOString().split('T')[0]}
                                        onChange={(e) => updateField('rentalEnd', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                    />
                                </div>
                            )}
                            <div className="md:col-span-2">
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Einsatzort
                                </label>
                                <input
                                    type="text"
                                    value={editedInquiry.location || ''}
                                    onChange={(e) => updateField('location', e.target.value)}
                                    placeholder="Nicht angegeben"
                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 font-bold focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={editedInquiry.delivery || false}
                                        onChange={(e) => updateField('delivery', e.target.checked)}
                                        className="w-5 h-5 rounded text-brand-teal focus:ring-brand-teal"
                                    />
                                    <span className="font-bold text-zinc-900 dark:text-white">
                                        Lieferung zur Baustelle gewünscht
                                    </span>
                                </label>
                            </div>
                        </div>
                    </motion.div>

                    {/* Configuration Details (for configurator inquiries) */}
                    {editedInquiry.type === 'configurator' && (
                        <>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                            >
                                <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                                    <Settings className="w-6 h-6 text-brand-teal" />
                                    Konfiguration
                                </h2>
                                <div className="space-y-4">
                                    {editedInquiry.categoryLabel && (
                                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                                            <p className="text-xs text-zinc-500 mb-1 uppercase font-bold">Kategorie</p>
                                            <p className="font-bold text-lg text-zinc-900 dark:text-white">{editedInquiry.categoryLabel}</p>
                                        </div>
                                    )}
                                    {editedInquiry.deviceTypeLabel && (
                                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                                            <p className="text-xs text-zinc-500 mb-1 uppercase font-bold">Gerätetyp</p>
                                            <p className="font-bold text-lg text-zinc-900 dark:text-white">{editedInquiry.deviceTypeLabel}</p>
                                        </div>
                                    )}
                                    {editedInquiry.requirements && Object.keys(editedInquiry.requirements.sliders || {}).length > 0 && (
                                        <div>
                                            <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Anforderungen</p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {Object.entries(editedInquiry.requirements.sliders).map(([key, value]) => (
                                                    <div key={key} className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                                                        <p className="text-[10px] text-zinc-400 uppercase font-bold mb-1">{key}</p>
                                                        <p className="font-bold text-zinc-900 dark:text-white">{value as string}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>

                            {/* Selected Products */}
                            {editedInquiry.selectedProducts && editedInquiry.selectedProducts.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                                >
                                    <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                                        <Package className="w-6 h-6 text-brand-teal" />
                                        Ausgewählte Produkte
                                    </h2>
                                    <div className="space-y-3">
                                        {editedInquiry.selectedProducts.map((product: any, index: number) => (
                                            <div key={index} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
                                                <span className="font-bold text-zinc-900 dark:text-white">{product.title}</span>
                                                <span className="text-brand-teal font-black text-lg">{product.price}€/Tag</span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Extras */}
                            {editedInquiry.selectedExtras && editedInquiry.selectedExtras.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                                >
                                    <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                                        <Tag className="w-6 h-6 text-brand-teal" />
                                        Zusatzleistungen
                                    </h2>
                                    <div className="space-y-3">
                                        {editedInquiry.selectedExtras.map((extra: any, index: number) => (
                                            <div key={index} className="flex justify-between items-center p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl">
                                                <span className="font-bold text-zinc-900 dark:text-white">{extra.label}</span>
                                                <span className="text-brand-teal font-black">
                                                    {extra.price}€{extra.priceType === 'daily' ? '/Tag' : ' einmalig'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}

                    {/* Product Inquiry */}
                    {editedInquiry.type === 'product' && editedInquiry.productName && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                        >
                            <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-3">
                                <Package className="w-6 h-6 text-brand-teal" />
                                Angefragtes Produkt
                            </h2>
                            <div className="p-6 bg-gradient-to-br from-brand-teal/10 to-brand-teal/5 rounded-2xl border-2 border-brand-teal/20">
                                <p className="text-2xl font-black text-brand-teal">{editedInquiry.productName}</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right Column - Quick Info & Actions */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm sticky top-6"
                    >
                        <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tight">
                            Schnellaktionen
                        </h3>
                        <div className="space-y-3">
                            <a
                                href={`mailto:${editedInquiry.customerEmail}`}
                                className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-brand-teal hover:text-white rounded-xl transition-all font-bold group"
                            >
                                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                E-Mail senden
                            </a>
                            <a
                                href={`tel:${editedInquiry.customerPhone}`}
                                className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 hover:bg-brand-teal hover:text-white rounded-xl transition-all font-bold group"
                            >
                                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Anrufen
                            </a>
                        </div>
                    </motion.div>

                    {/* Location Context */}
                    {editedInquiry.locationName && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                        >
                            <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tight flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-brand-teal" />
                                Standort
                            </h3>
                            <p className="font-bold text-xl text-zinc-900 dark:text-white">{editedInquiry.locationName}</p>
                        </motion.div>
                    )}

                    {/* Metadata */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-800 shadow-sm"
                    >
                        <h3 className="text-lg font-black text-zinc-900 dark:text-white mb-4 uppercase tracking-tight">
                            Metadaten
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-zinc-500 font-bold uppercase text-xs mb-1">Anfrage-ID</p>
                                <p className="font-mono text-zinc-900 dark:text-white font-bold">{inquiry.id}</p>
                            </div>
                            <div>
                                <p className="text-zinc-500 font-bold uppercase text-xs mb-1">Erstellt am</p>
                                <p className="text-zinc-900 dark:text-white font-bold">
                                    {new Date(inquiry.createdAt).toLocaleDateString('de-DE', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-zinc-500 font-bold uppercase text-xs mb-1">Typ</p>
                                <p className="text-zinc-900 dark:text-white font-bold">
                                    {editedInquiry.type === 'configurator' ? 'Konfigurator' : 'Direktanfrage'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
