import { NextRequest, NextResponse } from "next/server";
import { getRentalCategoryPageDocument } from "@/lib/frontend-pages";
import { COLLECTIONS, listSeededCollection } from "@/lib/mongo-admin";
import { products as mockProducts } from "@/data/mockProducts";
import { I_Any } from "@/lib/types";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const [categories, products, pageDoc] = await Promise.all([
        listSeededCollection(COLLECTIONS.categories, "categories"),
        listSeededCollection(COLLECTIONS.products, "products", mockProducts),
        getRentalCategoryPageDocument(slug),
    ]);

    const decodedSlug = decodeURIComponent(slug).toLowerCase();
    const normalize = (str: string) => str.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss");
    const normalizedSlug = normalize(decodedSlug);

    const virtualCategories: Record<string, string[]> = {
        arbeitsbuehnen: ["Teleskopbühnen", "Scherenbühnen", "Gelenkteleskope", "Mastbühnen", "LKW-Bühnen", "Anhängerbühne", "Raupenbühnen", "Vertikalmastbüh", "Vertikalmastbühne"],
        stapler: ["Gabelstapler", "Geländestapler", "Telestapler", "Rotostapler", "Roto-Stapler"],
        baumaschinen: ["Minibagger", "Radlader", "Dumper", "Baumaschinen"],
    };

    const getVirtualCategoryKey = (value: string) => {
        if (value.includes("arbeitsbuehane") || value.includes("buehne") || virtualCategories.arbeitsbuehnen.some((c) => normalize(c).includes(value))) return "arbeitsbuehnen";
        if (value.includes("stapler") || value.includes("hubwagen") || virtualCategories.stapler.some((c) => normalize(c).includes(value))) return "stapler";
        if (value.includes("bagger") || value.includes("lader") || value.includes("baumaschine") || virtualCategories.baumaschinen.some((c) => normalize(c).includes(value))) return "baumaschinen";
        return null;
    };

    const foundCategory = categories.find((c: I_Any) => normalize(c.name) === normalizedSlug || (c.link && normalize(c.link).endsWith(normalizedSlug)));
    let virtualKey = null;

    if (!foundCategory) {
        virtualKey = virtualCategories[normalizedSlug] ? normalizedSlug : getVirtualCategoryKey(normalizedSlug);
    }

    let resultProducts: I_Any[] = [];
    const meta = {
        title: "",
        description: "",
        subcategories: [] as I_Any[],
    };

    if (foundCategory) {
        meta.title = foundCategory.name;
        meta.description = foundCategory.description || `Mieten Sie ${foundCategory.name} bei uns.`;

        const dbSubcategories = categories.filter((c: I_Any) => c.parentCategory === foundCategory.id);

        if (dbSubcategories.length > 0) {
            meta.subcategories = dbSubcategories.map((c: I_Any) => ({
                name: c.name,
                image: c.image,
                link: c.link,
            }));

            const subCategoryNames = dbSubcategories.map((c: I_Any) => c.name.toLowerCase());
            resultProducts = products.filter((p: I_Any) =>
                normalize(p.category) === normalize(foundCategory.name) ||
                (p.category && subCategoryNames.includes(p.category.toLowerCase())) ||
                (p.subcategory && subCategoryNames.includes(p.subcategory.toLowerCase()))
            );
        } else {
            resultProducts = products.filter((p: I_Any) => normalize(p.category) === normalize(foundCategory.name));

            const subs = new Set<string>();
            resultProducts.forEach((p: I_Any) => {
                if (p.subcategory) subs.add(p.subcategory);
            });

            meta.subcategories = Array.from(subs).map((name) => {
                const product = resultProducts.find((p: I_Any) => p.subcategory === name && p.image);
                return {
                    name,
                    image: product ? product.image : foundCategory.image,
                };
            });
        }
    } else if (virtualKey) {
        const includedNames = virtualCategories[virtualKey];

        if (virtualKey === "arbeitsbuehnen") {
            meta.title = "Arbeitsbühne mieten";
            meta.description = "Über 170 geprüfte Modelle – sicher, flexibel und sofort verfügbar für jeden Einsatz";
        } else if (virtualKey === "stapler") {
            meta.title = "Stapler mieten";
            meta.description = "Leistungsstarke Gabelstapler und Teleskoplader für jede Hubhöhe und Tragkraft";
        } else if (virtualKey === "baumaschinen") {
            meta.title = "Baumaschinen mieten";
            meta.description = "Robuste Bagger, Radlader und mehr für Ihre Baustelle";
        }

        resultProducts = products.filter((p: I_Any) =>
            includedNames.some((name) => normalize(p.category) === normalize(name))
        );

        meta.subcategories = categories
            .filter((c: I_Any) => includedNames.some((name) => normalize(c.name) === normalize(name)))
            .map((c: I_Any) => ({
                name: c.name,
                image: c.image,
            }));
    } else {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const responseMeta = pageDoc?.meta
        ? {
            title: pageDoc.meta.title || meta.title,
            description: pageDoc.meta.description || meta.description,
            subcategories: Array.isArray(pageDoc.meta.subcategories) && pageDoc.meta.subcategories.length > 0
                ? pageDoc.meta.subcategories
                : meta.subcategories,
        }
        : meta;

    return NextResponse.json({ meta: responseMeta, products: resultProducts, page: pageDoc });
}
