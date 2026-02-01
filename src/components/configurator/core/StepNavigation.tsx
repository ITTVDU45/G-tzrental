import { ArrowLeft, ArrowRight } from "lucide-react";

interface StepNavigationProps {
    onBack?: () => void;
    onNext: () => void;
    canNext: boolean;
    isLastStep?: boolean;
    isSubmitting?: boolean;
    nextLabel?: string;
}

export default function StepNavigation({
    onBack,
    onNext,
    canNext,
    isLastStep = false,
    isSubmitting = false,
    nextLabel
}: StepNavigationProps) {
    return (
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-zinc-100 dark:border-zinc-800">
            <div>
                {onBack && (
                    <button
                        onClick={onBack}
                        disabled={isSubmitting}
                        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors font-medium px-4 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Zurück
                    </button>
                )}
            </div>

            <button
                onClick={onNext}
                disabled={!canNext || isSubmitting}
                className={`
                    flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-teal/20 transition-all duration-300
                    ${!canNext || isSubmitting
                        ? "bg-zinc-200 text-zinc-400 dark:bg-zinc-800 cursor-not-allowed shadow-none"
                        : "bg-brand-teal text-white hover:bg-brand-teal/90 hover:scale-105 active:scale-95"
                    }
                `}
            >
                {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        {nextLabel || (isLastStep ? "Anfrage absenden" : "Weiter")}
                        {!isLastStep && <ArrowRight className="w-4 h-4" />}
                    </>
                )}
            </button>
        </div>
    );
}
