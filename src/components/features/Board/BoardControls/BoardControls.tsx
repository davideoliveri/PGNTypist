import React from 'react';
import { t, type Language } from '../../../../services/localization';
import { type BoardSettings, type BoardSettingsHandlers } from '../../../../hooks/useBoardSettings';
import './BoardControls.css';

interface BoardControlsProps {
    lang: Language;
    settings: BoardSettings;
    handlers: BoardSettingsHandlers;
}

export const BoardControls: React.FC<BoardControlsProps> = ({
    lang,
    settings,
    handlers
}) => {
    return (
        <div className="board-controls">
            <button
                onClick={handlers.toggleOrientation}
                className="board-btn"
            >
                {t(lang, 'board.flip')}
            </button>
            <div className="highlight-toggles">
                <button
                    onClick={handlers.toggleLastMoveHighlight}
                    className={`toggle-btn ${settings.showLastMoveHighlight ? 'toggle-btn--active' : ''}`}
                >
                    {t(lang, 'board.showLastMove')}
                </button>
                <button
                    onClick={handlers.toggleSelectedMoveHighlight}
                    className={`toggle-btn ${settings.showSelectedMoveHighlight ? 'toggle-btn--active' : ''}`}
                >
                    {t(lang, 'board.showSelectedMove')}
                </button>
            </div>
        </div>
    );
};
