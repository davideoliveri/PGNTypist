import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { type Language, t } from '../../../services/localization';
import { usePersistedState } from '../../../hooks/usePersistedState';
import { STORAGE_KEYS } from '../../../services/storage';
import './Walkthrough.css';

export interface WalkthroughHandle {
    start: () => void;
}

interface WalkthroughProps {
    onComplete?: () => void;
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

export const Walkthrough = forwardRef<WalkthroughHandle, WalkthroughProps>(({ onComplete, lang }, ref) => {
    // Own the visibility state with persistence
    const [hasCompleted, setHasCompleted] = usePersistedState(STORAGE_KEYS.WALKTHROUGH, false);
    const [isOpen, setIsOpen] = useState(!hasCompleted);
    const [currentStep, setCurrentStep] = useState(0);
    const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

    const step = WALKTHROUGH_STEPS[currentStep];

    // Expose start method for external triggering (e.g., from HelpModal)
    useImperativeHandle(ref, () => ({
        start: () => {
            setHasCompleted(false);
            setCurrentStep(0);
            setIsOpen(true);
        }
    }), [setHasCompleted]);

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

    const handleComplete = useCallback(() => {
        setHasCompleted(true);
        setIsOpen(false);
        onComplete?.();
    }, [setHasCompleted, onComplete]);

    const handleSkip = useCallback(() => {
        setHasCompleted(true);
        setIsOpen(false);
        onComplete?.();
    }, [setHasCompleted, onComplete]);

    const handleNext = useCallback(() => {
        if (currentStep < WALKTHROUGH_STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleComplete();
        }
    }, [currentStep, handleComplete]);

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
                handleSkip();
            } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, handleNext, handlePrev, handleSkip]);

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
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
            };
        }

        // Position below or above target based on available space
        const spaceBelow = window.innerHeight - highlightRect.bottom;
        const spaceAbove = highlightRect.top;

        let top: number;
        if (step.position === 'bottom' || (step.position === 'auto' && spaceBelow > tooltipHeight + padding)) {
            top = highlightRect.bottom + padding;
        } else if (step.position === 'top' || spaceAbove > tooltipHeight + padding) {
            top = highlightRect.top - tooltipHeight - padding;
        } else {
            // Fallback to center
            top = window.innerHeight / 2 - tooltipHeight / 2;
        }

        // Center horizontally, but keep within bounds
        let left = highlightRect.left + highlightRect.width / 2 - tooltipWidth / 2;
        if (isMobile) {
            left = padding;
        } else {
            left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding));
        }

        return {
            position: 'fixed',
            left: `${left}px`,
            top: `${top}px`,
        };
    };

    return (
        <div
            className="walkthrough-overlay"
        >
            {/* Always visible close button */}
            <button
                className="walkthrough-close-btn"
                onClick={handleSkip}
            >
                ✕
            </button>

            {/* SVG Mask for darkening everything except target */}
            <svg
                className="walkthrough-svg"
            >
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
                            onClick={handleSkip}
                            className="walkthrough-btn walkthrough-btn--secondary"
                        >
                            {t(lang, 'walkthrough.skip')}
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        className="walkthrough-btn walkthrough-btn--primary"
                    >
                        {isLastStep ? t(lang, 'help.close') : t(lang, 'walkthrough.next')}
                    </button>
                </div>
            </div>
        </div>
    );
});
