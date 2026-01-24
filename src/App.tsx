import { useState, useEffect, useRef } from 'react';
import { useChessGame } from './logic/chessAdapter';
import { type Language } from './logic/localization';
import { STORAGE_KEYS, getInitialMoves, getInitialHeaders, getInitialComments, getInitialLanguage } from './logic/storage';
import { MoveList } from './components/MoveList';
import { MoveInput, type MoveInputHandle } from './components/MoveInput';
import { MetadataEditor } from './components/MetadataEditor';
import { HelpModal } from './components/HelpModal';
import { Walkthrough } from './components/Walkthrough';
import { AppHeader } from './components/AppHeader';
import { BoardPanel } from './components/BoardPanel';
import { MoveListControls } from './components/MoveListControls';
import { ExportPanel } from './components/ExportPanel';
import { AppFooter } from './components/AppFooter';
import './App.css';

function App() {
    const [lang, setLang] = useState<Language>(getInitialLanguage);
    const [headers, setHeaders] = useState<{ [key: string]: string }>(getInitialHeaders);
    const [showHelp, setShowHelp] = useState(false);
    const [showWalkthrough, setShowWalkthrough] = useState(() => {
        return !localStorage.getItem(STORAGE_KEYS.WALKTHROUGH);
    });
    const [notification, setNotification] = useState<string | null>(null);
    const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
    const [showLastMoveHighlight, setShowLastMoveHighlight] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.SHOW_LAST_MOVE);
        return stored === null ? true : stored === 'true';
    });
    const [showSelectedMoveHighlight, setShowSelectedMoveHighlight] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.SHOW_SELECTED_MOVE);
        return stored === null ? true : stored === 'true';
    });

    const moveInputRef = useRef<MoveInputHandle>(null);

    const {
        moveList,
        addMove,
        deleteLast,
        clearAll,
        truncateFromIndex,
        undo,
        redo,
        canUndo,
        canRedo,
        comments,
        setComment,
        deleteComment,
        clearAllComments,
        selectedIndex,
        setCursor,
        lastMoveSquares,
        selectedMoveSquares,
        legalMoves,
        result,
        isGameOver,
        fen
    } = useChessGame(getInitialMoves(), getInitialComments());

    // Persist moves to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.MOVES, JSON.stringify(moveList));
    }, [moveList]);

    // Persist headers to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.HEADERS, JSON.stringify(headers));
    }, [headers]);

    // Persist comments to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
    }, [comments]);

    // Persist language to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    }, [lang]);

    // Persist highlight settings
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SHOW_LAST_MOVE, String(showLastMoveHighlight));
    }, [showLastMoveHighlight]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SHOW_SELECTED_MOVE, String(showSelectedMoveHighlight));
    }, [showSelectedMoveHighlight]);

    // Update Result in headers if game over
    useEffect(() => {
        if (isGameOver) {
            setHeaders(h => ({ ...h, 'Result': result }));
        }
    }, [isGameOver, result]);

    // Mobile detection
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Show notification and auto-clear
    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 2000);
    };

    // Global Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                if (isInput) return;
                e.preventDefault();
                if (e.shiftKey) {
                    if (canRedo) redo();
                } else {
                    if (canUndo) undo();
                }
            }

            const isCmd = e.metaKey || e.ctrlKey;
            if (e.defaultPrevented) return;
            const isCommentInput = target.id === 'comment-input';

            if (e.key === 'ArrowLeft') {
                if (!isInput || (isCmd && !isCommentInput)) {
                    e.preventDefault();
                    navigate(-1);
                }
            }

            if (e.key === 'ArrowRight') {
                if (!isInput || (isCmd && !isCommentInput)) {
                    e.preventDefault();
                    navigate(1);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, canUndo, canRedo, moveList.length]);

    // Navigation Helper
    const navigate = (direction: -1 | 1) => {
        setCursor((prev) => {
            if (direction === -1) {
                if (prev === null) return moveList.length > 0 ? moveList.length - 1 : null;
                return Math.max(0, prev - 1);
            } else {
                if (prev === null) return null;
                if (prev >= moveList.length - 1) {
                    setTimeout(() => moveInputRef.current?.focus(), 0);
                    return null;
                }
                return prev + 1;
            }
        });
    };

    // Comment handlers
    const handleCommentChange = (value: string) => {
        if (selectedIndex !== null) {
            setComment(selectedIndex, value);
        }
    };

    const handleCommentSubmit = () => {
        setCursor(null);
        moveInputRef.current?.focus();
    };

    return (
        <div className="app-container">
            <AppHeader
                lang={lang}
                onLangChange={setLang}
                onShowHelp={() => setShowHelp(true)}
            />

            <main className="app-main">
                <div className="content-grid">
                    <div className="moves-column">
                        <MoveList
                            moves={moveList}
                            comments={comments}
                            selectedIndex={selectedIndex}
                            onSelect={setCursor}
                            onDeleteFrom={truncateFromIndex}
                            onDeleteComment={deleteComment}
                            onFocusMoveInput={() => moveInputRef.current?.focus()}
                            lang={lang}
                        />
                        <MoveListControls
                            moveListLength={moveList.length}
                            commentsCount={Object.keys(comments).length}
                            selectedIndex={selectedIndex}
                            commentValue={selectedIndex !== null ? (comments[selectedIndex] || '') : ''}
                            onDeleteLast={deleteLast}
                            onClearAll={clearAll}
                            onClearComments={clearAllComments}
                            onCommentChange={handleCommentChange}
                            onCommentSubmit={handleCommentSubmit}
                            lang={lang}
                        />
                    </div>
                    {!isMobile && (
                        <BoardPanel
                            fen={fen}
                            orientation={boardOrientation}
                            lastMoveSquares={lastMoveSquares}
                            selectedMoveSquares={selectedMoveSquares}
                            showLastMoveHighlight={showLastMoveHighlight}
                            showSelectedMoveHighlight={showSelectedMoveHighlight}
                            onFlip={() => setBoardOrientation(o => o === 'white' ? 'black' : 'white')}
                            onToggleLastMove={() => setShowLastMoveHighlight(!showLastMoveHighlight)}
                            onToggleSelectedMove={() => setShowSelectedMoveHighlight(!showSelectedMoveHighlight)}
                            lang={lang}
                        />
                    )}
                </div>

                <div className="input-area">
                    <MoveInput
                        ref={moveInputRef}
                        onMove={addMove}
                        legalMoves={legalMoves(lang)}
                        lang={lang}
                        onNavigate={navigate}
                    />
                </div>
            </main>

            <footer className="app-footer">
                <div className="metadata-wrapper">
                    <MetadataEditor
                        headers={headers}
                        onChange={setHeaders}
                        onResetValues={() => {
                            const resetHeaders: { [key: string]: string } = {};
                            for (const key of Object.keys(headers)) {
                                resetHeaders[key] = key === 'Result' ? '*' : '??';
                            }
                            setHeaders(resetHeaders);
                        }}
                        lang={lang}
                    />
                </div>
                <ExportPanel
                    headers={headers}
                    moveList={moveList}
                    comments={comments}
                    result={result}
                    fen={fen}
                    onNotify={showNotification}
                    lang={lang}
                />
                <AppFooter
                    moveList={moveList}
                    boardOrientation={boardOrientation}
                    lang={lang}
                />
            </footer>

            {notification && (
                <div className="toast">
                    {notification}
                </div>
            )}

            <HelpModal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
                onStartTutorial={() => {
                    localStorage.removeItem(STORAGE_KEYS.WALKTHROUGH);
                    setShowWalkthrough(true);
                }}
                lang={lang}
            />

            <Walkthrough
                isOpen={showWalkthrough}
                onComplete={() => {
                    localStorage.setItem(STORAGE_KEYS.WALKTHROUGH, 'true');
                    setShowWalkthrough(false);
                    moveInputRef.current?.focus();
                }}
                onSkip={() => {
                    localStorage.setItem(STORAGE_KEYS.WALKTHROUGH, 'true');
                    setShowWalkthrough(false);
                    moveInputRef.current?.focus();
                }}
                lang={lang}
            />
        </div>
    );
}

export default App;
