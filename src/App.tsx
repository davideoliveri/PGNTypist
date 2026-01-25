import { useState, useEffect, useRef } from 'react';
import { useChessGame } from './hooks/useChessGame';
import { type Language } from './services/localization';
import { STORAGE_KEYS, getInitialMoves, getInitialHeaders, getInitialComments, getInitialLanguage } from './services/storage';

// Layout
import { AppHeader } from './components/layout/AppHeader/AppHeader';
import { AppMain } from './components/layout/AppMain/AppMain';
import { AppFooter } from './components/layout/AppFooter/AppFooter';

// Features
import { MoveInput, type MoveInputHandle } from './components/features/Moves/MoveInput/MoveInput';
import { ExportSection } from './components/features/Export/ExportSection/ExportSection';
import { MetadataSection } from './components/features/Export/MetadataSection/MetadataSection';

// Modals
import { HelpModal } from './components/modals/HelpModal/HelpModal';
import { Walkthrough, type WalkthroughHandle } from './components/modals/Walkthrough/Walkthrough';

import { useBoardSettings } from './hooks/useBoardSettings';

import './App.css';

function App() {
    const [lang, setLang] = useState<Language>(getInitialLanguage);
    const [headers, setHeaders] = useState<{ [key: string]: string }>(getInitialHeaders);
    const [showHelp, setShowHelp] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

    const { settings: boardSettings, handlers: boardHandlers } = useBoardSettings();

    const moveInputRef = useRef<MoveInputHandle>(null);
    const walkthroughRef = useRef<WalkthroughHandle>(null);

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
    } = useChessGame({
        initialMoves: getInitialMoves(),
        initialComments: getInitialComments(),
        persist: true
    });

    // Persist headers to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.HEADERS, JSON.stringify(headers));
    }, [headers]);

    // Persist language to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    }, [lang]);

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

            <AppMain
                moveList={moveList}
                comments={comments}
                selectedIndex={selectedIndex}
                commentValue={selectedIndex !== null ? (comments[selectedIndex] || '') : ''}
                onSelect={setCursor}
                onDeleteLast={deleteLast}
                onClearAll={clearAll}
                onClearComments={clearAllComments}
                onDeleteFrom={truncateFromIndex}
                onDeleteComment={deleteComment}
                onCommentChange={handleCommentChange}
                onCommentSubmit={handleCommentSubmit}
                onUndo={undo}
                onRedo={redo}
                onNavigate={navigate}
                onGoToStart={() => setCursor(0)}
                onGoToEnd={() => setCursor(null)}
                canUndo={canUndo}
                canRedo={canRedo}
                fen={fen}
                lastMoveSquares={lastMoveSquares}
                selectedMoveSquares={selectedMoveSquares}
                isMobile={isMobile}
                isGameOver={isGameOver}
                result={result}
                lang={lang}
                onFocusMoveInput={() => moveInputRef.current?.focus()}
                boardSettings={boardSettings}
                boardHandlers={boardHandlers}
            />

            <div className="input-area">
                <MoveInput
                    ref={moveInputRef}
                    onMove={addMove}
                    legalMoves={legalMoves(lang)}
                    lang={lang}
                    onNavigate={navigate}
                />
            </div>

            <footer className="app-footer-layout">
                <div className="metadata-row-wrapper">
                    <MetadataSection
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
                <ExportSection
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
                    lang={lang}
                    boardOrientation={boardSettings.orientation}
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
                    walkthroughRef.current?.start();
                }}
                lang={lang}
            />

            <Walkthrough
                ref={walkthroughRef}
                onComplete={() => moveInputRef.current?.focus()}
                lang={lang}
            />
        </div>
    );
}

export default App;
