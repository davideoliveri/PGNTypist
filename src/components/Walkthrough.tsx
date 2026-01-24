import React, { useState, useEffect, useCallback } from 'react';
import { type Language, t } from '../logic/localization';
import './Walkthrough.css';

interface WalkthroughProps {
    isOpen: boolean;
    onComplete: () => void;
    onSkip: () => void;
    lang: Language;
}

interface WalkthroughStep {
    id: string;
    targetSelector?: string;
    position: 'center' | 'top' | 'bottom' | 'auto';
}

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
    { id: 'welcome', position: 'center' },
    { id: 'enterMoves', targetSelector: '#move-input', position: 'auto' },
    { id: 'navigation', targetSelector: '.move-list', position: 'auto' },
    { id: 'editing', targetSelector: '.move-list', position: 'auto' },
    { id: 'comments', targetSelector: '#comment-input', position: 'auto' },
    { id: 'deleteMenu', targetSelector: '.move-list', position: 'auto' },
    { id: 'export', targetSelector: 'footer', position: 'auto' },
    { id: 'done', position: 'center' },
];

export const Walkthrough: React.FC<WalkthroughProps> = ({ isOpen, onComplete, onSkip, lang }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

    const step = WALKTHROUGH_STEPS[currentStep];

    // Reset to step 0 when walkthrough opens
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
        }
    }, [isOpen]);

    // Update highlight position and scroll element into view
    useEffect(() => {
        if (!isOpen || !step.targetSelector) {
            setHighlightRect(null);
            return;
        }

        const el = document.querySelector(step.targetSelector);
        if (el) {
            // Scroll element into view
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Wait for scroll to complete then update rect
            const updateRect = () => {
                const rect = el.getBoundingClientRect();
                setHighlightRect(rect);
            };

            // Initial update after a short delay to allow scroll
            const timeout = setTimeout(updateRect, 300);

            window.addEventListener('resize', updateRect);
            window.addEventListener('scroll', updateRect);

            return () => {
                clearTimeout(timeout);
                window.removeEventListener('resize', updateRect);
                window.removeEventListener('scroll', updateRect);
            };
        }
    }, [isOpen, step, currentStep]);

    const handleNext = useCallback(() => {
        if (currentStep < WALKTHROUGH_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete();
        }
    }, [currentStep, onComplete]);

    const handlePrev = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onSkip();
            } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleNext, handlePrev, onSkip]);

    if (!isOpen) return null;

    const isLastStep = currentStep === WALKTHROUGH_STEPS.length - 1;
    const isFirstStep = currentStep === 0;

    // Calculate tooltip position - must remain dynamic
    const getTooltipStyle = (): React.CSSProperties => {
        const tooltipHeight = 280;
        const tooltipWidth = 320;
        const padding = 16;
        const isMobile = window.innerWidth <= 640;

        if (!highlightRect || step.position === 'center') {
            return {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            };
        }

        const spaceAbove = highlightRect.top;
        const spaceBelow = window.innerHeight - highlightRect.bottom;

        const horizontalStyle: React.CSSProperties = isMobile
            ? { left: '50%', transform: 'translateX(-50%)' }
            : {
                left: Math.max(padding, Math.min(
                    highlightRect.left + (highlightRect.width / 2) - (tooltipWidth / 2),
                    window.innerWidth - tooltipWidth - padding
                )),
                transform: 'none'
            };

        const elementCenter = highlightRect.top + highlightRect.height / 2;
        const screenCenter = window.innerHeight / 2;
        const elementInTopHalf = elementCenter < screenCenter;

        if (elementInTopHalf && spaceBelow > tooltipHeight + padding) {
            return {
                position: 'fixed',
                top: highlightRect.bottom + padding,
                ...horizontalStyle,
            };
        } else if (!elementInTopHalf && spaceAbove > tooltipHeight + padding) {
            return {
                position: 'fixed',
                bottom: window.innerHeight - highlightRect.top + padding,
                ...horizontalStyle,
            };
        } else if (spaceBelow > spaceAbove) {
            return {
                position: 'fixed',
                bottom: padding,
                left: '50%',
                transform: 'translateX(-50%)',
            };
        } else {
            return {
                position: 'fixed',
                top: padding + 50,
                left: '50%',
                transform: 'translateX(-50%)',
            };
        }
    };

    return (
        <div className="walkthrough-overlay">
            {/* Always visible close button */}
            <button
                onClick={onSkip}
                className="walkthrough-close-btn"
                aria-label="Close walkthrough"
            >
                ×
            </button>

            {/* Dark overlay with cutout for highlighted element */}
            <svg className="walkthrough-svg">
                <defs>
                    <mask id="walkthrough-mask">
                        <rect x="0" y="0" width="100%" height="100%" fill="white" />
                        {highlightRect && (
                            <rect
                                x={highlightRect.left - 4}
                                y={highlightRect.top - 4}
                                width={highlightRect.width + 8}
                                height={highlightRect.height + 8}
                                rx="8"
                                fill="black"
                            />
                        )}
                    </mask>
                </defs>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="rgba(0, 0, 0, 0.75)"
                    mask="url(#walkthrough-mask)"
                />
            </svg>

            {/* Highlight border */}
            {highlightRect && (
                <div
                    className="walkthrough-highlight"
                    style={{
                        left: highlightRect.left - 4,
                        top: highlightRect.top - 4,
                        width: highlightRect.width + 8,
                        height: highlightRect.height + 8,
                    }}
                />
            )}

            {/* Tooltip */}
            <div
                className="walkthrough-tooltip"
                style={getTooltipStyle()}
            >
                {/* Step indicator */}
                <div className="walkthrough-dots">
                    {WALKTHROUGH_STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`walkthrough-dot ${i === currentStep ? 'walkthrough-dot--active' : ''}`}
                        />
                    ))}
                </div>

                {/* Content */}
                <h3 className="walkthrough-title">
                    {t(lang, `walkthrough.${step.id}.title`)}
                </h3>
                <p className="walkthrough-description">
                    {t(lang, `walkthrough.${step.id}.description`)}
                </p>

                {/* Buttons */}
                <div className="walkthrough-actions">
                    {!isFirstStep && (
                        <button
                            onClick={handlePrev}
                            className="walkthrough-btn walkthrough-btn--secondary"
                        >
                            {t(lang, 'walkthrough.back')}
                        </button>
                    )}
                    {isFirstStep && (
                        <button
                            onClick={onSkip}
                            className="walkthrough-btn walkthrough-btn--secondary"
                        >
                            {t(lang, 'walkthrough.skip')}
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        className="walkthrough-btn walkthrough-btn--primary"
                    >
                        {isLastStep ? t(lang, 'walkthrough.finish') : t(lang, 'walkthrough.next')}
                    </button>
                </div>
            </div>
        </div>
    );
};
