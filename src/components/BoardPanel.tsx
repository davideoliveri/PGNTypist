import React from 'react';
import { type Language, t } from '../logic/localization';
import { usePersistedBoolean } from '../logic/usePersistedState';
import { STORAGE_KEYS } from '../logic/storage';
import { MiniBoard } from './MiniBoard';

interface BoardPanelProps {
    fen: string;
    orientation: 'white' | 'black';
    lastMoveSquares: { from: string; to: string } | null;
    selectedMoveSquares: { from: string; to: string } | null;
    onFlip: () => void;
    lang: Language;
}

export const BoardPanel: React.FC<BoardPanelProps> = ({
    fen,
    orientation,
    lastMoveSquares,
    selectedMoveSquares,
    onFlip,
    lang
}) => {
    // Own highlight settings with persistence
    const [showLastMoveHighlight, toggleLastMove] = usePersistedBoolean(STORAGE_KEYS.SHOW_LAST_MOVE, true);
    const [showSelectedMoveHighlight, toggleSelectedMove] = usePersistedBoolean(STORAGE_KEYS.SHOW_SELECTED_MOVE, true);

    return (
        <div className="board-column">
            <MiniBoard
                fen={fen}
                orientation={orientation}
                lastMoveSquares={showLastMoveHighlight ? lastMoveSquares : null}
                selectedMoveSquares={showSelectedMoveHighlight ? selectedMoveSquares : null}
            />
            <div className="board-controls">
                <button
                    onClick={onFlip}
                    className="board-btn"
                >
                    {t(lang, 'board.flip')}
                </button>
                <div className="highlight-toggles">
                    <button
                        onClick={toggleLastMove}
                        className={`toggle-btn ${showLastMoveHighlight ? 'toggle-btn--active' : ''}`}
                    >
                        {t(lang, 'board.showLastMove')}
                    </button>
                    <button
                        onClick={toggleSelectedMove}
                        className={`toggle-btn ${showSelectedMoveHighlight ? 'toggle-btn--active' : ''}`}
                    >
                        {t(lang, 'board.showSelectedMove')}
                    </button>
                </div>
            </div>
        </div>
    );
};
