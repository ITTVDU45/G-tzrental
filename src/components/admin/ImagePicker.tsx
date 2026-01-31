"use client";

import { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Search, CheckCircle2, Plus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaItem {
    name: string;
    url: string;
}

interface ImagePickerProps {
    value: string;
    onChangeAction: (url: string) => void;
    label?: string;
}

export default function ImagePicker({ value, onChangeAction, label = "Bild" }: ImagePickerProps) {
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMedia = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/media');
            const data = await res.json();
            setMedia(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (file: File) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/admin/media', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                onChangeAction(data.url);
                setIsGalleryOpen(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleUpload(file);
        }
    };

    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">{label}</label>

            <div
                className={cn(
                    "relative group h-64 rounded-[2.5rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4",
                    isDragging ? "border-brand-teal bg-brand-teal/5" : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:border-brand-teal/50",
                    value ? "border-solid" : ""
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => !value && setIsGalleryOpen(true)}
            >
                {value ? (
                    <>
                        <Image src={value} alt="Preview" fill className="object-contain p-4" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(true); }}
                                className="px-6 py-2 bg-white text-brand-dark rounded-full font-bold text-xs hover:bg-brand-teal hover:text-white transition-all shadow-xl"
                            >
                                Ändern
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onChangeAction(''); }}
                                className="px-6 py-2 bg-red-500 text-white rounded-full font-bold text-xs hover:bg-red-600 transition-all shadow-xl"
                            >
                                Entfernen
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 rounded-3xl bg-white dark:bg-zinc-800 shadow-xl flex items-center justify-center text-zinc-400 group-hover:text-brand-teal transition-colors">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-tight">Bild hochladen</p>
                            <p className="text-xs text-zinc-500 font-bold mt-1">oder aus Mediathek wählen</p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(true); }}
                            className="mt-2 px-6 py-2 bg-brand-teal/10 text-brand-teal rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-brand-teal hover:text-white transition-all"
                        >
                            Mediathek öffnen
                        </button>
                    </>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-brand-teal">
                        <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin mb-4" />
                        <span className="font-black text-[10px] uppercase tracking-[0.2em]">Wird hochgeladen...</span>
                    </div>
                )}
            </div>

            {/* Gallery Modal */}
            <AnimatePresence>
                {isGalleryOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsGalleryOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[80vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-zinc-100 dark:border-zinc-800"
                        >
                            <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Mediathek</h2>
                                    <p className="text-zinc-500 text-sm font-medium">Wählen Sie ein Bild aus oder laden Sie ein neues hoch.</p>
                                </div>
                                <button onClick={() => setIsGalleryOpen(false)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors">
                                    <X className="w-6 h-6 text-zinc-400" />
                                </button>
                            </div>

                            <div className="p-8 flex gap-4 border-b border-zinc-50 dark:border-zinc-800">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input
                                        type="text"
                                        placeholder="Bilder suchen..."
                                        className="w-full pl-11 pr-6 py-4 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 font-bold"
                                    />
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-8 py-4 bg-brand-teal text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Hochladen
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUpload(file);
                                    }}
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/50 dark:bg-black/20">
                                {loading ? (
                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                            <div key={i} className="aspect-square bg-white dark:bg-zinc-800 rounded-2xl animate-pulse" />
                                        ))}
                                    </div>
                                ) : media.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <ImageIcon className="w-12 h-12 text-zinc-300 mb-4" />
                                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Keine Bilder in der Mediathek</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 text-center">
                                        {media.map((item) => (
                                            <button
                                                key={item.url}
                                                onClick={() => { onChangeAction(item.url); setIsGalleryOpen(false); }}
                                                className={cn(
                                                    "group relative aspect-square bg-white dark:bg-zinc-800 rounded-[2rem] overflow-hidden border transition-all hover:shadow-xl",
                                                    value === item.url ? "border-brand-teal ring-4 ring-brand-teal/20 shadow-xl" : "border-zinc-100 dark:border-zinc-800"
                                                )}
                                            >
                                                <Image src={item.url} alt={item.name} fill className="object-cover" />
                                                <div className="absolute inset-0 bg-brand-teal/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <CheckCircle2 className="w-8 h-8 text-white drop-shadow-lg" />
                                                </div>
                                                {value === item.url && (
                                                    <div className="absolute top-3 right-3 w-6 h-6 bg-brand-teal rounded-full flex items-center justify-center shadow-lg">
                                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
