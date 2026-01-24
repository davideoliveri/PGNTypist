import React from 'react';
import { type Language, SUPPORTED_LANGUAGES, t } from '../logic/localization';

interface AppHeaderProps {
    lang: Language;
    onLangChange: (lang: Language) => void;
    onShowHelp: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    lang,
    onLangChange,
    onShowHelp
}) => {
    return (
        <header className="app-header">
            <h1 className="title-logo">
                <img src="logo.svg" alt="Logo" />
                <span>PGN Typist</span>
            </h1>
            <div className="header-controls">
                <button
                    onClick={onShowHelp}
                    className="help-btn"
                    aria-label={t(lang, 'help.title')}
                >
                    ?
                </button>
                <div className="language-select-wrapper">
                    <select
                        value={lang}
                        onChange={(e) => onLangChange(e.target.value as Language)}
                        className="language-select"
                    >
                        {Object.entries(SUPPORTED_LANGUAGES).map(([code, label]) => (
                            <option key={code} value={code}>{label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </header>
    );
};
