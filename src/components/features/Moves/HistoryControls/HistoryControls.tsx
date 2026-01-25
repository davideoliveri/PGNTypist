import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Undo2, Redo2 } from 'lucide-react';
import { type Language, t } from '../../../../services/localization';
import './HistoryControls.css';

interface HistoryControlsProps {
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    onNavigate: (dir: -1 | 1) => void;
    onGoToStart: () => void;
    onGoToEnd: () => void;
    lang: Language;
}

export const HistoryControls: React.FC<HistoryControlsProps> = ({
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onNavigate,
    onGoToStart,
    onGoToEnd,
    lang
}) => {
    return (
        <div className="history-controls">
            <div className="nav-group">
                <button
                    onClick={onGoToStart}
                    className="history-btn"
                    title={t(lang, 'nav.start') || 'Go to start'}
                >
                    <ChevronsLeft size={18} />
                </button>
                <button
                    onClick={() => onNavigate(-1)}
                    className="history-btn"
                    title={t(lang, 'nav.prev') || 'Previous move'}
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={() => onNavigate(1)}
                    className="history-btn"
                    title={t(lang, 'nav.next') || 'Next move'}
                >
                    <ChevronRight size={18} />
                </button>
                <button
                    onClick={onGoToEnd}
                    className="history-btn"
                    title={t(lang, 'nav.end') || 'Go to end'}
                >
                    <ChevronsRight size={18} />
                </button>
            </div>

            <div className="undo-group">
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="history-btn undo-btn"
                    title={t(lang, 'history.undo') || 'Undo'}
                >
                    <Undo2 size={18} />
                </button>
                <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="history-btn redo-btn"
                    title={t(lang, 'history.redo') || 'Redo'}
                >
                    <Redo2 size={18} />
                </button>
            </div>
        </div>
    );
};
