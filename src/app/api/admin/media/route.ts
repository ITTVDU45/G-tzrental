import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getSession } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
    try {
        await fs.access(UPLOAD_DIR);
    } catch {
        await fs.mkdir(UPLOAD_DIR, { recursive: true });
    }
}

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await ensureUploadDir();
    const files = await fs.readdir(UPLOAD_DIR);

    const media = files.map(file => ({
        name: file,
        url: `/uploads/${file}`,
        size: 0, // Could get actual size if needed
        type: path.extname(file).slice(1)
    })).filter(item => ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(item.type.toLowerCase()));

    return NextResponse.json(media);
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        await ensureUploadDir();
        await fs.writeFile(filePath, buffer);

        return NextResponse.json({
            success: true,
            url: `/uploads/${fileName}`,
            name: fileName
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name } = await req.json();
        const filePath = path.join(UPLOAD_DIR, name);
        await fs.unlink(filePath);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
    }
}
