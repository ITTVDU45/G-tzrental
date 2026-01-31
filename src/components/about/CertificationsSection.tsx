"use client";

import { Award, Leaf, Users } from "lucide-react";

const certifications = [
    {
        title: "Qualitätsmanagement",
        iso: "ISO 9001",
        desc: "Unsere Qualitätspolitik basiert auf einer partnerschaftlichen und langfristigen Zusammenarbeit. Zertifiziert durch GUTcert.",
        icon: Award,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
        title: "Arbeitsschutz",
        iso: "ISO 45001",
        desc: "Umfassende Vermeidung von Arbeitsunfällen und aktive Sensibilisierung der Belegschaft für Sicherheit.",
        icon: Users,
        color: "text-orange-500",
        bg: "bg-orange-50 dark:bg-orange-900/20"
    },
    {
        title: "Energiemanagement",
        iso: "ISO 50001",
        desc: "Nachhaltiger Beitrag zum Umweltschutz. Steigerung der Energieeffizienz und Senkung der CO2-Emissionen.",
        icon: Leaf,
        color: "text-green-500",
        bg: "bg-green-50 dark:bg-green-900/20"
    }
];

export function CertificationsSection() {
    return (
        <div className="container mx-auto px-6 mb-32">
            <div className="bg-zinc-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-teal/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 max-w-3xl">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Zertifizierte Exzellenz</h2>
                    <p className="text-xl text-zinc-300 mb-12 leading-relaxed">
                        Unsere Unternehmenspolitik basiert auf hohen Standards in den Bereichen Qualität, Arbeitssicherheit und Umweltschutz. Diese Zertifikate belegen unser Engagement für höchste Effizienz, Sicherheit und Nachhaltigkeit.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    {certifications.map((cert, idx) => (
                        <div key={idx} className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors">
                            <div className={`w-12 h-12 rounded-xl ${cert.bg} ${cert.color} flex items-center justify-center mb-6`}>
                                <cert.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{cert.title}</h3>
                            <div className="text-sm font-mono text-brand-lime mb-4">{cert.iso}</div>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                {cert.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
