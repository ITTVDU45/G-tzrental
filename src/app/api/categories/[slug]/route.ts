import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const db = await readDb();

    if (!db) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    const { categories, products } = db;
    const decodedSlug = decodeURIComponent(slug).toLowerCase();

    // Normalization helper (same as in frontend)
    const normalize = (str: string) => str.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss');
    const normalizedSlug = normalize(decodedSlug);

    // Virtual Categories Mapping
    const virtualCategories: Record<string, string[]> = {
        'arbeitsbuehnen': ['Teleskopbühnen', 'Scherenbühnen', 'Gelenkteleskope', 'Mastbühnen', 'LKW-Bühnen', 'Anhängerbühne', 'Raupenbühnen', 'Vertikalmastbüh', 'Vertikalmastbühne'],
        'stapler': ['Gabelstapler', 'Geländestapler', 'Telestapler', 'Rotostapler', 'Roto-Stapler'],
        'baumaschinen': ['Minibagger', 'Radlader', 'Dumper', 'Baumaschinen']
    };

    // Helper to check if a slug matches a virtual category
    const getVirtualCategoryKey = (s: string) => {
        if (s.includes('arbeitsbuehane') || s.includes('buehne') || virtualCategories['arbeitsbuehnen'].some(c => normalize(c).includes(s))) return 'arbeitsbuehnen';
        if (s.includes('stapler') || s.includes('hubwagen') || virtualCategories['stapler'].some(c => normalize(c).includes(s))) return 'stapler';
        if (s.includes('bagger') || s.includes('lader') || s.includes('baumaschine') || virtualCategories['baumaschinen'].some(c => normalize(c).includes(s))) return 'baumaschinen';
        return null;
    };

    // 1. Try to find direct category match in DB
    let foundCategory = categories.find((c: any) => normalize(c.name) === normalizedSlug || (c.link && normalize(c.link).endsWith(normalizedSlug)));

    // 2. If not found, check if it is a virtual category container
    let virtualKey = null;
    if (!foundCategory) {
        if (virtualCategories[normalizedSlug]) {
            virtualKey = normalizedSlug;
        } else {
            virtualKey = getVirtualCategoryKey(normalizedSlug);
        }
    }

    let resultProducts = [];
    let meta = {
        title: '',
        description: '',
        subcategories: [] as any[]
    };

    if (foundCategory) {
        // Single Category Mode
        meta.title = foundCategory.name;
        meta.description = foundCategory.description || `Mieten Sie ${foundCategory.name} bei uns.`;

        // Find DB subcategories (new system)
        const dbSubcategories = categories.filter((c: any) => c.parentCategory === foundCategory.id);

        if (dbSubcategories.length > 0) {
            meta.subcategories = dbSubcategories.map((c: any) => ({
                name: c.name,
                image: c.image,
                link: c.link
            }));

            // Filter products: Include products from this category AND all subcategories
            const subCategoryNames = dbSubcategories.map((c: any) => c.name.toLowerCase());
            resultProducts = products.filter((p: any) =>
                normalize(p.category) === normalize(foundCategory.name) ||
                (p.category && subCategoryNames.includes(p.category.toLowerCase())) ||
                (p.subcategory && subCategoryNames.includes(p.subcategory.toLowerCase()))
            );

        } else {
            // Legacy Mode: Filter just by this category
            resultProducts = products.filter((p: any) =>
                normalize(p.category) === normalize(foundCategory.name)
            );

            // Subcategories from product 'subcategory' string fields
            const subs = new Set<string>();
            resultProducts.forEach((p: any) => {
                if (p.subcategory) subs.add(p.subcategory);
            });

            meta.subcategories = Array.from(subs).map(name => {
                const prod = resultProducts.find((p: any) => p.subcategory === name && p.image);
                return {
                    name,
                    image: prod ? prod.image : foundCategory.image
                };
            });
        }


    } else if (virtualKey) {
        // Virtual Category Mode
        const includedNames = virtualCategories[virtualKey];

        // Meta titles/descriptions (hardcoded fallback like in current frontend)
        if (virtualKey === 'arbeitsbuehnen') {
            meta.title = "Arbeitsbühne mieten";
            meta.description = "Über 170 geprüfte Modelle – sicher, flexibel und sofort verfügbar für jeden Einsatz";
        } else if (virtualKey === 'stapler') {
            meta.title = "Stapler mieten";
            meta.description = "Leistungsstarke Gabelstapler und Teleskoplader für jede Hubhöhe und Tragkraft";
        } else if (virtualKey === 'baumaschinen') {
            meta.title = "Baumaschinen mieten";
            meta.description = "Robuste Bagger, Radlader und mehr für Ihre Baustelle";
        }

        resultProducts = products.filter((p: any) =>
            includedNames.some(name => normalize(p.category) === normalize(name))
        );

        // Subcategories are the distinct categories in this group
        // We can get them from the DB categories list that match the virtual group
        meta.subcategories = categories.filter((c: any) =>
            includedNames.some(name => normalize(c.name) === normalize(name))
        ).map((c: any) => ({
            name: c.name,
            image: c.image
        }));
    } else {
        // Fallback for completely unknown slug but user wants "test" to work if it is in DB
        // If "test" is in DB categories, it should have been caught in step 1.
        // If the user created "test" category in DB, foundCategory should be set.
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({
        meta,
        products: resultProducts
    });
}
