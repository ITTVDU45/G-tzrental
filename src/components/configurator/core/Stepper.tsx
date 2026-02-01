import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepperProps {
    currentStep: number;
    steps: { key: string; title: string }[];
}

export default function Stepper({ currentStep, steps }: StepperProps) {
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div className="w-full mb-8">
            {/* Mobile simplified view */}
            <div className="flex md:hidden items-center justify-between mb-2">
                <span className="text-sm font-bold text-brand-teal">
                    Schritt {currentStep} von {steps.length}
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                    {steps[currentStep - 1]?.title}
                </span>
            </div>

            <div className="relative">
                {/* Background Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-200 dark:bg-zinc-800 -translate-y-1/2 rounded-full" />

                {/* Active Progress Line */}
                <motion.div
                    className="absolute top-1/2 left-0 h-1 bg-brand-teal -translate-y-1/2 rounded-full z-0"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                />

                {/* Steps Circles */}
                <div className="relative flex justify-between items-center z-10">
                    {steps.map((step, index) => {
                        const stepNum = index + 1;
                        const isActive = stepNum === currentStep;
                        const isCompleted = stepNum < currentStep;

                        return (
                            <div key={step.key} className="flex flex-col items-center">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: isActive ? 1.1 : 1,
                                        borderColor: isCompleted || isActive ? "#008080" : "#E5E7EB", // brand-teal or zinc-200
                                        backgroundColor: isCompleted || isActive ? (isCompleted ? "#008080" : "#FFFFFF") : "#FFFFFF",
                                    }}
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${isCompleted ? "text-white" : isActive ? "text-brand-teal" : "text-zinc-300 dark:text-zinc-600 dark:bg-zinc-900 dark:border-zinc-800"
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Check className="w-4 h-4" strokeWidth={3} />
                                    ) : (
                                        <span className="text-xs font-bold">{stepNum}</span>
                                    )}
                                </motion.div>
                                <span className={`hidden md:block absolute top-10 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${isActive ? "text-brand-teal" : isCompleted ? "text-zinc-900 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-600"
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
