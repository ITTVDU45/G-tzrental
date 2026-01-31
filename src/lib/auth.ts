import { cookies } from 'next/headers';

export async function setSession(userId: string) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const cookieStore = await cookies();
    cookieStore.set('admin_session', userId, { expires, httpOnly: true, path: '/' });
}

export async function getSession() {
    const cookieStore = await cookies();
    return cookieStore.get('admin_session')?.value;
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
}
