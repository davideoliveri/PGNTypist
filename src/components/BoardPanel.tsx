import React from 'react';
import { type Language, t } from '../logic/localization';
import { MiniBoard } from './MiniBoard';

interface BoardPanelProps {
    fen: string;
    orientation: 'white' | 'black';
    lastMoveSquares: { from: string; to: string } | null;
    selectedMoveSquares: { from: string; to: string } | null;
    showLastMoveHighlight: boolean;
    showSelectedMoveHighlight: boolean;
    onFlip: () => void;
    onToggleLastMove: () => void;
    onToggleSelectedMove: () => void;
    lang: Language;
}

export const BoardPanel: React.FC<BoardPanelProps> = ({
    fen,
    orientation,
    lastMoveSquares,
    selectedMoveSquares,
    showLastMoveHighlight,
    showSelectedMoveHighlight,
    onFlip,
    onToggleLastMove,
    onToggleSelectedMove,
    lang
}) => {
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
                        onClick={onToggleLastMove}
                        className={`toggle-btn ${showLastMoveHighlight ? 'toggle-btn--active' : ''}`}
                    >
                        {t(lang, 'board.showLastMove')}
                    </button>
                    <button
                        onClick={onToggleSelectedMove}
                        className={`toggle-btn ${showSelectedMoveHighlight ? 'toggle-btn--active' : ''}`}
                    >
                        {t(lang, 'board.showSelectedMove')}
                    </button>
                </div>
            </div>
        </div>
    );
};
