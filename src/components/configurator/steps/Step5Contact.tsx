"use client";

import { useConfigurator } from "../state/ConfiguratorContext";
import StepNavigation from "../core/StepNavigation";
import { UploadCloud } from "lucide-react";

export default function Step5Contact() {
    const { state, dispatch } = useConfigurator();
    const contact = state.contact;

    const update = (field: string, value: any) => {
        dispatch({
            type: "UPDATE_CONTACT",
            payload: { [field]: value }
        });
    };

    const isValid = contact.name && contact.email && contact.phone && contact.startDate && contact.endDate;

    return (
        <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
                <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">
                    Wann und Wohin?
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                    Verrate uns die Eckdaten deines Projekts.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column: Dates & Location */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-4">
                        Einsatzdaten
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Mietbeginn *</label>
                            <input
                                type="date"
                                value={contact.startDate ? new Date(contact.startDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => update('startDate', new Date(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Mietende *</label>
                            <input
                                type="date"
                                value={contact.endDate ? new Date(contact.endDate).toISOString().split('T')[0] : ''}
                                onChange={(e) => update('endDate', new Date(e.target.value))}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-zinc-500 uppercase tracking-wider">Einsatzort / Straße</label>
                        <input
                            type="text"
                            placeholder="Musterbaustelle 1"
                            value={contact.location}
                            onChange={(e) => update('location', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                        <input
                            type="checkbox"
                            checked={contact.delivery}
                            onChange={(e) => update('delivery', e.target.checked)}
                            className="w-5 h-5 rounded text-brand-teal focus:ring-brand-teal"
                        />
                        <span className="text-zinc-700 dark:text-zinc-300 font-medium">Lieferung zur Baustelle gewünscht</span>
                    </div>

                    {/* Upload Placeholder */}
                    <div className="p-6 border-2 border-dashed border-zinc-200 dark:border-zinc-700 rounded-2xl flex flex-col items-center justify-center text-center text-zinc-400 hover:border-brand-teal/50 hover:bg-brand-teal/5 transition-all cursor-pointer">
                        <UploadCloud className="w-8 h-8 mb-2" />
                        <span className="text-sm font-bold">Baustellenfotos hochladen (opt)</span>
                    </div>
                </div>

                {/* Right Column: Contact Data */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-4">
                        Kontaktdaten
                    </h3>

                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            placeholder="Firma (Optional)"
                            value={contact.company}
                            onChange={(e) => update('company', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        />
                        <input
                            type="text"
                            placeholder="Ansprechpartner *"
                            value={contact.name}
                            onChange={(e) => update('name', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="email"
                                placeholder="E-Mail adresse *"
                                value={contact.email}
                                onChange={(e) => update('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                            />
                            <input
                                type="tel"
                                placeholder="Telefonnummer *"
                                value={contact.phone}
                                onChange={(e) => update('phone', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal"
                            />
                        </div>
                        <textarea
                            rows={3}
                            placeholder="Ihre Nachricht an uns..."
                            value={contact.message}
                            onChange={(e) => update('message', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none"
                        />
                    </div>
                </div>
            </div>

            <StepNavigation
                onNext={() => dispatch({ type: "NEXT_STEP" })}
                onBack={() => dispatch({ type: "PREV_STEP" })}
                canNext={!!isValid}
            />
        </div>
    );
}
