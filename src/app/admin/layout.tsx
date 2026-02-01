import { getSession } from '@/lib/auth';
import Sidebar from '@/components/admin/Sidebar';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 flex-col lg:flex-row">
            {session && <Sidebar />}
            <main className="flex-1 overflow-auto pt-16 lg:pt-0">
                <div className="min-h-[calc(100vh-4rem)] lg:min-h-screen relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
