"use client";

import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { ImagePlus } from 'lucide-react';
import { I_Any } from '@/lib/types';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-zinc-50 dark:bg-zinc-800 animate-pulse rounded-2xl" />
});

interface EditorProps {
    value: string;
    onChangeAction: (content: string) => void;
}

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list',
    'link',
    'image'
];

export default function RichTextEditor({ value, onChangeAction }: EditorProps) {
    const editorRef = useRef<I_Any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const insertImageIntoEditor = async (file: File) => {
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/admin/media', {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok || !data?.url) {
                throw new Error(data?.error || 'Image upload failed');
            }

            const editor = editorRef.current?.getEditor?.();
            if (!editor) return;

            const selection = editor.getSelection(true);
            const insertAt = typeof selection?.index === 'number' ? selection.index : editor.getLength();
            editor.insertEmbed(insertAt, 'image', data.url, 'user');
            editor.setSelection(insertAt + 1);
        } catch (error) {
            console.error('Editor image upload failed:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const modules = {
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image', 'clean'],
            ],
            handlers: {
                image: () => fileInputRef.current?.click(),
            },
        },
    };

    return (
        <div className="rich-text-editor transition-all relative">
            <ReactQuill
                ref={editorRef}
                theme="snow"
                value={value}
                onChange={onChangeAction}
                modules={modules}
                formats={formats}
                className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
            />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        void insertImageIntoEditor(file);
                    }
                    e.target.value = '';
                }}
            />
            {isUploading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/75 dark:bg-zinc-900/75 backdrop-blur-sm">
                    <div className="flex items-center gap-3 rounded-full border border-brand-teal/20 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-brand-teal shadow-xl dark:bg-zinc-900">
                        <ImagePlus className="h-4 w-4" />
                        Bild wird in MinIO hochgeladen
                    </div>
                </div>
            )}
            <style jsx global>{`
        .rich-text-editor .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #f4f4f5 !important;
          background: #fafafa;
          padding: 1rem !important;
          border-radius: 1.5rem 1.5rem 0 0;
        }
        .dark .rich-text-editor .ql-toolbar {
          background: #18181b;
          border-bottom: 1px solid #27272a !important;
        }
        .rich-text-editor .ql-container {
          border: none !important;
          font-family: inherit;
          font-size: 1rem;
          min-height: 250px;
        }
        .rich-text-editor .ql-editor {
          padding: 1.5rem !important;
          min-height: 250px;
        }
        .rich-text-editor .ql-stroke {
          stroke: #71717a !important;
        }
        .rich-text-editor .ql-fill {
          fill: #71717a !important;
        }
        .rich-text-editor .ql-picker {
          color: #71717a !important;
        }
        .dark .ql-stroke {
          stroke: #a1a1aa !important;
        }
        .dark .ql-fill {
          fill: #a1a1aa !important;
        }
        .dark .ql-picker {
          color: #a1a1aa !important;
        }
        .rich-text-editor .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 1rem 0;
        }
      `}</style>
        </div>
    );
}
