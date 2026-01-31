"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ConditionalNavigation({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPage = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdminPage && <Header />}
            <main className={!isAdminPage ? "min-h-screen pt-20" : "min-h-screen"}>
                {children}
            </main>
            {!isAdminPage && <Footer />}
        </>
    );
}
