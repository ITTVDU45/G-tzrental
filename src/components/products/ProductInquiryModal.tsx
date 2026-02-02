"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Send, Loader2 } from 'lucide-react';

interface ProductInquiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: any;
}

export default function ProductInquiryModal({ isOpen, onClose, product }: ProductInquiryModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        startDate: '',
        endDate: '',
        location: '',
        delivery: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const inquiryData = {
                type: 'product',
                productId: product.id,
                productName: product.name,
                contact: {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    company: formData.company,
                    message: formData.message,
                    startDate: formData.startDate ? new Date(formData.startDate) : null,
                    endDate: formData.endDate ? new Date(formData.endDate) : null,
                    location: formData.location,
                    delivery: formData.delivery
                }
            };

            const response = await fetch('/api/inquiries/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inquiryData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Fehler beim Senden der Anfrage');
            }

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    message: '',
                    startDate: '',
                    endDate: '',
                    location: '',
                    delivery: true
                });
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Ein Fehler ist aufgetreten');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-zinc-200 dark:border-zinc-800"
                    >
                        {isSuccess ? (
                            <div className="p-12 text-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                                    <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">Vielen Dank!</h2>
                                <p className="text-lg text-zinc-600 dark:text-zinc-400">
                                    Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns in Kürze bei Ihnen.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">Mietanfrage stellen</h2>
                                        <p className="text-sm text-zinc-500">{product.name}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                                    <div className="space-y-6">
                                        {/* Rental Period */}
                                        <div>
                                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4 flex items-center gap-2">
                                                <Calendar className="w-5 h-5 text-brand-teal" />
                                                Mietzeitraum
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                                                        Mietbeginn *
                                                    </label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={formData.startDate}
                                                        onChange={(e) => updateField('startDate', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                                                        Mietende *
                                                    </label>
                                                    <input
                                                        type="date"
                                                        required
                                                        value={formData.endDate}
                                                        onChange={(e) => updateField('endDate', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2 block">
                                                Einsatzort / Straße
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Musterbaustelle 1"
                                                value={formData.location}
                                                onChange={(e) => updateField('location', e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                            />
                                        </div>

                                        {/* Delivery */}
                                        <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                            <input
                                                type="checkbox"
                                                checked={formData.delivery}
                                                onChange={(e) => updateField('delivery', e.target.checked)}
                                                className="w-5 h-5 rounded text-brand-teal focus:ring-brand-teal"
                                            />
                                            <span className="text-zinc-700 dark:text-zinc-300 font-medium">Lieferung zur Baustelle gewünscht</span>
                                        </div>

                                        {/* Contact Details */}
                                        <div>
                                            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Kontaktdaten</h3>
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    placeholder="Firma (Optional)"
                                                    value={formData.company}
                                                    onChange={(e) => updateField('company', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Ansprechpartner *"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => updateField('name', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="email"
                                                        placeholder="E-Mail Adresse *"
                                                        required
                                                        value={formData.email}
                                                        onChange={(e) => updateField('email', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                                    />
                                                    <input
                                                        type="tel"
                                                        placeholder="Telefonnummer *"
                                                        required
                                                        value={formData.phone}
                                                        onChange={(e) => updateField('phone', e.target.value)}
                                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                                                    />
                                                </div>
                                                <textarea
                                                    rows={3}
                                                    placeholder="Ihre Nachricht an uns..."
                                                    value={formData.message}
                                                    onChange={(e) => updateField('message', e.target.value)}
                                                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold">
                                                {error}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-brand-teal hover:bg-brand-teal/90 text-white rounded-xl font-bold text-lg shadow-xl shadow-brand-teal/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    Wird gesendet...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    Anfrage absenden
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
