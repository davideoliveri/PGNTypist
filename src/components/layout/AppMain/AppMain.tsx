import React from 'react';
import { type Language, t } from '../../../services/localization';
import { MoveList } from '../../features/Moves/MoveList/MoveList';
import { MoveListControls } from '../../features/Moves/MoveListControls/MoveListControls';
import { ChessBoard } from '../../features/Board/ChessBoard/ChessBoard';
import { BoardControls } from '../../features/Board/BoardControls/BoardControls';
import { type BoardSettings, type BoardSettingsHandlers } from '../../../hooks/useBoardSettings';
import './AppMain.css';

interface AppMainProps {
    moveList: string[];
    comments: Record<number, string>;
    selectedIndex: number | null;
    commentValue: string;
    onSelect: (index: number | null) => void;
    onDeleteLast: () => void;
    onClearAll: () => void;
    onClearComments: () => void;
    onDeleteFrom: (index: number) => void;
    onDeleteComment: (index: number) => void;
    onCommentChange: (value: string) => void;
    onCommentSubmit: () => void;
    fen: string;
    lastMoveSquares: { from: string; to: string } | null;
    selectedMoveSquares: { from: string; to: string } | null;
    isMobile: boolean;
    isGameOver: boolean;
    result: string;
    lang: Language;
    onFocusMoveInput?: () => void;
    boardSettings: BoardSettings;
    boardHandlers: BoardSettingsHandlers;
}

export const AppMain: React.FC<AppMainProps> = ({
    moveList,
    comments,
    selectedIndex,
    commentValue,
    onSelect,
    onDeleteLast,
    onClearAll,
    onClearComments,
    onDeleteFrom,
    onDeleteComment,
    onCommentChange,
    onCommentSubmit,
    fen,
    lastMoveSquares,
    selectedMoveSquares,
    isMobile,
    isGameOver,
    result,
    lang,
    onFocusMoveInput,
    boardSettings,
    boardHandlers
}) => {
    return (
        <main className="app-main">
            <div className="app-main-grid">
                {/* Stage Row */}
                <div className="stage-moves">
                    <MoveList
                        moves={moveList}
                        comments={comments}
                        selectedIndex={selectedIndex}
                        onSelect={onSelect}
                        onDeleteFrom={onDeleteFrom}
                        onDeleteComment={onDeleteComment}
                        onFocusMoveInput={onFocusMoveInput}
                        lang={lang}
                    />
                </div>

                {!isMobile && (
                    <div className="stage-board">
                        <ChessBoard
                            fen={fen}
                            orientation={boardSettings.orientation}
                            lastMoveSquares={boardSettings.showLastMoveHighlight ? lastMoveSquares : null}
                            selectedMoveSquares={boardSettings.showSelectedMoveHighlight ? selectedMoveSquares : null}
                        />
                    </div>
                )}

                {/* Controls Row */}
                <div className="controls-moves">
                    <MoveListControls
                        moveListLength={moveList.length}
                        commentsCount={Object.keys(comments).length}
                        selectedIndex={selectedIndex}
                        commentValue={commentValue}
                        onDeleteLast={onDeleteLast}
                        onClearAll={onClearAll}
                        onClearComments={onClearComments}
                        onCommentChange={onCommentChange}
                        onCommentSubmit={onCommentSubmit}
                        lang={lang}
                    />
                </div>

                {!isMobile && (
                    <div className="controls-board">
                        <BoardControls
                            lang={lang}
                            settings={boardSettings}
                            handlers={boardHandlers}
                        />
                    </div>
                )}
            </div>

            {isGameOver && (
                <div className="game-over-message">
                    {t(lang, 'game.over')} ({result})
                </div>
            )}
        </main>
    );
};
