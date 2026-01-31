"use client";

import { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon, Plus, X, Search, FileImage } from 'lucide-react';
import Image from 'next/image';

interface MediaItem {
    name: string;
    url: string;
    type: string;
}

export default function AdminMediaPage() {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMedia = async () => {
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

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        for (let i = 0; i < files.length; i++) {
            const formData = new FormData();
            formData.append('file', files[i]);

            try {
                const res = await fetch('/api/admin/media', {
                    method: 'POST',
                    body: formData,
                });
                if (res.ok) {
                    await fetchMedia();
                }
            } catch (err) {
                console.error(err);
            }
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (name: string) => {
        if (!confirm('Möchten Sie dieses Bild wirklich löschen?')) return;

        try {
            const res = await fetch('/api/admin/media', {
                method: 'DELETE',
                body: JSON.stringify({ name }),
            });
            if (res.ok) {
                fetchMedia();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredMedia = media.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-10 space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Mediathek</h1>
                    <p className="text-zinc-500 font-medium">Verwalten Sie Ihre Bilder und Dateien.</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Suchen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 pr-6 py-4 bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 w-64 font-bold"
                        />
                    </div>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-8 py-4 bg-brand-teal text-white rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-brand-teal/20 disabled:opacity-50"
                    >
                        {uploading ? 'Wird hochgeladen...' : <><Plus className="w-5 h-5" /> Hochladen</>}
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleUpload}
                        multiple
                        accept="image/*"
                        className="hidden"
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-[2rem] animate-pulse" />
                    ))}
                </div>
            ) : filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <ImageIcon className="w-16 h-16 text-zinc-300 mb-4" />
                    <p className="text-zinc-500 font-bold">Keine Medien gefunden</p>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-4 text-brand-teal font-black text-sm hover:underline"
                    >
                        Erstes Bild hochladen
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {filteredMedia.map((item) => (
                        <div key={item.name} className="group relative aspect-square bg-white dark:bg-zinc-800 rounded-[2rem] overflow-hidden border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all hover:shadow-xl">
                            <Image
                                src={item.url}
                                alt={item.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                                <p className="text-white text-[10px] font-bold truncate w-full mb-4 px-2">{item.name}</p>
                                <button
                                    onClick={() => handleDelete(item.name)}
                                    className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
