import { Button } from "@/shared/components/ui/Button";
import React, { useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import FormGenerator from '../FormGenerator';
import { generateZodSchema } from '../schemaUtils';
import Card from '@/shared/components/layout/Card';
import type { FormField } from '../form.types';
import { ChevronLeft, ChevronRight, Check, type LucideIcon } from 'lucide-react';

interface Step {
    id: string;
    label: string;
    fields: FormField[];
}

interface MultiStepFormProps {
    steps: Step[];
    onSubmit: (data: Record<string, unknown>) => void;
    onCancel?: () => void;
    gridColumn?: 1 | 2 | 3 | 4 | 5 | 6;
    title?: string;
    icon?: LucideIcon;
}

const MultiStepForm: React.FC<Readonly<MultiStepFormProps>> = ({
    steps,
    onSubmit,
    onCancel,
    gridColumn = 2,
    title = "Multi-Step Form",
    icon: Icon,
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());


    const allFields = useMemo(() => steps.flatMap(step => step.fields), [steps]);
    const schema = useMemo(() => generateZodSchema(allFields), [allFields]);

    const computedDefaultValues = useMemo(() => {
        const defaults: Record<string, unknown> = {};
        allFields.forEach(field => {
            if (field.type === 'multiselect') {
                defaults[field.name] = [];
            } else if (field.type === 'checkbox') {
                defaults[field.name] = false;
            } else if (field.type === 'number') {
                defaults[field.name] = undefined;
            } else {
                defaults[field.name] = '';
            }
        });
        return defaults;
    }, [allFields]);

    const methods = useForm<Record<string, unknown>>({
        defaultValues: computedDefaultValues,
        resolver: zodResolver(schema),
        mode: 'onChange',
    });

    const { handleSubmit, trigger } = methods;

    const handleNext = async () => {
        const currentStepFields = steps[currentStep].fields.map(f => f.name);
        const isValid = await trigger(currentStepFields);

        if (isValid) {
            setCompletedSteps(prev => new Set([...prev, currentStep]));
            if (currentStep < steps.length - 1) {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleFormSubmit = (data: Record<string, unknown>) => {
        onSubmit(data);
    };

    const currentStepData = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;

    const canOpenStep = (index: number) => index <= Math.max(...completedSteps, currentStep);

    return (
        <Card title={title} icon={Icon}>
            <div className="space-y-6">
                {/* Stepper (hims-ui-new Navigation/Stepper) */}
                <ol className="ui-stepper" aria-label="Progress">
                    {steps.map((step, index) => {
                        const done = completedSteps.has(index) && index !== currentStep;
                        const active = index === currentStep;
                        const clickable = canOpenStep(index);
                        let stateLabel = "";
                        if (done) stateLabel = " (completed)";
                        else if (active) stateLabel = " (current)";
                        return (
                            <li key={step.id} className="ui-stepper__step" aria-current={active ? "step" : undefined}>
                                <div className="ui-stepper__head">
                                    <button
                                        type="button"
                                        disabled={!clickable}
                                        onClick={() => setCurrentStep(index)}
                                        aria-label={`Step ${index + 1}: ${step.label}${stateLabel}`}
                                        className={`ui-stepper__dot ${done ? "is-done" : ""} ${active ? "is-active" : ""}`}
                                    >
                                        {done ? <Check size={16} strokeWidth={3} /> : index + 1}
                                    </button>
                                    {index < steps.length - 1 && <span aria-hidden className={`ui-stepper__line ${completedSteps.has(index) ? "is-done" : ""}`} />}
                                </div>
                                <p className={`ui-stepper__label ${active ? "is-active" : ""}`}>{step.label}</p>
                            </li>
                        );
                    })}
                </ol>

                {/* Form Content */}
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                        <div className="ui-stepper__panel">
                            <div className="mb-5">
                                <h3 className="ui-card__title">{currentStepData.label}</h3>
                                <p className="ui-help mt-0.5">Step {currentStep + 1} of {steps.length}</p>
                            </div>
                            <FormGenerator
                                fields={currentStepData.fields}
                                onSubmit={() => { }}
                                gridColumns={gridColumn}
                                standalone={true}
                            />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between gap-2 border-t border-border pt-4">
                            <Button variant="outline" leftIcon={ChevronLeft} onClick={handlePrevious} disabled={isFirstStep}>
                                Previous
                            </Button>

                            <div className="flex-1" />

                            {onCancel && (
                                <Button variant="ghost" onClick={onCancel}>
                                    Cancel
                                </Button>
                            )}

                            {isLastStep ? (
                                <Button type="submit" variant="success" leftIcon={Check}>
                                    Submit
                                </Button>
                            ) : (
                                <Button variant="primary" rightIcon={ChevronRight} onClick={handleNext}>
                                    Next
                                </Button>
                            )}
                        </div>
                    </form>
                </FormProvider>
            </div>
        </Card>
    );
};

export default MultiStepForm;
