import { useState, useEffect, useRef } from 'react';
import { useChessGame } from './logic/chessAdapter';
import { type Language, SUPPORTED_LANGUAGES, t } from './logic/localization';
import { MoveList } from './components/MoveList';
import { MoveInput, type MoveInputHandle } from './components/MoveInput';
import { MetadataEditor } from './components/MetadataEditor';
import { MiniBoard } from './components/MiniBoard';
import { HelpModal } from './components/HelpModal';
import { Walkthrough } from './components/Walkthrough';
import './App.css';

const WALKTHROUGH_KEY = 'pgn-typist-walkthrough-done';
const MOVES_STORAGE_KEY = 'pgn-typist-moves';
const HEADERS_STORAGE_KEY = 'pgn-typist-headers';

const DEFAULT_HEADERS: { [key: string]: string } = {
    'Event': '??',
    'Date': new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    'Site': '??',
    'White': '??',
    'Black': '??',
    'Result': '*'
};

// Load moves from localStorage
const getInitialMoves = (): string[] => {
    try {
        const stored = localStorage.getItem(MOVES_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        // Ignore parse errors
    }
    return [];
};

// Load headers from localStorage, preserving custom keys
const getInitialHeaders = (): { [key: string]: string } => {
    try {
        const stored = localStorage.getItem(HEADERS_STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (typeof parsed === 'object' && parsed !== null) {
                return parsed;
            }
        }
    } catch (e) {
        // Ignore parse errors
    }
    return { ...DEFAULT_HEADERS };
};

function App() {
    // Detect language: localStorage > browser > fallback to 'en'
    const getInitialLanguage = (): Language => {
        // Check localStorage first
        const stored = localStorage.getItem('pgn-typist-lang');
        if (stored && stored in SUPPORTED_LANGUAGES) {
            return stored as Language;
        }
        // Detect from browser
        const browserLang = navigator.language.split('-')[0] as Language;
        if (browserLang in SUPPORTED_LANGUAGES) {
            return browserLang;
        }
        // Fallback to English
        return 'en';
    };

    const [lang, setLang] = useState<Language>(getInitialLanguage);

    // Persist language preference
    useEffect(() => {
        localStorage.setItem('pgn-typist-lang', lang);
    }, [lang]);

    const [headers, setHeaders] = useState<{ [key: string]: string }>(getInitialHeaders);
    const [notification, setNotification] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);
    const [showHelp, setShowHelp] = useState(false);
    const [showWalkthrough, setShowWalkthrough] = useState(false);
    const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const moveInputRef = useRef<MoveInputHandle>(null);

    // Listen for service worker updates
    useEffect(() => {
        const handleUpdate = () => setUpdateAvailable(true);
        window.addEventListener('sw-update-available', handleUpdate);
        return () => window.removeEventListener('sw-update-available', handleUpdate);
    }, []);

    // Check if first-time user for walkthrough
    useEffect(() => {
        if (!localStorage.getItem(WALKTHROUGH_KEY)) {
            setShowWalkthrough(true);
        }
    }, []);

    // Track screen size for conditional rendering
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

    // Clipboard helper with iOS Safari fallback
    const copyToClipboard = async (text: string): Promise<boolean> => {
        // Try modern API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                // Fall through to fallback
            }
        }
        // Fallback for iOS Safari and older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
            document.execCommand('copy');
            document.body.removeChild(textarea);
            return true;
        } catch (err) {
            document.body.removeChild(textarea);
            return false;
        }
    };

    const {
        moveList,
        selectedIndex,
        setCursor,
        addMove,
        truncateFromIndex,
        deleteLast,
        clearAll,
        undo,
        redo,
        canUndo,
        canRedo,
        legalMoves,
        result,
        isGameOver,
        fen
    } = useChessGame(getInitialMoves());

    // Persist moves to localStorage
    useEffect(() => {
        localStorage.setItem(MOVES_STORAGE_KEY, JSON.stringify(moveList));
    }, [moveList]);

    // Persist headers to localStorage
    useEffect(() => {
        localStorage.setItem(HEADERS_STORAGE_KEY, JSON.stringify(headers));
    }, [headers]);

    // Update Result in headers if game over
    useEffect(() => {
        if (isGameOver) {
            setHeaders(h => ({ ...h, 'Result': result }));
        }
    }, [isGameOver, result]);

    // Global Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Undo: Cmd+Z or Ctrl+Z
            // Ensure we don't block text inputs if they are focused (unless it's a command)
            const target = e.target as HTMLElement;
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                // Allow undo/redo even in inputs? Usually yes.
                // But if it's text input, maybe browser handles it?
                // "undo" in app updates game state. 
                // If user is editing PGN header, they might want to undo text typing.
                // So if input is focused, we should NOT trigger game undo unless e.preventDefault() is NOT called?
                // Actually, best practice: if standard undo works, let it work.
                if (isInput) return;

                e.preventDefault();
                if (e.shiftKey) {
                    if (canRedo) redo();
                } else {
                    if (canUndo) undo();
                }
            }

            // Navigation: Cmd/Ctrl + Arrows always work.
            // Or if not input focused, simple arrows work.
            const isCmd = e.metaKey || e.ctrlKey;

            // Prevent double handling if a child component already handled it (e.g. MoveInput)
            if (e.defaultPrevented) return;

            if (e.key === 'ArrowLeft') {
                if (!isInput || isCmd) {
                    e.preventDefault();
                    navigate(-1);
                }
            }

            if (e.key === 'ArrowRight') {
                if (!isInput || isCmd) {
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
                if (prev >= moveList.length - 1) return null; // Go to append
                return prev + 1;
            }
        });
    }; // Added moveList dependency for navigation logic

    const handleExport = (type: 'copy' | 'download') => {
        let pgn = '';
        // Headers
        for (const [key, value] of Object.entries(headers)) {
            pgn += `[${key} "${value}"]\n`;
        }
        pgn += '\n';

        // Moves
        let moveText = '';
        for (let i = 0; i < moveList.length; i += 2) {
            moveText += `${Math.floor(i / 2) + 1}. ${moveList[i]} `;
            if (moveList[i + 1]) {
                moveText += `${moveList[i + 1]} `;
            }
        }
        pgn += moveText + (headers['Result'] || result);

        if (type === 'copy') {
            copyToClipboard(pgn);
            showNotification(t(lang, 'export.copied'));
        } else {
            const blob = new Blob([pgn], { type: 'application/x-chess-pgn' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'game.pgn';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            boxSizing: 'border-box',
            gap: '20px'
        }}>
            {/* Update Available Banner */}
            {updateAvailable && (
                <div className="update-banner">
                    <span>🔄 {t(lang, 'update.available')}</span>
                    <button onClick={() => window.location.reload()}>
                        {t(lang, 'update.refresh')}
                    </button>
                </div>
            )}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <h1 className="title-logo" style={{ margin: 0 }}>
                    <img src="logo.svg" alt="Logo" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
                    <span>PGN Typist</span>
                </h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                        onClick={() => setShowHelp(true)}
                        style={{
                            background: 'transparent',
                            border: '1px solid #555',
                            color: '#888',
                            width: '28px',
                            height: '28px',
                            minWidth: '28px',
                            minHeight: '28px',
                            padding: 0,
                            borderRadius: '50%',
                            cursor: 'pointer',
                            fontSize: '0.9em',
                            fontWeight: 500,
                            lineHeight: 1
                        }}
                        aria-label={t(lang, 'help.title')}
                    >
                        ?
                    </button>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>

                        <select
                            value={lang}
                            onChange={(e) => setLang(e.target.value as Language)}
                            style={{ padding: '4px', borderRadius: '4px', background: '#333', color: '#fff', border: '1px solid #555' }}
                        >
                            {Object.entries(SUPPORTED_LANGUAGES).map(([code, label]) => (
                                <option key={code} value={code}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            <main className="app-main">
                {/* Content Area: Grid */}
                <div className="content-grid">
                    <div className="moves-column">
                        <MoveList
                            moves={moveList}
                            selectedIndex={selectedIndex}
                            onSelect={setCursor}
                            onDeleteFrom={truncateFromIndex}
                            lang={lang}
                        />
                        {/* Delete buttons - always visible, centered */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '8px',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={deleteLast}
                                disabled={moveList.length === 0}
                                style={{
                                    padding: '6px 12px',
                                    background: 'transparent',
                                    border: '1px solid #555',
                                    borderRadius: '4px',
                                    color: moveList.length === 0 ? '#444' : '#888',
                                    cursor: moveList.length === 0 ? 'default' : 'pointer',
                                    fontSize: '1em',
                                    opacity: moveList.length === 0 ? 0.5 : 1
                                }}
                            >
                                {t(lang, 'moves.deleteLast')}
                            </button>
                            <button
                                onClick={clearAll}
                                disabled={moveList.length === 0}
                                style={{
                                    padding: '6px 12px',
                                    background: 'transparent',
                                    border: '1px solid #733',
                                    borderRadius: '4px',
                                    color: moveList.length === 0 ? '#533' : '#a66',
                                    cursor: moveList.length === 0 ? 'default' : 'pointer',
                                    fontSize: '1em',
                                    opacity: moveList.length === 0 ? 0.5 : 1
                                }}
                            >
                                {t(lang, 'moves.clearAll')}
                            </button>
                        </div>
                    </div>
                    {!isMobile && (
                        <div className="board-column">
                            <MiniBoard fen={fen} orientation={boardOrientation} />
                            {/* Flip button - centered under board */}
                            <button
                                onClick={() => setBoardOrientation(o => o === 'white' ? 'black' : 'white')}
                                style={{
                                    marginTop: '8px',
                                    padding: '6px 12px',
                                    background: 'transparent',
                                    border: '1px solid #555',
                                    borderRadius: '4px',
                                    color: '#888',
                                    cursor: 'pointer',
                                    fontSize: '1em',
                                    display: 'block',
                                    marginLeft: 'auto',
                                    marginRight: 'auto'
                                }}
                            >
                                ⟳ {t(lang, 'board.flip')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div style={{ marginTop: '10px', width: '100%', maxWidth: '900px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <MoveInput
                        ref={moveInputRef}
                        onMove={addMove}
                        legalMoves={legalMoves(lang)}
                        lang={lang}
                        onNavigate={navigate}
                    />
                </div>

                {isGameOver && (
                    <div style={{ textAlign: 'center', color: '#aaa', marginTop: '10px' }}>
                        Game Over: {result}
                    </div>
                )}
            </main>

            <footer style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '20px' }}>
                <div style={{ marginBottom: '10px' }}>
                    <MetadataEditor
                        headers={headers}
                        onChange={setHeaders}
                        onResetValues={() => {
                            // Reset all values to "??" but keep keys (including custom ones)
                            const resetHeaders: { [key: string]: string } = {};
                            for (const key of Object.keys(headers)) {
                                resetHeaders[key] = '??';
                            }
                            setHeaders(resetHeaders);
                        }}
                        lang={lang}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => handleExport('copy')}>
                        {t(lang, 'export.copy')}
                    </button>
                    <button onClick={() => handleExport('download')}>
                        {t(lang, 'export.download')}
                    </button>
                </div>

                {/* SAN Note */}
                <p style={{
                    textAlign: 'center',
                    fontSize: '0.75em',
                    color: '#888',
                    margin: '0',
                    fontStyle: 'italic'
                }}>
                    {t(lang, 'export.sanNote')}
                </p>

                {/* FEN Display */}
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    maxWidth: '90%',
                    margin: '0 auto'
                }}>
                    <strong style={{ whiteSpace: 'nowrap' }}>{t(lang, 'export.fen')}:</strong>
                    <input
                        type="text"
                        readOnly
                        value={fen}
                        className="fen-input"
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            fontSize: '0.85em',
                            padding: '6px',
                            textOverflow: 'ellipsis'
                        }}
                        onClick={(e) => (e.target as HTMLInputElement).select()}
                    />
                    <button
                        onClick={async () => {
                            await copyToClipboard(fen);
                            showNotification(t(lang, 'export.copied'));
                        }}
                        style={{ padding: '6px 12px', fontSize: '0.85em' }}
                    >
                        {t(lang, 'export.copyFen')}
                    </button>
                </div>

                {/* Lichess Analysis Link */}
                {moveList.length > 0 && (
                    <div style={{ textAlign: 'center' }}>
                        <a
                            href={`https://lichess.org/analysis/pgn/${encodeURIComponent(moveList.reduce((acc, move, i) => {
                                if (i % 2 === 0) acc += `${Math.floor(i / 2) + 1}.`;
                                return acc + move + ' ';
                            }, '').trim())}?color=${boardOrientation}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                color: '#4a90e2',
                                textDecoration: 'none',
                                fontSize: '0.9em'
                            }}
                        >
                            {t(lang, 'export.lichessAnalysis')} ↗
                        </a>
                    </div>
                )}
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.8em', color: '#888' }}>
                        {t(lang, 'footer.credit')} <a href="https://github.com/davideoliveri" target="_blank" rel="noopener noreferrer" style={{ color: '#4a90e2', textDecoration: 'none' }}>Davide Oliveri</a>
                    </p>
                </div>
            </footer>

            {/* Toast Notification */}
            {
                notification && (
                    <div style={{
                        position: 'fixed',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(74, 144, 226, 0.95)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '6px',
                        fontSize: '0.9em',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        zIndex: 1000,
                        animation: 'fadeIn 0.2s ease'
                    }}>
                        {notification}
                    </div>
                )
            }

            <HelpModal
                isOpen={showHelp}
                onClose={() => setShowHelp(false)}
                onStartTutorial={() => {
                    localStorage.removeItem(WALKTHROUGH_KEY);
                    setShowWalkthrough(true);
                }}
                lang={lang}
            />

            <Walkthrough
                isOpen={showWalkthrough}
                onComplete={() => {
                    localStorage.setItem(WALKTHROUGH_KEY, 'true');
                    setShowWalkthrough(false);
                    moveInputRef.current?.focus();
                }}
                onSkip={() => {
                    localStorage.setItem(WALKTHROUGH_KEY, 'true');
                    setShowWalkthrough(false);
                    moveInputRef.current?.focus();
                }}
                lang={lang}
            />
        </div >
    );
}

export default App;
