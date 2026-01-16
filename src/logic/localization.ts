export type Language = 'en' | 'es' | 'it' | 'fr' | 'ca' | 'pt' | 'el' | 'ru' | 'nl' | 'no' | 'sv' | 'fi';

export const SUPPORTED_LANGUAGES: { [key in Language]: string } = {
  en: 'English',
  es: 'Español',
  it: 'Italiano',
  fr: 'Français',
  ca: 'Català',
  pt: 'Português',
  el: 'Ελληνικά',
  ru: 'Русский',
  nl: 'Nederlands',
  no: 'Norsk',
  sv: 'Svenska',
  fi: 'Suomi',
};

// Map: Language -> English Piece -> Localized Piece
// Based on Wikipedia: https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
// Pawns don't use letters in standard notation
const PIECE_MAP: { [lang in Language]: { [piece: string]: string } } = {
  en: { P: '', N: 'N', B: 'B', R: 'R', Q: 'Q', K: 'K' },
  es: { P: '', N: 'C', B: 'A', R: 'T', Q: 'D', K: 'R' }, // Caballo, Alfil, Torre, Dama, Rey
  it: { P: '', N: 'C', B: 'A', R: 'T', Q: 'D', K: 'R' }, // Cavallo, Alfiere, Torre, Donna, Re
  fr: { P: '', N: 'C', B: 'F', R: 'T', Q: 'D', K: 'R' }, // Cavalier, Fou, Tour, Dame, Roi
  ca: { P: '', N: 'C', B: 'A', R: 'T', Q: 'D', K: 'R' }, // Cavall, Alfil, Torre, Dama, Rei
  pt: { P: '', N: 'C', B: 'B', R: 'T', Q: 'D', K: 'R' }, // Cavalo, Bispo, Torre, Dama, Rei
  el: { P: '', N: 'Ι', B: 'Α', R: 'Π', Q: 'Β', K: 'Ρ' }, // Ίππος, Αξιωματικός, Πύργος, Βασίλισσα, Βασιλιάς
  ru: { P: '', N: 'К', B: 'С', R: 'Л', Q: 'Ф', K: 'Кр' }, // Конь, Слон, Ладья, Ферзь, Король
  nl: { P: '', N: 'P', B: 'L', R: 'T', Q: 'D', K: 'K' }, // Paard, Loper, Toren, Dame, Koning
  no: { P: '', N: 'S', B: 'L', R: 'T', Q: 'D', K: 'K' }, // Springer, Løper, Tårn, Dronning, Konge
  sv: { P: '', N: 'S', B: 'L', R: 'T', Q: 'D', K: 'K' }, // Springare, Löpare, Torn, Dam, Kung
  fi: { P: '', N: 'R', B: 'L', R: 'T', Q: 'D', K: 'K' }, // Ratsu, Lähetti, Torni, Daami, Kuningas
};

// Reverse Map: Language -> Localized Piece -> English Piece
const REVERSE_PIECE_MAP: { [lang in Language]: { [char: string]: string } } = {
  en: { N: 'N', B: 'B', R: 'R', Q: 'Q', K: 'K' },
  es: { C: 'N', A: 'B', T: 'R', D: 'Q', R: 'K' },
  it: { C: 'N', A: 'B', T: 'R', D: 'Q', R: 'K' },
  fr: { C: 'N', F: 'B', T: 'R', D: 'Q', R: 'K' },
  ca: { C: 'N', A: 'B', T: 'R', D: 'Q', R: 'K' },
  pt: { C: 'N', B: 'B', T: 'R', D: 'Q', R: 'K' },
  el: { 'Ι': 'N', 'Α': 'B', 'Π': 'R', 'Β': 'Q', 'Ρ': 'K' },
  ru: { 'К': 'N', 'С': 'B', 'Л': 'R', 'Ф': 'Q', 'Кр': 'K' },
  nl: { P: 'N', L: 'B', T: 'R', D: 'Q', K: 'K' },
  no: { S: 'N', L: 'B', T: 'R', D: 'Q', K: 'K' },
  sv: { S: 'N', L: 'B', T: 'R', D: 'Q', K: 'K' },
  fi: { R: 'N', L: 'B', T: 'R', D: 'Q', K: 'K' },
};

export const UI_TRANSLATIONS: { [lang in Language]: { [key: string]: string } } = {
  en: {
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
  it: {
    'app.placeholder': 'Inserisci mossa (es. e4, Cf3)',
    'settings.language': 'Lingua',
    'export.copy': 'Copia PGN',
    'export.download': 'Scarica PGN',
    'export.copied': 'Copiato!',
    'export.fen': 'FEN',
    'export.copyFen': 'Copia',
    'export.lichessAnalysis': 'Analizza su Lichess',
    'export.sanNote': 'Il PGN usa la notazione algebrica standard con iniziali dei pezzi in inglese (K, Q, R, B, N).',
    'tab.moves': 'Mosse',
    'tab.board': 'Scacchiera',
    'error.invalidMove': 'Mossa non valida',
    'game.white': 'Bianco',
    'game.black': 'Nero',
  },
  fr: {
    'app.placeholder': 'Entrez un coup (ex. e4, Cf3)',
    'settings.language': 'Langue',
    'export.copy': 'Copier PGN',
    'export.download': 'Télécharger PGN',
    'export.copied': 'Copié !',
    'export.fen': 'FEN',
    'export.copyFen': 'Copier',
    'export.lichessAnalysis': 'Analyser sur Lichess',
    'export.sanNote': 'Le PGN utilise la notation algébrique standard avec les initiales des pièces en anglais (K, Q, R, B, N).',
    'tab.moves': 'Coups',
    'tab.board': 'Échiquier',
    'error.invalidMove': 'Coup invalide',
    'game.white': 'Blancs',
    'game.black': 'Noirs',
  },
  ca: {
    'app.placeholder': 'Introdueix jugada (ex. e4, Cf3)',
    'settings.language': 'Idioma',
    'export.copy': 'Copiar PGN',
    'export.download': 'Descarregar PGN',
    'export.copied': 'Copiat!',
    'export.fen': 'FEN',
    'export.copyFen': 'Copiar',
    'export.lichessAnalysis': 'Analitzar a Lichess',
    'export.sanNote': 'El PGN utilitza notació algebraica estàndard amb inicials de peces en anglès (K, Q, R, B, N).',
    'tab.moves': 'Jugades',
    'tab.board': 'Tauler',
    'error.invalidMove': 'Jugada invàlida',
    'game.white': 'Blanques',
    'game.black': 'Negres',
  },
  pt: {
    'app.placeholder': 'Digite lance (ex. e4, Cf3)',
    'settings.language': 'Idioma',
    'export.copy': 'Copiar PGN',
    'export.download': 'Baixar PGN',
    'export.copied': 'Copiado!',
    'export.fen': 'FEN',
    'export.copyFen': 'Copiar',
    'export.lichessAnalysis': 'Analisar no Lichess',
    'export.sanNote': 'O PGN usa notação algébrica padrão com iniciais das peças em inglês (K, Q, R, B, N).',
    'tab.moves': 'Lances',
    'tab.board': 'Tabuleiro',
    'error.invalidMove': 'Lance inválido',
    'game.white': 'Brancas',
    'game.black': 'Pretas',
  },
  el: {
    'app.placeholder': 'Εισάγετε κίνηση (π.χ. e4, Ιf3)',
    'settings.language': 'Γλώσσα',
    'export.copy': 'Αντιγραφή PGN',
    'export.download': 'Λήψη PGN',
    'export.copied': 'Αντιγράφηκε!',
    'export.fen': 'FEN',
    'export.copyFen': 'Αντιγραφή',
    'export.lichessAnalysis': 'Ανάλυση στο Lichess',
    'export.sanNote': 'Το PGN χρησιμοποιεί τυπική αλγεβρική σημειογραφία με αρχικά κομματιών στα αγγλικά (K, Q, R, B, N).',
    'tab.moves': 'Κινήσεις',
    'tab.board': 'Σκακιέρα',
    'error.invalidMove': 'Μη έγκυρη κίνηση',
    'game.white': 'Λευκά',
    'game.black': 'Μαύρα',
  },
  ru: {
    'app.placeholder': 'Введите ход (напр. e4, Кf3)',
    'settings.language': 'Язык',
    'export.copy': 'Копировать PGN',
    'export.download': 'Скачать PGN',
    'export.copied': 'Скопировано!',
    'export.fen': 'FEN',
    'export.copyFen': 'Копировать',
    'export.lichessAnalysis': 'Анализ на Lichess',
    'export.sanNote': 'PGN использует стандартную алгебраическую нотацию с английскими буквами фигур (K, Q, R, B, N).',
    'tab.moves': 'Ходы',
    'tab.board': 'Доска',
    'error.invalidMove': 'Недопустимый ход',
    'game.white': 'Белые',
    'game.black': 'Чёрные',
  },
  nl: {
    'app.placeholder': 'Voer zet in (bijv. e4, Pf3)',
    'settings.language': 'Taal',
    'export.copy': 'Kopieer PGN',
    'export.download': 'Download PGN',
    'export.copied': 'Gekopieerd!',
    'export.fen': 'FEN',
    'export.copyFen': 'Kopieer',
    'export.lichessAnalysis': 'Analyseer op Lichess',
    'export.sanNote': 'PGN gebruikt standaard algebraïsche notatie met Engelse stukinitialen (K, Q, R, B, N).',
    'tab.moves': 'Zetten',
    'tab.board': 'Bord',
    'error.invalidMove': 'Ongeldige zet',
    'game.white': 'Wit',
    'game.black': 'Zwart',
  },
  no: {
    'app.placeholder': 'Skriv trekk (f.eks. e4, Sf3)',
    'settings.language': 'Språk',
    'export.copy': 'Kopier PGN',
    'export.download': 'Last ned PGN',
    'export.copied': 'Kopiert!',
    'export.fen': 'FEN',
    'export.copyFen': 'Kopier',
    'export.lichessAnalysis': 'Analyser på Lichess',
    'export.sanNote': 'PGN bruker standard algebraisk notasjon med engelske brikkebokstaver (K, Q, R, B, N).',
    'tab.moves': 'Trekk',
    'tab.board': 'Brett',
    'error.invalidMove': 'Ugyldig trekk',
    'game.white': 'Hvit',
    'game.black': 'Svart',
  },
  sv: {
    'app.placeholder': 'Ange drag (t.ex. e4, Sf3)',
    'settings.language': 'Språk',
    'export.copy': 'Kopiera PGN',
    'export.download': 'Ladda ner PGN',
    'export.copied': 'Kopierat!',
    'export.fen': 'FEN',
    'export.copyFen': 'Kopiera',
    'export.lichessAnalysis': 'Analysera på Lichess',
    'export.sanNote': 'PGN använder standard algebraisk notation med engelska pjäsbokstäver (K, Q, R, B, N).',
    'tab.moves': 'Drag',
    'tab.board': 'Bräde',
    'error.invalidMove': 'Ogiltigt drag',
    'game.white': 'Vit',
    'game.black': 'Svart',
  },
  fi: {
    'app.placeholder': 'Syötä siirto (esim. e4, Rf3)',
    'settings.language': 'Kieli',
    'export.copy': 'Kopioi PGN',
    'export.download': 'Lataa PGN',
    'export.copied': 'Kopioitu!',
    'export.fen': 'FEN',
    'export.copyFen': 'Kopioi',
    'export.lichessAnalysis': 'Analysoi Lichessissä',
    'export.sanNote': 'PGN käyttää vakio algebrallista merkintätapaa englanninkielisillä nappulakirjaimilla (K, Q, R, B, N).',
    'tab.moves': 'Siirrot',
    'tab.board': 'Lauta',
    'error.invalidMove': 'Virheellinen siirto',
    'game.white': 'Valkoinen',
    'game.black': 'Musta',
  },
};

export function t(lang: Language, key: string): string {
  return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS['en']?.[key] || key;
}

export function toEnglishSAN(san: string, lang: Language): string {
  if (lang === 'en') return san;
  
  const map = REVERSE_PIECE_MAP[lang];
  // Handle multi-character pieces like Russian Кр (King)
  let result = san;
  if (lang === 'ru' && san.includes('Кр')) {
    result = result.replace(/Кр/g, 'K');
  }
  return result.split('').map(char => {
    if (map[char]) return map[char];
    return char;
  }).join('');
}

export function toLocalizedSAN(san: string, lang: Language): string {
  if (lang === 'en') return san;
  
  const map = PIECE_MAP[lang];
  // Handle multi-character pieces like Russian Кр (King)
  if (lang === 'ru') {
    return san.split('').map(char => {
      if (char === 'K') return 'Кр';
      if (PIECE_MAP['en'][char]) {
        return map[char] || char;
      }
      return char;
    }).join('');
  }
  
  return san.split('').map(char => {
    if (PIECE_MAP['en'][char]) {
      return map[char] || char;
    }
    return char;
  }).join('');
}
