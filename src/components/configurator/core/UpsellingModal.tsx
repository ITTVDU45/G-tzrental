import { Dialog } from "@headlessui/react";
import { useConfigurator } from "../state/ConfiguratorContext";
import { X, Check } from "lucide-react";
import Image from "next/image";

interface UpsellingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function UpsellingModal({ isOpen, onClose, onConfirm }: UpsellingModalProps) {
    const { state, dispatch } = useConfigurator();
    const upsellingProducts = state.configData?.upsellingProducts || [];

    if (upsellingProducts.length === 0) return null;

    const toggleProduct = (id: string) => {
        dispatch({ type: "TOGGLE_UPSELLING", payload: id });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            {/* The backdrop, rendered as a fixed sibling to the panel container */}
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" aria-hidden="true" />

            {/* Full-screen scrollable container */}
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-3xl rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <Dialog.Title className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                                    Darf es noch etwas mehr sein?
                                </Dialog.Title>
                                <Dialog.Description className="text-zinc-500 dark:text-zinc-400">
                                    Unsere Kunden leihen diese Produkte oft dazu.
                                </Dialog.Description>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* List of Upselling Products */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {upsellingProducts.map((product) => {
                                const isSelected = state.addedUpsellingIds.includes(product.id);
                                return (
                                    <div
                                        key={product.id}
                                        onClick={() => toggleProduct(product.id)}
                                        className={`
                                            cursor-pointer flex gap-4 p-4 rounded-2xl border-2 transition-all duration-300 relative group
                                            ${isSelected
                                                ? "border-brand-teal bg-brand-teal/5"
                                                : "border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:border-brand-teal/30"
                                            }
                                        `}
                                    >
                                        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white shrink-0">
                                            {product.image ? (
                                                <Image src={product.image} alt={product.title} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-xs">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            {product.badges?.map(b => (
                                                <span key={b} className="text-[10px] font-bold uppercase text-brand-teal mb-1">{b}</span>
                                            ))}
                                            <h4 className="font-bold text-zinc-900 dark:text-white mb-1">{product.title}</h4>
                                            <p className="text-xs text-zinc-500">Jetzt mit hinzufügen</p>
                                        </div>

                                        <div className={`
                                            absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                            ${isSelected ? "bg-brand-teal border-brand-teal text-white" : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900"}
                                        `}>
                                            {isSelected && <Check className="w-3 h-3" strokeWidth={3} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-end border-t border-zinc-100 dark:border-zinc-800 pt-6">
                            <button
                                onClick={onConfirm}
                                className="text-sm font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors py-2"
                            >
                                Nein danke, nur die Anfrage senden
                            </button>
                            <button
                                onClick={onConfirm}
                                className="bg-brand-teal text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-teal/20 hover:bg-brand-teal/90 hover:scale-105 transition-all"
                            >
                                {state.addedUpsellingIds.length > 0 ? "Hinzufügen & Absenden" : "Weiter zur Anfrage"}
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
