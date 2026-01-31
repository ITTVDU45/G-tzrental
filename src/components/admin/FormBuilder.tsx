"use client";

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Save } from 'lucide-react';

interface Field {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'image';
    options?: { label: string; value: string }[];
}

interface FormBuilderProps {
    title: string;
    fields: Field[];
    initialData?: any;
    onSave: (data: any) => void;
    onClose: () => void;
}

export default function FormBuilder({ title, fields, initialData = {}, onSave, onClose }: FormBuilderProps) {
    const [formData, setFormData] = useState(initialData);

    const handleChange = (name: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
                <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{title}</h3>
                    <button onClick={onClose} className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-red-500 transition-all">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                    {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-1">{field.label}</label>

                            {field.type === 'text' && (
                                <input
                                    type="text"
                                    value={formData[field.name] || ''}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all"
                                />
                            )}

                            {field.type === 'textarea' && (
                                <textarea
                                    value={formData[field.name] || ''}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all min-h-[120px]"
                                />
                            )}

                            {field.type === 'number' && (
                                <input
                                    type="number"
                                    value={formData[field.name] || ''}
                                    onChange={(e) => handleChange(field.name, parseFloat(e.target.value))}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all"
                                />
                            )}

                            {field.type === 'select' && (
                                <select
                                    value={formData[field.name] || ''}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all appearance-none"
                                >
                                    <option value="">Auswählen...</option>
                                    {field.options?.map((opt) => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            )}

                            {field.type === 'image' && (
                                <input
                                    type="text"
                                    placeholder="Bild-URL (z.B. Unsplash)"
                                    value={formData[field.name] || ''}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-4 px-6 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all"
                                />
                            )}
                        </div>
                    ))}
                </form>

                <div className="p-8 border-t border-zinc-50 dark:border-zinc-800 flex items-center justify-end gap-4">
                    <button onClick={onClose} className="px-8 py-4 text-zinc-500 font-bold hover:text-zinc-900 dark:hover:text-white transition-all uppercase text-xs tracking-widest">Abbrechen</button>
                    <button
                        onClick={handleSubmit}
                        className="bg-brand-teal text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-brand-teal/80 transition-all shadow-xl shadow-brand-teal/20 uppercase text-xs tracking-widest"
                    >
                        <Save className="w-4 h-4" />
                        <span>Speichern</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
