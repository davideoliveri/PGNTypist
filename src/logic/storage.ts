import { SUPPORTED_LANGUAGES, type Language } from './localization';

// Storage Keys
export const STORAGE_KEYS = {
    WALKTHROUGH: 'pgn-typist-walkthrough-done',
    MOVES: 'pgn-typist-moves',
    HEADERS: 'pgn-typist-headers',
    COMMENTS: 'pgn-typist-comments',
    SHOW_LAST_MOVE: 'pgn-typist-show-last-move',
    SHOW_SELECTED_MOVE: 'pgn-typist-show-selected-move',
    LANGUAGE: 'pgn-typist-lang',
} as const;

export const DEFAULT_HEADERS: { [key: string]: string } = {
    'Event': '??',
    'Site': '??',
    'Date': new Date().toISOString().split('T')[0].replace(/-/g, '.'),
    'Round': '??',
    'White': '??',
    'Black': '??',
    'Result': '*'
};

// Load moves from localStorage
export const getInitialMoves = (): string[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.MOVES);
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
export const getInitialHeaders = (): { [key: string]: string } => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.HEADERS);
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

// Load comments from localStorage
export const getInitialComments = (): Record<number, string> => {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.COMMENTS);
        if (stored) {
            const parsed = JSON.parse(stored);
            if (typeof parsed === 'object' && parsed !== null) {
                const comments: Record<number, string> = {};
                for (const [key, value] of Object.entries(parsed)) {
                    if (typeof value === 'string') {
                        comments[Number(key)] = value;
                    }
                }
                return comments;
            }
        }
    } catch (e) {
        // Ignore parse errors
    }
    return {};
};

// Detect language: localStorage > browser > fallback to 'en'
export const getInitialLanguage = (): Language => {
    const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (stored && stored in SUPPORTED_LANGUAGES) {
        return stored as Language;
    }
    const browserLang = navigator.language.split('-')[0] as Language;
    if (browserLang in SUPPORTED_LANGUAGES) {
        return browserLang;
    }
    return 'en';
};
