import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { readDb } from '@/lib/db';
import {
    FileText,
    Layers,
    Box,
    MessageSquare,
    BookOpen,
    ArrowUpRight,
    TrendingUp
} from 'lucide-react';

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session) redirect('/admin/login');

    const db = await readDb();

    const stats = [
        { title: 'Anfragen', value: db.inquiries?.length || 0, icon: MessageSquare, color: 'text-red-500', bg: 'bg-red-500/10' },
        { title: 'Seiten', value: db.pages?.length || 0, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Produkte', value: db.products?.length || 0, icon: Box, color: 'text-brand-teal', bg: 'bg-brand-teal/10' },
        { title: 'Testimonials', value: db.testimonials?.length || 0, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { title: 'Blog-Posts', value: db.blog?.length || 0, icon: BookOpen, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    ];

    return (
        <div className="p-10 space-y-12">
            <div>
                <h1 className="text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Dashboard</h1>
                <p className="text-zinc-500 font-medium">Willkommen zurück! Hier ist eine Übersicht über Ihre Inhalte.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white dark:bg-zinc-900 p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-6">
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold uppercase tracking-wider">
                                <TrendingUp className="w-3 h-3" />
                                <span>+0%</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-1">{stat.title}</p>
                            <p className="text-3xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Letzte Aktivitäten</h2>
                        <button className="text-brand-teal text-sm font-bold flex items-center gap-1 hover:underline">
                            Alle sehen <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-6">
                        <p className="text-zinc-500 text-sm italic">Aktuell keine Aktivitäten verzeichnet.</p>
                    </div>
                </div>

                <div className="bg-brand-teal rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black uppercase mb-4 leading-tight">Mietpark online<br />verwalten.</h2>
                        <p className="text-white/80 font-medium mb-8 max-w-xs">Alle Änderungen werden sofort im Frontend für Ihre Kunden sichtbar.</p>
                        <button className="bg-white text-brand-dark px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">
                            Dokumentation lesen
                        </button>
                    </div>
                    <Box className="absolute -bottom-10 -right-10 w-64 h-64 text-white/10 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
                </div>
            </div>
        </div>
    );
}
