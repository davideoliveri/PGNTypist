import React, { useEffect } from 'react';
import { type Language, t } from '../logic/localization';
import './HelpModal.css';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartTutorial?: () => void;
    lang: Language;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, onStartTutorial, lang }) => {
    // Handle ESC key
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const instructions = t(lang, 'help.instructions');

    // Simple markdown-like rendering for **bold** sections
    const renderInstructions = () => {
        const lines = instructions.split('\n');
        let isFirst = true;
        return lines.map((line, i) => {
            // Handle section headers (lines starting with **)
            if (line.startsWith('**') && line.endsWith('**')) {
                const title = line.slice(2, -2);
                const className = isFirst ? 'help-section-title' : 'help-section-title';
                isFirst = false;
                return (
                    <h3 key={i} className={className}>
                        {title}
                    </h3>
                );
            }
            // Empty lines
            if (line.trim() === '') {
                return null;
            }
            // Regular content
            return (
                <p key={i} className="help-paragraph">
                    {line}
                </p>
            );
        });
    };

    const handleStartTutorial = () => {
        onClose();
        onStartTutorial?.();
    };

    return (
        <div
            className="help-modal-overlay"
            onClick={onClose}
        >
            <div
                className="help-modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="help-modal-header">
                    <h2 className="help-modal-title">
                        {t(lang, 'help.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="help-modal-close"
                        aria-label={t(lang, 'help.close')}
                    >
                        ×
                    </button>
                </div>

                <div className="help-instructions">
                    {renderInstructions()}
                </div>

                <div className="help-modal-actions">
                    {onStartTutorial && (
                        <button
                            onClick={handleStartTutorial}
                            className="help-modal-btn help-modal-btn--secondary"
                        >
                            {t(lang, 'help.restartTutorial')}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="help-modal-btn help-modal-btn--primary"
                    >
                        {t(lang, 'help.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};
