"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    Layers,
    Box,
    MessageSquare,
    BookOpen,
    LogOut,
    ChevronRight,
    Menu,
    X,
    Image as ImageIcon,
    MapPin,
    Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { title: 'Mediathek', icon: ImageIcon, href: '/admin/media' },
    { title: 'Anfragen', icon: MessageSquare, href: '/admin/inquiries' },
    { title: 'Standorte', icon: MapPin, href: '/admin/pages' },
    { title: 'Kategorien', icon: Layers, href: '/admin/categories' },
    { title: 'Produkte', icon: Box, href: '/admin/products' },
    { title: 'Zusatzleistungen', icon: Tag, href: '/admin/addons' },
    { title: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials' },
    { title: 'Konfigurator', icon: Layers, href: '/admin/configurator' },
    { title: 'Blog & Ratgeber', icon: BookOpen, href: '/admin/blog' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        await fetch('/api/admin/auth', {
            method: 'POST',
            body: JSON.stringify({ action: 'logout' }),
        });
        router.push('/admin/login');
    };

    // Auto-close on path change (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    if (pathname === '/admin/login') return null;

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
            <div className="p-8">
                <div className="mb-10 relative">
                    <div className="relative w-full h-16">
                        <Image
                            src="/GötzRental2.png"
                            alt="Götz Rental Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden absolute top-0 right-0 p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
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
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-zinc-500 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 transition-all duration-300 font-bold text-sm shadow-sm border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Abmelden</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-6 z-[60]">
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                        <Image
                            src="/GötzRental2.png"
                            alt="Götz Rental Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-white"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {/* Desktop Persistent Sidebar */}
            <aside className="hidden lg:flex w-80 h-screen sticky top-0 bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800 flex-col z-50">
                <SidebarContent />
            </aside>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-zinc-900 z-[80] shadow-2xl lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
