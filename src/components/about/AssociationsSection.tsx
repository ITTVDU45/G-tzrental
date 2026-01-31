"use client";

const associations = [
    "European Rental Association (ERA)",
    "Bundesverband der Baumaschinen-Firmen (bbi)",
    "Verband Garten-, Landschafts- und Sportplatzbau (VGL)",
    "Born to Lift e.V",
    "GDD e.V.",
    "VDBUM e.V.",
    "IPAF"
];

export function AssociationsSection() {
    return (
        <div className="container mx-auto px-6 pb-24 text-center">
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-12">Mitwirkung in Verbänden</p>
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                {associations.map((assoc, i) => (
                    <div key={i} className="px-6 py-3 rounded-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-medium">
                        {assoc}
                    </div>
                ))}
            </div>
        </div>
    );
}
