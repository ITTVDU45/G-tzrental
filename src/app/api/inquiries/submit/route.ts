import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const inquiryData = await req.json();
        const db = await readDb();

        // Initialize inquiries array if it doesn't exist
        if (!db.inquiries) {
            db.inquiries = [];
        }

        // Create new inquiry object
        const newInquiry = {
            id: 'inq-' + Date.now(),
            type: inquiryData.type || 'configurator', // 'configurator' or 'product'
            status: 'new',
            createdAt: new Date().toISOString(),

            // Contact Information
            customerName: inquiryData.contact?.name || '',
            customerEmail: inquiryData.contact?.email || '',
            customerPhone: inquiryData.contact?.phone || '',
            customerCompany: inquiryData.contact?.company || '',
            customerMessage: inquiryData.contact?.message || '',

            // Rental Details
            rentalStart: inquiryData.contact?.startDate || null,
            rentalEnd: inquiryData.contact?.endDate || null,
            location: inquiryData.contact?.location || '',
            delivery: inquiryData.contact?.delivery || false,

            // Product/Configuration Details
            categoryId: inquiryData.categoryId || null,
            categoryLabel: inquiryData.categoryLabel || '',
            deviceTypeId: inquiryData.deviceTypeId || null,
            deviceTypeLabel: inquiryData.deviceTypeLabel || '',

            // Selected Products
            selectedProducts: inquiryData.selectedProducts || [],

            // Requirements (from configurator sliders/selects)
            requirements: inquiryData.requirements || { sliders: {}, selects: {} },

            // Extras and Upselling
            selectedExtras: inquiryData.selectedExtras || [],
            upsellingProducts: inquiryData.upsellingProducts || [],

            // For direct product inquiries
            productId: inquiryData.productId || null,
            productName: inquiryData.productName || '',

            // Location context
            locationSlug: inquiryData.locationSlug || '',
            locationName: inquiryData.locationName || '',

            // Files (if any)
            files: inquiryData.files || []
        };

        db.inquiries.push(newInquiry);
        await writeDb(db);

        return NextResponse.json({
            success: true,
            inquiryId: newInquiry.id,
            message: 'Anfrage erfolgreich eingegangen'
        });
    } catch (error) {
        console.error('Error submitting inquiry:', error);
        return NextResponse.json(
            { success: false, error: 'Fehler beim Speichern der Anfrage' },
            { status: 500 }
        );
    }
}
