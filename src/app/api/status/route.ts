import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        system: 'Goetzrental API',
        status: 'operational',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        checks: {
            database: 'connected', /* Mock */
            cache: 'ready'
        }
    });
}
