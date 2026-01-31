"use client";

import Link from "next/link";
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Linkedin,
    Youtube,
    Clock,
    ArrowRight
} from "lucide-react";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-brand-dark dark:bg-black text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-brand-lime">Götz Rental</h3>
                        <p className="text-zinc-300 mb-6 leading-relaxed">
                            Ihr zuverlässiger Partner für Arbeitsbühnen, Stapler und Baumaschinen.
                            Über 22.000 Geräte deutschlandweit verfügbar.
                        </p>

                        {/* Social Media */}
                        <div className="flex gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-teal flex items-center justify-center transition-colors duration-300"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-teal flex items-center justify-center transition-colors duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-teal flex items-center justify-center transition-colors duration-300"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-brand-teal flex items-center justify-center transition-colors duration-300"
                                aria-label="YouTube"
                            >
                                <Youtube className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Schnellzugriff</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/mieten" className="text-zinc-300 hover:text-brand-lime transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>Geräte mieten</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/kaufen" className="text-zinc-300 hover:text-brand-lime transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>Geräte kaufen</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/ueber-uns" className="text-zinc-300 hover:text-brand-lime transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>Über uns</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/standorte" className="text-zinc-300 hover:text-brand-lime transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>Standorte</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-zinc-300 hover:text-brand-lime transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>Blog & Ratgeber</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="text-zinc-300 hover:text-brand-lime transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>FAQ</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Services</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/services/schulungen" className="text-zinc-300 hover:text-brand-lime transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>Schulungen</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/wartung" className="text-zinc-300 hover:text-brand-lime transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>Wartung & Service</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/beratung" className="text-zinc-300 hover:text-brand-lime transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>Beratung</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/transport" className="text-zinc-300 hover:text-brand-lime transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>Transport & Logistik</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/services/notdienst" className="text-zinc-300 hover:text-brand-lime transition-colors flex items-center gap-2 group">
                                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <span>24/7 Notdienst</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Kontakt</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="tel:+4912345678900" className="flex items-start gap-3 text-zinc-300 hover:text-brand-lime transition-colors group">
                                    <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <div className="font-semibold">+49 (0) 123 456 789-00</div>
                                        <div className="text-sm text-zinc-400">Mo-Fr 7:00-18:00 Uhr</div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="mailto:info@goetzrental.de" className="flex items-start gap-3 text-zinc-300 hover:text-brand-lime transition-colors group">
                                    <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <div>
                                        <div className="font-semibold">info@goetzrental.de</div>
                                        <div className="text-sm text-zinc-400">Wir antworten innerhalb 24h</div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <div className="flex items-start gap-3 text-zinc-300">
                                    <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <div className="font-semibold">Hauptsitz</div>
                                        <div className="text-sm text-zinc-400">
                                            Musterstraße 123<br />
                                            12345 Musterstadt
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="flex items-start gap-3 text-zinc-300">
                                    <Clock className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <div className="font-semibold">Öffnungszeiten</div>
                                        <div className="text-sm text-zinc-400">
                                            Mo-Fr: 7:00-18:00 Uhr<br />
                                            Sa: 8:00-14:00 Uhr
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 mb-8" />

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-400">
                    <div>
                        © {currentYear} Götz Rental. Alle Rechte vorbehalten.
                    </div>

                    <div className="flex flex-wrap gap-6 justify-center">
                        <Link href="/impressum" className="hover:text-brand-lime transition-colors">
                            Impressum
                        </Link>
                        <Link href="/datenschutz" className="hover:text-brand-lime transition-colors">
                            Datenschutz
                        </Link>
                        <Link href="/agb" className="hover:text-brand-lime transition-colors">
                            AGB
                        </Link>
                        <Link href="/cookies" className="hover:text-brand-lime transition-colors">
                            Cookie-Einstellungen
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
