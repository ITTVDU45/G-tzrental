import { NextRequest, NextResponse } from "next/server";
import { COLLECTIONS, seedInquiries, upsertByBusinessId } from "@/lib/mongo-admin";

export async function POST(req: NextRequest) {
    try {
        const inquiryData = await req.json();
        await seedInquiries();

        const newInquiry = {
            id: `inq-${Date.now()}`,
            type: inquiryData.type || "configurator",
            status: "new",
            createdAt: new Date().toISOString(),
            customerName: inquiryData.contact?.name || "",
            customerEmail: inquiryData.contact?.email || "",
            customerPhone: inquiryData.contact?.phone || "",
            customerCompany: inquiryData.contact?.company || "",
            customerMessage: inquiryData.contact?.message || "",
            rentalStart: inquiryData.contact?.startDate || null,
            rentalEnd: inquiryData.contact?.endDate || null,
            location: inquiryData.contact?.location || "",
            delivery: inquiryData.contact?.delivery || false,
            categoryId: inquiryData.categoryId || null,
            categoryLabel: inquiryData.categoryLabel || "",
            deviceTypeId: inquiryData.deviceTypeId || null,
            deviceTypeLabel: inquiryData.deviceTypeLabel || "",
            selectedProducts: inquiryData.selectedProducts || [],
            requirements: inquiryData.requirements || { sliders: {}, selects: {} },
            selectedExtras: inquiryData.selectedExtras || [],
            upsellingProducts: inquiryData.upsellingProducts || [],
            productId: inquiryData.productId || null,
            productName: inquiryData.productName || "",
            locationSlug: inquiryData.locationSlug || "",
            locationName: inquiryData.locationName || "",
            files: inquiryData.files || [],
        };

        const saved = await upsertByBusinessId(COLLECTIONS.inquiries, newInquiry, () => newInquiry.id);

        return NextResponse.json({
            success: true,
            inquiryId: saved.id,
            message: "Anfrage erfolgreich eingegangen",
        });
    } catch (error) {
        console.error("Error submitting inquiry:", error);
        return NextResponse.json(
            { success: false, error: "Fehler beim Speichern der Anfrage" },
            { status: 500 }
        );
    }
}
