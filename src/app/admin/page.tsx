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
    TrendingUp,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <div className="p-6 lg:p-10 space-y-8 lg:space-y-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Dashboard</h1>
                    <p className="text-zinc-500 font-medium">Willkommen zurück! Hier ist Ihre Übersicht für heute.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl shadow-sm text-xs font-bold text-zinc-500">
                        {new Date().toLocaleDateString('de-DE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
                {stats.map((stat) => (
                    <div key={stat.title} className="bg-white dark:bg-zinc-900 p-5 lg:p-6 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:shadow-brand-teal/5 transition-all group">
                        <div className={cn("w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", stat.bg)}>
                            <stat.icon className={cn("w-5 h-5 lg:w-6 lg:h-6", stat.color)} />
                        </div>
                        <p className="text-[10px] lg:text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.title}</p>
                        <p className="text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6 lg:gap-10">
                <div className="lg:col-span-2 space-y-6 lg:space-y-10">
                    <div className="bg-white dark:bg-zinc-900 p-6 lg:p-8 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm min-h-[300px] flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-zinc-300" />
                        </div>
                        <h3 className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">Letzte Aktivitäten</h3>
                        <p className="text-zinc-500 text-sm max-w-sm">
                            Ihre Aktivitäten der letzten 24 Stunden werden hier in Kürze live angezeigt.
                        </p>
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
