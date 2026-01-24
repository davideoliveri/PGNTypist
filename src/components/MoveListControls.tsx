import React from 'react';
import { type Language, t } from '../logic/localization';

interface MoveListControlsProps {
    moveListLength: number;
    commentsCount: number;
    selectedIndex: number | null;
    commentValue: string;
    onDeleteLast: () => void;
    onClearAll: () => void;
    onClearComments: () => void;
    onCommentChange: (value: string) => void;
    onCommentSubmit: () => void;
    lang: Language;
}

export const MoveListControls: React.FC<MoveListControlsProps> = ({
    moveListLength,
    commentsCount,
    selectedIndex,
    commentValue,
    onDeleteLast,
    onClearAll,
    onClearComments,
    onCommentChange,
    onCommentSubmit,
    lang
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow Cmd/Ctrl + arrow keys for normal text navigation
        if ((e.metaKey || e.ctrlKey) && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
            return;
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            onCommentSubmit();
        }
    };

    const placeholder = selectedIndex !== null
        ? t(lang, 'comment.placeholder').replace('{0}', String(Math.floor(selectedIndex / 2) + 1))
        : t(lang, 'comment.disabled');

    return (
        <>
            <div className="delete-buttons">
                <button
                    onClick={onDeleteLast}
                    disabled={moveListLength === 0}
                    className="delete-btn"
                >
                    {t(lang, 'moves.deleteLast')}
                </button>
                <button
                    onClick={onClearAll}
                    disabled={moveListLength === 0}
                    className="delete-btn delete-btn--danger"
                >
                    {t(lang, 'moves.clearAll')}
                </button>
                <button
                    onClick={onClearComments}
                    disabled={commentsCount === 0}
                    className="delete-btn delete-btn--info"
                >
                    {t(lang, 'moves.clearComments')}
                </button>
            </div>
            <div className="comment-input-wrapper">
                <input
                    id="comment-input"
                    type="text"
                    className="comment-input"
                    value={commentValue}
                    onChange={(e) => onCommentChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={selectedIndex === null}
                    placeholder={placeholder}
                />
            </div>
        </>
    );
};
