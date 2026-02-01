"use client";

import { useState, useEffect, useRef } from 'react';
import { Upload, FileText, X, Search, CheckCircle2, Plus, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MediaItem {
    name: string;
    url: string;
    type?: string;
}

interface FilePickerProps {
    value: string;
    onChangeAction: (url: string) => void;
    label?: string;
    accept?: string;
}

export default function FilePicker({ value, onChangeAction, label = "Datenblatt (PDF)", accept = "application/pdf" }: FilePickerProps) {
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
            // Filter only PDFs if accept is pdf
            const filtered = accept.includes('pdf')
                ? data.filter((item: any) => item.type === 'pdf' || item.url.endsWith('.pdf'))
                : data;
            setMedia(filtered);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isGalleryOpen) {
            fetchMedia();
        }
    }, [isGalleryOpen]);

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
        if (file) {
            handleUpload(file);
        }
    };

    const getFileName = (url: string) => {
        try {
            return url.split('/').pop() || url;
        } catch {
            return url;
        }
    };

    return (
        <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">{label}</label>

            <div
                className={cn(
                    "relative group h-32 rounded-[1.5rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4",
                    isDragging ? "border-brand-teal bg-brand-teal/5" : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:border-brand-teal/50",
                    value ? "border-solid border-brand-teal/20 bg-brand-teal/5" : ""
                )}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => !value && setIsGalleryOpen(true)}
            >
                {value ? (
                    <div className="flex items-center gap-4 w-full px-8">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-brand-teal shadow-sm shrink-0">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{getFileName(value)}</p>
                            <p className="text-xs text-zinc-500 font-medium">PDF Dokument</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setIsGalleryOpen(true); }}
                                className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 transition-colors"
                            >
                                <Search className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); onChangeAction(''); }}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="w-6 h-6 text-zinc-400 group-hover:text-brand-teal transition-colors" />
                            <p className="text-xs font-bold text-zinc-500 group-hover:text-brand-teal transition-colors">Datei hochladen oder auswählen</p>
                        </div>
                    </>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm flex flex-col items-center justify-center text-brand-teal">
                        <div className="w-8 h-8 border-3 border-brand-teal border-t-transparent rounded-full animate-spin mb-2" />
                        <span className="font-black text-[10px] uppercase tracking-[0.2em]">Upload...</span>
                    </div>
                )}
            </div>

            {/* File Gallery Modal */}
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
                                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">Dokumente</h2>
                                    <p className="text-zinc-500 text-sm font-medium">Wählen Sie ein Dokument aus oder laden Sie ein neues hoch.</p>
                                </div>
                                <button onClick={() => setIsGalleryOpen(false)} className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-2xl transition-colors">
                                    <X className="w-6 h-6 text-zinc-400" />
                                </button>
                            </div>

                            <div className="p-8 flex gap-4 border-b border-zinc-50 dark:border-zinc-800">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-8 py-4 bg-brand-teal text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-2 ml-auto"
                                >
                                    <Plus className="w-4 h-4" /> Neues Dokument
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept={accept}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) handleUpload(file);
                                    }}
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 bg-zinc-50/50 dark:bg-black/20">
                                {loading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-20 bg-white dark:bg-zinc-800 rounded-2xl animate-pulse" />
                                        ))}
                                    </div>
                                ) : media.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-center">
                                        <FileText className="w-12 h-12 text-zinc-300 mb-4" />
                                        <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Keine Dokumente gefunden</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {media.map((item) => (
                                            <button
                                                key={item.url}
                                                onClick={() => { onChangeAction(item.url); setIsGalleryOpen(false); }}
                                                className={cn(
                                                    "group relative flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 rounded-2xl border transition-all hover:shadow-lg text-left",
                                                    value === item.url ? "border-brand-teal ring-2 ring-brand-teal/20 shadow-md" : "border-zinc-100 dark:border-zinc-800 hover:border-brand-teal/50"
                                                )}
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-brand-teal transition-colors">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{item.name}</p>
                                                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wide">PDF</p>
                                                </div>
                                                {value === item.url && (
                                                    <div className="text-brand-teal">
                                                        <CheckCircle2 className="w-5 h-5" />
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
