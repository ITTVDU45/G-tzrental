"use client";

import { Edit, Trash2, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T> {
    title: string;
    data: T[];
    columns: Column<T>[];
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    onAdd?: () => void;
    loading?: boolean;
}

export default function DataTable<T extends { id: string | number }>({
    title,
    data,
    columns,
    onEdit,
    onDelete,
    onAdd,
    loading
}: DataTableProps<T>) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-zinc-50 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">{title}</h2>
                    <p className="text-zinc-500 text-sm font-medium">{data.length} Einträge gefunden</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Suchen..."
                            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/50 transition-all w-64"
                        />
                    </div>
                    {onAdd && (
                        <button
                            onClick={onAdd}
                            className="bg-brand-teal text-white p-3 rounded-2xl flex items-center gap-2 hover:bg-brand-teal/80 transition-all shadow-lg shadow-brand-teal/20"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-bold text-xs uppercase tracking-widest px-1">Neu</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-50/50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
                            {columns.map((col, idx) => (
                                <th key={idx} className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                                    {col.header}
                                </th>
                            ))}
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">
                                Aktionen
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                        {data.length > 0 ? data.map((item) => (
                            <tr key={item.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                {columns.map((col, idx) => (
                                    <td key={idx} className="px-8 py-6 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                        {typeof col.accessor === 'function'
                                            ? col.accessor(item)
                                            : (item[col.accessor] as React.ReactNode)}
                                    </td>
                                ))}
                                <td className="px-8 py-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {onEdit && (
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-brand-teal hover:bg-brand-teal/10 transition-all"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(item)}
                                                className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="px-8 py-20 text-center text-zinc-400 font-medium italic">
                                    Keine Daten vorhanden.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
