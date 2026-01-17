import React, { useState, useEffect, useCallback } from 'react';
import { type Language, t } from '../logic/localization';

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
    { id: 'enterMoves', targetSelector: 'input[type="text"]', position: 'auto' },
    { id: 'navigation', targetSelector: '.move-list', position: 'auto' },
    { id: 'editing', targetSelector: '.move-list', position: 'auto' },
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

    // Calculate tooltip position - improved for mobile
    const getTooltipStyle = (): React.CSSProperties => {
        const tooltipHeight = 280; // approximate height
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

        // Determine best position: above or below the element
        const spaceAbove = highlightRect.top;
        const spaceBelow = window.innerHeight - highlightRect.bottom;

        // Common horizontal style
        const horizontalStyle: React.CSSProperties = isMobile
            ? { left: '50%', transform: 'translateX(-50%)' }
            : {
                left: Math.max(padding, Math.min(
                    highlightRect.left + (highlightRect.width / 2) - (tooltipWidth / 2),
                    window.innerWidth - tooltipWidth - padding
                )),
                transform: 'none'
            };

        // If element is in top half of screen, put tooltip at bottom
        // If element is in bottom half of screen, put tooltip at top
        const elementCenter = highlightRect.top + highlightRect.height / 2;
        const screenCenter = window.innerHeight / 2;
        const elementInTopHalf = elementCenter < screenCenter;

        if (elementInTopHalf && spaceBelow > tooltipHeight + padding) {
            // Element in top half, put tooltip below
            return {
                position: 'fixed',
                top: highlightRect.bottom + padding,
                ...horizontalStyle,
            };
        } else if (!elementInTopHalf && spaceAbove > tooltipHeight + padding) {
            // Element in bottom half, put tooltip above
            return {
                position: 'fixed',
                bottom: window.innerHeight - highlightRect.top + padding,
                ...horizontalStyle,
            };
        } else if (spaceBelow > spaceAbove) {
            // More space below - put at very bottom of screen
            return {
                position: 'fixed',
                bottom: padding,
                left: '50%',
                transform: 'translateX(-50%)',
            };
        } else {
            // More space above - put at very top of screen
            return {
                position: 'fixed',
                top: padding + 50, // Below the close button
                left: '50%',
                transform: 'translateX(-50%)',
            };
        }
    };

    return (
        <div
            className="walkthrough-overlay"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2000,
                pointerEvents: 'auto'
            }}
        >
            {/* Always visible close button */}
            <button
                onClick={onSkip}
                style={{
                    position: 'fixed',
                    top: '16px',
                    right: '16px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: '#fff',
                    fontSize: '1.2em',
                    cursor: 'pointer',
                    zIndex: 2002,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                aria-label="Close walkthrough"
            >
                ×
            </button>

            {/* Dark overlay with cutout for highlighted element */}
            <svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                }}
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
                    style={{
                        position: 'fixed',
                        left: highlightRect.left - 4,
                        top: highlightRect.top - 4,
                        width: highlightRect.width + 8,
                        height: highlightRect.height + 8,
                        border: '2px solid #4a90e2',
                        borderRadius: '8px',
                        pointerEvents: 'none',
                        boxShadow: '0 0 20px rgba(74, 144, 226, 0.5)'
                    }}
                />
            )}

            {/* Tooltip */}
            <div
                className="walkthrough-tooltip"
                style={{
                    ...getTooltipStyle(),
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #4a90e2',
                    borderRadius: '12px',
                    padding: '20px',
                    maxWidth: '320px',
                    width: '90%',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    zIndex: 2001
                }}
            >
                {/* Step indicator */}
                <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '16px',
                    justifyContent: 'center'
                }}>
                    {WALKTHROUGH_STEPS.map((_, i) => (
                        <div
                            key={i}
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: i === currentStep ? '#4a90e2' : '#555'
                            }}
                        />
                    ))}
                </div>

                {/* Content */}
                <h3 style={{
                    color: '#fff',
                    margin: '0 0 12px',
                    fontSize: '1.1em',
                    textAlign: 'center'
                }}>
                    {t(lang, `walkthrough.${step.id}.title`)}
                </h3>
                <p style={{
                    color: '#ccc',
                    margin: '0 0 20px',
                    fontSize: '0.9em',
                    lineHeight: 1.5,
                    textAlign: 'center'
                }}>
                    {t(lang, `walkthrough.${step.id}.description`)}
                </p>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    {!isFirstStep && (
                        <button
                            onClick={handlePrev}
                            style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: 'transparent',
                                color: '#888',
                                border: '1px solid #555',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9em'
                            }}
                        >
                            {t(lang, 'walkthrough.back')}
                        </button>
                    )}
                    {isFirstStep && (
                        <button
                            onClick={onSkip}
                            style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: 'transparent',
                                color: '#888',
                                border: '1px solid #555',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.9em'
                            }}
                        >
                            {t(lang, 'walkthrough.skip')}
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#4a90e2',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.9em'
                        }}
                    >
                        {isLastStep ? t(lang, 'walkthrough.finish') : t(lang, 'walkthrough.next')}
                    </button>
                </div>
            </div>
        </div>
    );
};

