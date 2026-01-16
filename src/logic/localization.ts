export type Language = 'en' | 'es';

export const SUPPORTED_LANGUAGES: { [key in Language]: string } = {
  en: 'English',
  es: 'Español',
};

// Map: Language -> English Piece -> Localized Piece
const PIECE_MAP: { [lang in Language]: { [piece: string]: string } } = {
  en: {
    P: 'P', // Pawn (rarely used in SAN but good for completeness)
    N: 'N',
    B: 'B',
    R: 'R',
    Q: 'Q',
    K: 'K',
  },
  es: {
    P: 'P',
    N: 'C', // Caballo
    B: 'A', // Alfil
    R: 'T', // Torre
    Q: 'D', // Dama
    K: 'R', // Rey
  },
};

// Reverse Map: Language -> Localized Piece -> English Piece
const REVERSE_PIECE_MAP: { [lang in Language]: { [char: string]: string } } = {
  en: { P: 'P', N: 'N', B: 'B', R: 'R', Q: 'Q', K: 'K' },
  es: { P: 'P', C: 'N', A: 'B', T: 'R', D: 'Q', R: 'K' },
};

export const UI_TRANSLATIONS: { [lang in Language]: { [key: string]: string } } = {
  en: {
    'app.title': 'Fast PGN Typist',
    'app.placeholder': 'Enter move (e.g. e4, Nf3)',
    'settings.language': 'Language',
    'export.copy': 'Copy PGN',
    'export.download': 'Download PGN',
    'export.copied': 'Copied!',
    'export.fen': 'FEN',
    'export.copyFen': 'Copy',
    'export.lichessAnalysis': 'Analyze on Lichess',
    'export.sanNote': 'PGN uses standard algebraic notation with English piece initials (K, Q, R, B, N).',
    'tab.moves': 'Moves',
    'tab.board': 'Board',
    'error.invalidMove': 'Invalid move',
    'game.white': 'White',
    'game.black': 'Black',
  },
  es: {
    'app.title': 'Escritura Rápida PGN',
    'app.placeholder': 'Escribe jugada (ej. e4, Cf3)',
    'settings.language': 'Idioma',
    'export.copy': 'Copiar PGN',
    'export.download': 'Descargar PGN',
    'export.copied': '¡Copiado!',
    'export.fen': 'FEN',
    'export.copyFen': 'Copiar',
    'export.lichessAnalysis': 'Analizar en Lichess',
    'export.sanNote': 'El PGN usa notación algebraica estándar con iniciales de piezas en inglés (K, Q, R, B, N).',
    'tab.moves': 'Jugadas',
    'tab.board': 'Tablero',
    'error.invalidMove': 'Jugada inválida',
    'game.white': 'Blancas',
    'game.black': 'Negras',
  },
};

export function t(lang: Language, key: string): string {
  return UI_TRANSLATIONS[lang]?.[key] || key;
}

export function toEnglishSAN(san: string, lang: Language): string {
  if (lang === 'en') return san;
  
  // Replace localized piece letters with English ones.
  // We need to be careful not to replace square coordinates (a-h).
  // Standard SAN pieces are always uppercase.
  // Regex to find uppercase letters that act as pieces.
  
  // Simple approach: Iterate through the reverse map and replace.
  // Optimization: Only replace P, N, B, R, Q, K if they appear at valid positions.
  // Actually, SAN is structured. Pieces are usually the first character or after a capture/promotion.
  // But a simple global replace of Uppercase letters is usually safe provided squares are lowercase.
  
  const map = REVERSE_PIECE_MAP[lang];
  return san.split('').map(char => {
    // efficient check: is it an uppercase letter in our map?
    if (map[char]) return map[char];
    return char;
  }).join('');
}

export function toLocalizedSAN(san: string, lang: Language): string {
  if (lang === 'en') return san;
  
  const map = PIECE_MAP[lang];
  return san.split('').map(char => {
    if (PIECE_MAP['en'][char]) { // Check if it is an English piece char
        return map[char] || char;
    }
    return char;
  }).join('');
}
