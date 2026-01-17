import React, { useEffect } from 'react';
import { type Language, t } from '../logic/localization';

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
        return lines.map((line, i) => {
            // Handle section headers (lines starting with **)
            if (line.startsWith('**') && line.endsWith('**')) {
                const title = line.slice(2, -2);
                return (
                    <h3 key={i} style={{
                        color: '#4a90e2',
                        marginTop: i === 0 ? 0 : '16px',
                        marginBottom: '8px',
                        fontSize: '1em',
                        fontWeight: 600
                    }}>
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
                <p key={i} style={{
                    margin: '4px 0',
                    color: '#ccc',
                    fontSize: '0.9em',
                    lineHeight: 1.5
                }}>
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
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
        >
            <div
                className="help-modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: '#1e1e1e',
                    borderRadius: '12px',
                    padding: '24px',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    border: '1px solid #444',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <h2 style={{ margin: 0, color: '#fff', fontSize: '1.3em' }}>
                        {t(lang, 'help.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#888',
                            fontSize: '1.5em',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            lineHeight: 1
                        }}
                        aria-label={t(lang, 'help.close')}
                    >
                        ×
                    </button>
                </div>

                <div className="help-instructions">
                    {renderInstructions()}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    {onStartTutorial && (
                        <button
                            onClick={handleStartTutorial}
                            style={{
                                flex: 1,
                                padding: '10px',
                                backgroundColor: 'transparent',
                                color: '#4a90e2',
                                border: '1px solid #4a90e2',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '0.95em'
                            }}
                        >
                            {t(lang, 'help.restartTutorial')}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '10px',
                            backgroundColor: '#3a6ea5',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.95em'
                        }}
                    >
                        {t(lang, 'help.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

