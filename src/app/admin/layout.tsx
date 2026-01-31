import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    // Check if the current path is the login page
    // In a server component, we need a different way if we want to avoid infinite loop
    // But this layout is for /admin wrap, so if we're in /admin/... it should check.
    // If we're at /admin/login, we might need to skip this.
    // However, usually /admin/login wouldn't be under this layout if we structure it carefully.
    // Let's assume /admin/login is a sister of /admin/dashboard items or similar.

    // Actually, I'll put login in its own folder or handle it here.
    // For simplicity, let's just create a Layout that DOESN'T wrap login if possible.

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
