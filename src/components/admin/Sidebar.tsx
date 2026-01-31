"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Layers,
    Box,
    MessageSquare,
    BookOpen,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { title: 'Anfragen', icon: MessageSquare, href: '/admin/inquiries' },
    { title: 'Seiten', icon: FileText, href: '/admin/pages' },
    { title: 'Kategorien', icon: Layers, href: '/admin/categories' },
    { title: 'Produkte', icon: Box, href: '/admin/products' },
    { title: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials' },
    { title: 'Blog & Ratgeber', icon: BookOpen, href: '/admin/blog' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/admin/auth', {
            method: 'POST',
            body: JSON.stringify({ action: 'logout' }),
        });
        router.push('/admin/login');
    };

    // Don't show sidebar on login page
    if (pathname === '/admin/login') return null;

    return (
        <aside className="w-80 h-screen sticky top-0 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 flex flex-col z-50">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 bg-brand-teal rounded-xl flex items-center justify-center text-white font-black italic">
                        G
                    </div>
                    <div>
                        <h2 className="font-black text-zinc-900 dark:text-white uppercase tracking-tighter leading-tight">Götz Admin</h2>
                        <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">Content Manager</p>
                    </div>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group",
                                    isActive
                                        ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20"
                                        : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-zinc-400 group-hover:text-brand-teal")} />
                                    <span className="font-bold text-sm tracking-tight">{item.title}</span>
                                </div>
                                {isActive && (
                                    <motion.div layoutId="active-indicator">
                                        <ChevronRight className="w-4 h-4 opacity-50" />
                                    </motion.div>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-8 pt-0">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-zinc-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all duration-300 font-bold text-sm"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Abmelden</span>
                </button>
            </div>
        </aside>
    );
}
