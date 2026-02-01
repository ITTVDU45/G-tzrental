"use client";

import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-zinc-50 dark:bg-zinc-800 animate-pulse rounded-2xl" />
});

interface EditorProps {
    value: string;
    onChangeAction: (content: string) => void;
}

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'clean'],
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list',
    'link'
];

export default function RichTextEditor({ value, onChangeAction }: EditorProps) {
    return (
        <div className="rich-text-editor transition-all">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChangeAction}
                modules={modules}
                formats={formats}
                className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800"
            />
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
      `}</style>
        </div>
    );
}
