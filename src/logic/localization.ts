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
    'help.title': 'How to Use',
    'help.close': 'Close',
    'help.instructions': `**Entering Moves**
Type moves in algebraic notation: e4, Nf3, O-O (castling), exd5 (captures).
Use your language's piece letters (K, Q, R, B, N for English).

**Navigation**
← → Arrow keys to browse moves
Click any move to select it

**Editing**
Type a new move to replace the selected one
Cmd/Ctrl + Z to undo, Cmd/Ctrl + Shift + Z to redo

**Comments**
Click a move to select it, then type in the comment field below the moves
Comments appear in the PGN when using "Copy with Comments" or "Download PGN"

**Deleting Moves**
Right-click (or long-press on mobile) on a move to delete it and all following moves

**Exporting**
Copy PGN or download as .pgn file
Analyze on Lichess with one click`,
    'context.deleteFromHere': 'Delete from here',
    'board.flip': 'Flip Board',
    'help.restartTutorial': 'Restart Tutorial',
    'walkthrough.skip': 'Skip',
    'walkthrough.next': 'Next',
    'walkthrough.back': 'Back',
    'walkthrough.finish': 'Get Started',
    'walkthrough.welcome.title': 'Welcome to PGN Typist!',
    'walkthrough.welcome.description': 'Let\'s take a quick tour to show you how to transcribe chess games quickly.',
    'walkthrough.enterMoves.title': 'Enter Moves',
    'walkthrough.enterMoves.description': 'Type chess moves here (e.g. e4, Nf3). Suggestions appear as you type. Press Enter to submit.',
    'walkthrough.navigation.title': 'Navigate Moves',
    'walkthrough.navigation.description': 'Click any move to select it, or use ← → arrow keys to browse through the game.',
    'walkthrough.editing.title': 'Edit Moves',
    'walkthrough.editing.description': 'Select a move and type a new one to replace it. Use Cmd/Ctrl+Z to undo.',
    'walkthrough.comments.title': 'Add Comments',
    'walkthrough.comments.description': 'Select a move, then type in the comment field to add annotations. Comments are included in the exported PGN.',
    'walkthrough.deleteMenu.title': 'Delete Moves',
    'walkthrough.deleteMenu.description': 'Right-click (or long-press on mobile) on any move to delete it and all following moves.',
    'walkthrough.export.title': 'Export Your Game',
    'walkthrough.export.description': 'Copy PGN to clipboard, download as a file, or analyze directly on Lichess.',
    'walkthrough.done.title': 'You\'re Ready!',
    'walkthrough.done.description': 'Start typing your first move. Click the ? button anytime for help.',
    'moves.deleteLast': 'Delete Last',
    'moves.clearAll': 'Clear All',
    'moves.clearComments': 'Clear Comments',
    'footer.credit': 'Made with ❤️ by',
    'update.available': 'Update available',
    'update.refresh': 'Refresh',
    'metadata.resetValues': 'Reset Values',
    'comment.placeholder': 'Comment on move {0}...',
    'comment.disabled': 'Select a move to add a comment',
    'context.deleteComment': 'Delete Comment',
    'export.copyWithComments': 'Copy with Comments',
  },
  es: {
    'app.placeholder': 'Escribe jugada (ej. e4, Cf3)',
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
    'help.title': 'Cómo Usar',
    'help.close': 'Cerrar',
    'help.instructions': `**Introducir Jugadas**
Escribe jugadas en notación algebraica: e4, Cf3, O-O (enroque), exd5 (capturas).
Usa las letras de piezas de tu idioma (R, D, T, A, C para español).

**Navegación**
← → Teclas de flecha para navegar
Haz clic en cualquier jugada para seleccionarla

**Edición**
Escribe una nueva jugada para reemplazar la seleccionada
Cmd/Ctrl + Z para deshacer, Cmd/Ctrl + Shift + Z para rehacer

**Comentarios**
Haz clic en una jugada para seleccionarla, luego escribe en el campo de comentario
Los comentarios aparecen en el PGN al usar "Copiar con Comentarios" o "Descargar PGN"

**Eliminar Jugadas**
Clic derecho (o mantener pulsado en móvil) en una jugada para eliminarla y todas las siguientes

**Exportar**
Copia el PGN o descárgalo como archivo .pgn
Analiza en Lichess con un clic`,
    'context.deleteFromHere': 'Eliminar desde aquí',
    'board.flip': 'Voltear Tablero',
    'help.restartTutorial': 'Reiniciar Tutorial',
    'walkthrough.skip': 'Omitir',
    'walkthrough.next': 'Siguiente',
    'walkthrough.back': 'Atrás',
    'walkthrough.finish': 'Empezar',
    'walkthrough.welcome.title': '¡Bienvenido a PGN Typist!',
    'walkthrough.welcome.description': 'Hagamos un recorrido rápido para mostrarte cómo transcribir partidas de ajedrez.',
    'walkthrough.enterMoves.title': 'Introducir Jugadas',
    'walkthrough.enterMoves.description': 'Escribe jugadas aquí (ej. e4, Cf3). Las sugerencias aparecen mientras escribes.',
    'walkthrough.navigation.title': 'Navegar Jugadas',
    'walkthrough.navigation.description': 'Haz clic en cualquier jugada para seleccionarla, o usa las teclas ← →.',
    'walkthrough.editing.title': 'Editar Jugadas',
    'walkthrough.editing.description': 'Selecciona una jugada y escribe una nueva para reemplazarla. Usa Cmd/Ctrl+Z para deshacer.',
    'walkthrough.comments.title': 'Añadir Comentarios',
    'walkthrough.comments.description': 'Selecciona una jugada, luego escribe en el campo de comentario para añadir anotaciones.',
    'walkthrough.deleteMenu.title': 'Eliminar Jugadas',
    'walkthrough.deleteMenu.description': 'Clic derecho (o mantener pulsado en móvil) en una jugada para eliminarla y las siguientes.',
    'walkthrough.export.title': 'Exportar tu Partida',
    'walkthrough.export.description': 'Copia el PGN, descárgalo como archivo, o analiza en Lichess.',
    'walkthrough.done.title': '¡Listo!',
    'walkthrough.done.description': 'Empieza a escribir tu primera jugada. Haz clic en ? para ayuda.',
    'moves.deleteLast': 'Eliminar Última',
    'moves.clearAll': 'Borrar Todo',
    'moves.clearComments': 'Borrar Comentarios',
    'footer.credit': 'Hecho con ❤️ por',
    'update.available': 'Actualización disponible',
    'update.refresh': 'Actualizar',
    'metadata.resetValues': 'Restablecer Valores',
    'comment.placeholder': 'Comentario en jugada {0}...',
    'comment.disabled': 'Selecciona una jugada para comentar',
    'context.deleteComment': 'Eliminar Comentario',
    'export.copyWithComments': 'Copiar con Comentarios',
  },
  it: {
    'app.placeholder': 'Inserisci mossa (es. e4, Cf3)',
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
    'help.title': 'Come Usare',
    'help.close': 'Chiudi',
    'help.instructions': `**Inserire Mosse**
Scrivi le mosse in notazione algebrica: e4, Cf3, O-O (arrocco), exd5 (catture).
Usa le lettere dei pezzi della tua lingua (R, D, T, A, C per italiano).

**Navigazione**
← → Frecce per navigare tra le mosse
Clicca su una mossa per selezionarla

**Modifica**
Scrivi una nuova mossa per sostituire quella selezionata
Cmd/Ctrl + Z per annullare, Cmd/Ctrl + Shift + Z per ripristinare

**Eliminare Mosse**
Clic destro (o pressione prolungata su mobile) su una mossa per eliminarla e tutte le successive

**Esportare**
Copia il PGN o scaricalo come file .pgn
Analizza su Lichess con un clic`,
    'context.deleteFromHere': 'Elimina da qui',
    'board.flip': 'Capovolgi Scacchiera',
    'help.restartTutorial': 'Riavvia Tutorial',
    'walkthrough.skip': 'Salta',
    'walkthrough.next': 'Avanti',
    'walkthrough.back': 'Indietro',
    'walkthrough.finish': 'Inizia',
    'walkthrough.welcome.title': 'Benvenuto in PGN Typist!',
    'walkthrough.welcome.description': 'Facciamo un breve tour per mostrarti come trascrivere partite di scacchi.',
    'walkthrough.enterMoves.title': 'Inserire Mosse',
    'walkthrough.enterMoves.description': 'Scrivi le mosse qui (es. e4, Cf3). I suggerimenti appaiono mentre scrivi.',
    'walkthrough.navigation.title': 'Navigare le Mosse',
    'walkthrough.navigation.description': 'Clicca su una mossa per selezionarla, o usa i tasti ← →.',
    'walkthrough.editing.title': 'Modificare Mosse',
    'walkthrough.editing.description': 'Seleziona una mossa e scrivi una nuova per sostituirla. Usa Cmd/Ctrl+Z per annullare.',
    'walkthrough.comments.title': 'Aggiungi Commenti',
    'walkthrough.comments.description': 'Seleziona una mossa, poi scrivi nel campo commento per aggiungere annotazioni.',
    'walkthrough.deleteMenu.title': 'Eliminare Mosse',
    'walkthrough.deleteMenu.description': 'Clic destro (o pressione prolungata su mobile) su una mossa per eliminarla e le successive.',
    'walkthrough.export.title': 'Esportare la Partita',
    'walkthrough.export.description': 'Copia il PGN, scaricalo come file, o analizza su Lichess.',
    'walkthrough.done.title': 'Pronto!',
    'walkthrough.done.description': 'Inizia a scrivere la tua prima mossa. Clicca su ? per aiuto.',
    'moves.deleteLast': 'Elimina Ultima',
    'moves.clearAll': 'Cancella Tutto',
    'moves.clearComments': 'Cancella Commenti',
    'footer.credit': 'Fatto con ❤️ da',
    'update.available': 'Aggiornamento disponibile',
    'update.refresh': 'Aggiorna',
    'metadata.resetValues': 'Ripristina Valori',
    'comment.placeholder': 'Commento alla mossa {0}...',
    'comment.disabled': 'Seleziona una mossa per commentare',
    'context.deleteComment': 'Elimina Commento',
    'export.copyWithComments': 'Copia con Commenti',
  },
  fr: {
    'app.placeholder': 'Entrez un coup (ex. e4, Cf3)',
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
    'help.title': 'Comment Utiliser',
    'help.close': 'Fermer',
    'help.instructions': `**Saisir des Coups**
Tapez les coups en notation algébrique : e4, Cf3, O-O (roque), exd5 (captures).
Utilisez les lettres de pièces de votre langue (R, D, T, F, C pour français).

**Navigation**
← → Touches fléchées pour naviguer
Cliquez sur un coup pour le sélectionner

**Édition**
Tapez un nouveau coup pour remplacer celui sélectionné
Cmd/Ctrl + Z pour annuler, Cmd/Ctrl + Shift + Z pour rétablir

**Supprimer des Coups**
Clic droit (ou appui long sur mobile) sur un coup pour le supprimer ainsi que tous les suivants

**Exporter**
Copiez le PGN ou téléchargez-le en fichier .pgn
Analysez sur Lichess en un clic`,
    'context.deleteFromHere': 'Supprimer à partir d\'ici',
    'board.flip': 'Retourner l\'Échiquier',
    'help.restartTutorial': 'Relancer le Tutoriel',
    'walkthrough.skip': 'Passer',
    'walkthrough.next': 'Suivant',
    'walkthrough.back': 'Retour',
    'walkthrough.finish': 'Commencer',
    'walkthrough.welcome.title': 'Bienvenue sur PGN Typist!',
    'walkthrough.welcome.description': 'Faisons un tour rapide pour vous montrer comment transcrire des parties d\'échecs.',
    'walkthrough.enterMoves.title': 'Saisir des Coups',
    'walkthrough.enterMoves.description': 'Tapez les coups ici (ex. e4, Cf3). Les suggestions apparaissent pendant la saisie.',
    'walkthrough.navigation.title': 'Naviguer les Coups',
    'walkthrough.navigation.description': 'Cliquez sur un coup pour le sélectionner, ou utilisez les touches ← →.',
    'walkthrough.editing.title': 'Modifier les Coups',
    'walkthrough.editing.description': 'Sélectionnez un coup et tapez un nouveau pour le remplacer. Cmd/Ctrl+Z pour annuler.',
    'walkthrough.comments.title': 'Ajouter Commentaires',
    'walkthrough.comments.description': 'Sélectionnez un coup, puis tapez dans le champ commentaire pour ajouter des annotations.',
    'walkthrough.deleteMenu.title': 'Supprimer des Coups',
    'walkthrough.deleteMenu.description': 'Clic droit (ou appui long sur mobile) sur un coup pour le supprimer ainsi que les suivants.',
    'walkthrough.export.title': 'Exporter la Partie',
    'walkthrough.export.description': 'Copiez le PGN, téléchargez-le, ou analysez sur Lichess.',
    'walkthrough.done.title': 'C\'est Parti!',
    'walkthrough.done.description': 'Commencez à taper votre premier coup. Cliquez sur ? pour l\'aide.',
    'moves.deleteLast': 'Supprimer Dernier',
    'moves.clearAll': 'Tout Effacer',
    'moves.clearComments': 'Effacer Commentaires',
    'footer.credit': 'Fait avec ❤️ par',
    'update.available': 'Mise à jour disponible',
    'update.refresh': 'Actualiser',
    'metadata.resetValues': 'Réinitialiser Valeurs',
    'comment.placeholder': 'Commentaire sur coup {0}...',
    'comment.disabled': 'Sélectionnez un coup pour commenter',
    'context.deleteComment': 'Supprimer Commentaire',
    'export.copyWithComments': 'Copier avec Commentaires',
  },
  ca: {
    'app.placeholder': 'Introdueix jugada (ex. e4, Cf3)',
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
    'help.title': 'Com Utilitzar',
    'help.close': 'Tancar',
    'help.instructions': `**Introduir Jugades**
Escriu jugades en notació algebraica: e4, Cf3, O-O (enroc), exd5 (captures).
Utilitza les lletres de peces del teu idioma (R, D, T, A, C per català).

**Navegació**
← → Tecles de fletxa per navegar
Fes clic a qualsevol jugada per seleccionar-la

**Edició**
Escriu una nova jugada per substituir la seleccionada
Cmd/Ctrl + Z per desfer, Cmd/Ctrl + Shift + Z per refer

**Eliminar Jugades**
Clic dret (o mantenir premut en mòbil) en una jugada per eliminar-la i totes les següents

**Exportar**
Copia el PGN o descarrega'l com a fitxer .pgn
Analitza a Lichess amb un clic`,
    'context.deleteFromHere': 'Eliminar des d\'aquí',
    'board.flip': 'Girar Tauler',
    'help.restartTutorial': 'Reiniciar Tutorial',
    'walkthrough.skip': 'Ometre',
    'walkthrough.next': 'Següent',
    'walkthrough.back': 'Enrere',
    'walkthrough.finish': 'Començar',
    'walkthrough.welcome.title': 'Benvingut a PGN Typist!',
    'walkthrough.welcome.description': 'Fem un tour ràpid per mostrar-te com transcriure partides d\'escacs.',
    'walkthrough.enterMoves.title': 'Introduir Jugades',
    'walkthrough.enterMoves.description': 'Escriu jugades aquí (ex. e4, Cf3). Els suggeriments apareixen mentre escrius.',
    'walkthrough.navigation.title': 'Navegar Jugades',
    'walkthrough.navigation.description': 'Fes clic a qualsevol jugada per seleccionar-la, o usa les tecles ← →.',
    'walkthrough.editing.title': 'Editar Jugades',
    'walkthrough.editing.description': 'Selecciona una jugada i escriu una nova per substituir-la. Usa Cmd/Ctrl+Z per desfer.',
    'walkthrough.comments.title': 'Afegir Comentaris',
    'walkthrough.comments.description': 'Selecciona una jugada, llavors escriu al camp de comentari per afegir anotacions.',
    'walkthrough.deleteMenu.title': 'Eliminar Jugades',
    'walkthrough.deleteMenu.description': 'Clic dret (o mantenir premut en mòbil) en una jugada per eliminar-la i les següents.',
    'walkthrough.export.title': 'Exportar la Partida',
    'walkthrough.export.description': 'Copia el PGN, descarrega\'l, o analitza a Lichess.',
    'walkthrough.done.title': 'Preparat!',
    'walkthrough.done.description': 'Comença a escriure la teva primera jugada. Clica a ? per ajuda.',
    'moves.deleteLast': 'Eliminar Última',
    'moves.clearAll': 'Esborrar Tot',
    'footer.credit': 'Fet amb ❤️ per',
    'update.available': 'Actualització disponible',
    'update.refresh': 'Actualitzar',
    'metadata.resetValues': 'Restablir Valors',
    'comment.placeholder': 'Comentari a la jugada {0}...',
    'comment.disabled': 'Selecciona una jugada per comentar',
    'context.deleteComment': 'Eliminar Comentari',
    'export.copyWithComments': 'Copiar amb Comentaris',
    'moves.clearComments': 'Esborrar Comentaris',
  },
  pt: {
    'app.placeholder': 'Digite lance (ex. e4, Cf3)',
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
    'help.title': 'Como Usar',
    'help.close': 'Fechar',
    'help.instructions': `**Inserir Lances**
Digite lances em notação algébrica: e4, Cf3, O-O (roque), exd5 (capturas).
Use as letras das peças do seu idioma (R, D, T, B, C para português).

**Navegação**
← → Teclas de seta para navegar
Clique em qualquer lance para selecioná-lo

**Edição**
Digite um novo lance para substituir o selecionado
Cmd/Ctrl + Z para desfazer, Cmd/Ctrl + Shift + Z para refazer

**Excluir Lances**
Clique direito (ou pressione longamente no celular) em um lance para excluí-lo e todos os seguintes

**Exportar**
Copie o PGN ou baixe como arquivo .pgn
Analise no Lichess com um clique`,
    'context.deleteFromHere': 'Excluir daqui',
    'board.flip': 'Virar Tabuleiro',
    'help.restartTutorial': 'Reiniciar Tutorial',
    'walkthrough.skip': 'Pular',
    'walkthrough.next': 'Próximo',
    'walkthrough.back': 'Voltar',
    'walkthrough.finish': 'Começar',
    'walkthrough.welcome.title': 'Bem-vindo ao PGN Typist!',
    'walkthrough.welcome.description': 'Vamos fazer um tour rápido para mostrar como transcrever partidas de xadrez.',
    'walkthrough.enterMoves.title': 'Inserir Lances',
    'walkthrough.enterMoves.description': 'Digite lances aqui (ex. e4, Cf3). Sugestões aparecem enquanto você digita.',
    'walkthrough.navigation.title': 'Navegar Lances',
    'walkthrough.navigation.description': 'Clique em qualquer lance para selecioná-lo, ou use as teclas ← →.',
    'walkthrough.editing.title': 'Editar Lances',
    'walkthrough.editing.description': 'Selecione um lance e digite um novo para substituí-lo. Use Cmd/Ctrl+Z para desfazer.',
    'walkthrough.comments.title': 'Adicionar Comentários',
    'walkthrough.comments.description': 'Selecione um lance, depois digite no campo de comentário para adicionar anotações.',
    'walkthrough.deleteMenu.title': 'Excluir Lances',
    'walkthrough.deleteMenu.description': 'Clique direito (ou pressione longamente no celular) em um lance para excluí-lo e os seguintes.',
    'walkthrough.export.title': 'Exportar a Partida',
    'walkthrough.export.description': 'Copie o PGN, baixe como arquivo, ou analise no Lichess.',
    'walkthrough.done.title': 'Pronto!',
    'walkthrough.done.description': 'Comece a digitar seu primeiro lance. Clique em ? para ajuda.',
    'moves.deleteLast': 'Excluir Último',
    'moves.clearAll': 'Limpar Tudo',
    'moves.clearComments': 'Limpar Comentários',
    'footer.credit': 'Feito com ❤️ por',
    'update.available': 'Atualização disponível',
    'update.refresh': 'Atualizar',
    'metadata.resetValues': 'Redefinir Valores',
    'comment.placeholder': 'Comentar lance {0}...',
    'comment.disabled': 'Selecione um lance para comentar',
    'context.deleteComment': 'Excluir Comentário',
    'export.copyWithComments': 'Copiar com Comentários',
  },
  el: {
    'app.placeholder': 'Εισάγετε κίνηση (π.χ. e4, Ιf3)',
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
    'help.title': 'Πώς να Χρησιμοποιήσετε',
    'help.close': 'Κλείσιμο',
    'help.instructions': `**Εισαγωγή Κινήσεων**
Πληκτρολογήστε κινήσεις σε αλγεβρική σημειογραφία: e4, Ιf3, O-O (ροκέ), exd5 (αιχμαλωσίες).
Χρησιμοποιήστε τα γράμματα κομματιών της γλώσσας σας (Ρ, Β, Π, Α, Ι για ελληνικά).

**Πλοήγηση**
← → Πλήκτρα βέλους για περιήγηση
Κάντε κλικ σε οποιαδήποτε κίνηση για να την επιλέξετε

**Επεξεργασία**
Πληκτρολογήστε μια νέα κίνηση για να αντικαταστήσετε την επιλεγμένη
Cmd/Ctrl + Z για αναίρεση, Cmd/Ctrl + Shift + Z για επανάληψη

**Διαγραφή Κινήσεων**
Δεξί κλικ (ή παρατεταμένο πάτημα σε κινητό) σε μια κίνηση για να τη διαγράψετε μαζί με όλες τις επόμενες

**Εξαγωγή**
Αντιγράψτε το PGN ή κατεβάστε το ως αρχείο .pgn
Αναλύστε στο Lichess με ένα κλικ`,
    'context.deleteFromHere': 'Διαγραφή από εδώ',
    'board.flip': 'Αναποδογύρισε τη Σκακιέρα',
    'help.restartTutorial': 'Επανεκκίνηση Εκμάθησης',
    'walkthrough.skip': 'Παράλειψη',
    'walkthrough.next': 'Επόμενο',
    'walkthrough.back': 'Πίσω',
    'walkthrough.finish': 'Ξεκίνα',
    'walkthrough.welcome.title': 'Καλώς ήρθατε στο PGN Typist!',
    'walkthrough.welcome.description': 'Ας κάνουμε μια γρήγορη ξενάγηση για να δείτε πώς να μεταγράψετε παρτίδες σκάκι.',
    'walkthrough.enterMoves.title': 'Εισαγωγή Κινήσεων',
    'walkthrough.enterMoves.description': 'Πληκτρολογήστε κινήσεις εδώ (π.χ. e4, Ιf3). Προτάσεις εμφανίζονται καθώς πληκτρολογείτε.',
    'walkthrough.navigation.title': 'Πλοήγηση Κινήσεων',
    'walkthrough.navigation.description': 'Κάντε κλικ σε οποιαδήποτε κίνηση για να την επιλέξετε, ή χρησιμοποιήστε τα πλήκτρα ← →.',
    'walkthrough.editing.title': 'Επεξεργασία Κινήσεων',
    'walkthrough.editing.description': 'Επιλέξτε μια κίνηση και πληκτρολογήστε μια νέα για να την αντικαταστήσετε. Cmd/Ctrl+Z για αναίρεση.',
    'walkthrough.comments.title': 'Προσθήκη Σχολίων',
    'walkthrough.comments.description': 'Επιλέξτε μια κίνηση, στη συνέχεια πληκτρολογήστε στο πεδίο σχολίου για να προσθέσετε σημειώσεις.',
    'walkthrough.deleteMenu.title': 'Διαγραφή Κινήσεων',
    'walkthrough.deleteMenu.description': 'Δεξί κλικ (ή παρατεταμένο πάτημα σε κινητό) σε κίνηση για διαγραφή αυτής και των επόμενων.',
    'walkthrough.export.title': 'Εξαγωγή Παρτίδας',
    'walkthrough.export.description': 'Αντιγράψτε το PGN, κατεβάστε το, ή αναλύστε στο Lichess.',
    'walkthrough.done.title': 'Έτοιμοι!',
    'walkthrough.done.description': 'Αρχίστε να πληκτρολογείτε την πρώτη σας κίνηση. Κάντε κλικ στο ? για βοήθεια.',
    'moves.deleteLast': 'Διαγραφή Τελευταίας',
    'moves.clearAll': 'Διαγραφή Όλων',
    'moves.clearComments': 'Διαγραφή Σχολίων',
    'footer.credit': 'Φτιάχτηκε με ❤️ από',
    'update.available': 'Διαθέσιμη ενημέρωση',
    'update.refresh': 'Ανανέωση',
    'metadata.resetValues': 'Επαναφορά Τιμών',
    'comment.placeholder': 'Σχόλιο στην κίνηση {0}...',
    'comment.disabled': 'Επιλέξτε μια κίνηση για σχόλιο',
    'context.deleteComment': 'Διαγραφή Σχολίου',
    'export.copyWithComments': 'Αντιγραφή με Σχόλια',
  },
  ru: {
    'app.placeholder': 'Введите ход (напр. e4, Кf3)',
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
    'help.title': 'Как Использовать',
    'help.close': 'Закрыть',
    'help.instructions': `**Ввод Ходов**
Вводите ходы в алгебраической нотации: e4, Кf3, O-O (рокировка), exd5 (взятия).
Используйте буквы фигур вашего языка (Кр, Ф, Л, С, К для русского).

**Навигация**
← → Стрелки для навигации
Нажмите на любой ход, чтобы выбрать его

**Редактирование**
Введите новый ход, чтобы заменить выбранный
Cmd/Ctrl + Z для отмены, Cmd/Ctrl + Shift + Z для повтора

**Удаление Ходов**
Правый клик (или долгое нажатие на мобильном) на ходе, чтобы удалить его и все последующие

**Экспорт**
Скопируйте PGN или скачайте как файл .pgn
Анализируйте на Lichess одним кликом`,
    'context.deleteFromHere': 'Удалить отсюда',
    'board.flip': 'Перевернуть Доску',
    'help.restartTutorial': 'Перезапустить Обучение',
    'walkthrough.skip': 'Пропустить',
    'walkthrough.next': 'Далее',
    'walkthrough.back': 'Назад',
    'walkthrough.finish': 'Начать',
    'walkthrough.welcome.title': 'Добро пожаловать в PGN Typist!',
    'walkthrough.welcome.description': 'Давайте сделаем быстрый обзор, чтобы показать, как транскрибировать шахматные партии.',
    'walkthrough.enterMoves.title': 'Ввод Ходов',
    'walkthrough.enterMoves.description': 'Вводите ходы здесь (напр. e4, Кf3). Подсказки появляются при вводе.',
    'walkthrough.navigation.title': 'Навигация по Ходам',
    'walkthrough.navigation.description': 'Нажмите на любой ход для выбора, или используйте клавиши ← →.',
    'walkthrough.editing.title': 'Редактирование Ходов',
    'walkthrough.editing.description': 'Выберите ход и введите новый для замены. Cmd/Ctrl+Z для отмены.',
    'walkthrough.comments.title': 'Добавить Комментарии',
    'walkthrough.comments.description': 'Выберите ход, затем введите текст в поле комментария для добавления аннотаций.',
    'walkthrough.deleteMenu.title': 'Удаление Ходов',
    'walkthrough.deleteMenu.description': 'Правый клик (или долгое нажатие на мобильном) на ходе для удаления его и последующих.',
    'walkthrough.export.title': 'Экспорт Партии',
    'walkthrough.export.description': 'Скопируйте PGN, скачайте файл, или анализируйте на Lichess.',
    'walkthrough.done.title': 'Готово!',
    'walkthrough.done.description': 'Начните вводить первый ход. Нажмите ? для помощи.',
    'moves.deleteLast': 'Удалить Последний',
    'moves.clearAll': 'Очистить Всё',
    'moves.clearComments': 'Очистить Комментарии',
    'footer.credit': 'Сделано с ❤️',
    'update.available': 'Доступно обновление',
    'update.refresh': 'Обновить',
    'metadata.resetValues': 'Сбросить Значения',
    'comment.placeholder': 'Комментарий к ходу {0}...',
    'comment.disabled': 'Выберите ход для комментирования',
    'context.deleteComment': 'Удалить Комментарий',
    'export.copyWithComments': 'Копировать с Комментариями',
  },
  nl: {
    'app.placeholder': 'Voer zet in (bijv. e4, Pf3)',
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
    'help.title': 'Hoe te Gebruiken',
    'help.close': 'Sluiten',
    'help.instructions': `**Zetten Invoeren**
Typ zetten in algebraïsche notatie: e4, Pf3, O-O (rokade), exd5 (slagen).
Gebruik de stukletters van je taal (K, D, T, L, P voor Nederlands).

**Navigatie**
← → Pijltjestoetsen om te navigeren
Klik op een zet om deze te selecteren

**Bewerken**
Typ een nieuwe zet om de geselecteerde te vervangen
Cmd/Ctrl + Z om ongedaan te maken, Cmd/Ctrl + Shift + Z om opnieuw te doen

**Zetten Verwijderen**
Rechtsklik (of lang indrukken op mobiel) op een zet om deze en alle volgende te verwijderen

**Exporteren**
Kopieer PGN of download als .pgn-bestand
Analyseer op Lichess met één klik`,
    'context.deleteFromHere': 'Verwijder vanaf hier',
    'board.flip': 'Bord Draaien',
    'help.restartTutorial': 'Tutorial Herstarten',
    'walkthrough.skip': 'Overslaan',
    'walkthrough.next': 'Volgende',
    'walkthrough.back': 'Terug',
    'walkthrough.finish': 'Starten',
    'walkthrough.welcome.title': 'Welkom bij PGN Typist!',
    'walkthrough.welcome.description': 'Laten we een snelle rondleiding maken om te laten zien hoe je schaakpartijen transcribeert.',
    'walkthrough.enterMoves.title': 'Zetten Invoeren',
    'walkthrough.enterMoves.description': 'Typ zetten hier (bijv. e4, Pf3). Suggesties verschijnen terwijl je typt.',
    'walkthrough.navigation.title': 'Zetten Navigeren',
    'walkthrough.navigation.description': 'Klik op een zet om deze te selecteren, of gebruik de ← → toetsen.',
    'walkthrough.editing.title': 'Zetten Bewerken',
    'walkthrough.editing.description': 'Selecteer een zet en typ een nieuwe om te vervangen. Cmd/Ctrl+Z om ongedaan te maken.',
    'walkthrough.comments.title': 'Reacties Toevoegen',
    'walkthrough.comments.description': 'Selecteer een zet en typ in het reactieveld om annotaties toe te voegen.',
    'walkthrough.deleteMenu.title': 'Zetten Verwijderen',
    'walkthrough.deleteMenu.description': 'Rechtsklik (of lang indrukken op mobiel) op een zet om deze en volgende te verwijderen.',
    'walkthrough.export.title': 'Partij Exporteren',
    'walkthrough.export.description': 'Kopieer PGN, download als bestand, of analyseer op Lichess.',
    'walkthrough.done.title': 'Klaar!',
    'walkthrough.done.description': 'Begin met het typen van je eerste zet. Klik op ? voor hulp.',
    'moves.deleteLast': 'Laatste Verwijderen',
    'moves.clearAll': 'Alles Wissen',
    'moves.clearComments': 'Reacties Wissen',
    'footer.credit': 'Gemaakt met ❤️ door',
    'update.available': 'Update beschikbaar',
    'update.refresh': 'Vernieuwen',
    'metadata.resetValues': 'Waarden Resetten',
    'comment.placeholder': 'Opmerking bij zet {0}...',
    'comment.disabled': 'Selecteer een zet om te becommentariëren',
    'context.deleteComment': 'Reactie Verwijderen',
    'export.copyWithComments': 'Kopieren met Reacties',
  },
  no: {
    'app.placeholder': 'Skriv trekk (f.eks. e4, Sf3)',
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
    'help.title': 'Hvordan Bruke',
    'help.close': 'Lukk',
    'help.instructions': `**Skrive Trekk**
Skriv trekk i algebraisk notasjon: e4, Sf3, O-O (rokade), exd5 (slag).
Bruk brikkebokstavene for ditt språk (K, D, T, L, S for norsk).

**Navigasjon**
← → Piltaster for å navigere
Klikk på et trekk for å velge det

**Redigering**
Skriv et nytt trekk for å erstatte det valgte
Cmd/Ctrl + Z for å angre, Cmd/Ctrl + Shift + Z for å gjenta

**Slette Trekk**
Høyreklikk (eller langt trykk på mobil) på et trekk for å slette det og alle følgende

**Eksportere**
Kopier PGN eller last ned som .pgn-fil
Analyser på Lichess med ett klikk`,
    'context.deleteFromHere': 'Slett herfra',
    'board.flip': 'Snu Brettet',
    'help.restartTutorial': 'Start Opplæring på Nytt',
    'walkthrough.skip': 'Hopp over',
    'walkthrough.next': 'Neste',
    'walkthrough.back': 'Tilbake',
    'walkthrough.finish': 'Start',
    'walkthrough.welcome.title': 'Velkommen til PGN Typist!',
    'walkthrough.welcome.description': 'La oss ta en rask omvisning for å vise deg hvordan du transkriberer sjakkpartier.',
    'walkthrough.enterMoves.title': 'Skrive Trekk',
    'walkthrough.enterMoves.description': 'Skriv trekk her (f.eks. e4, Sf3). Forslag vises mens du skriver.',
    'walkthrough.navigation.title': 'Navigere Trekk',
    'walkthrough.navigation.description': 'Klikk på et trekk for å velge det, eller bruk ← → tastene.',
    'walkthrough.editing.title': 'Redigere Trekk',
    'walkthrough.editing.description': 'Velg et trekk og skriv et nytt for å erstatte det. Cmd/Ctrl+Z for å angre.',
    'walkthrough.comments.title': 'Legg til Kommentarer',
    'walkthrough.comments.description': 'Velg et trekk, deretter skriv i kommentarfeltet for å legge til notater.',
    'walkthrough.deleteMenu.title': 'Slette Trekk',
    'walkthrough.deleteMenu.description': 'Høyreklikk (eller langt trykk på mobil) på et trekk for å slette det og følgende.',
    'walkthrough.export.title': 'Eksportere Parti',
    'walkthrough.export.description': 'Kopier PGN, last ned som fil, eller analyser på Lichess.',
    'walkthrough.done.title': 'Klar!',
    'walkthrough.done.description': 'Begynn å skrive ditt første trekk. Klikk på ? for hjelp.',
    'moves.deleteLast': 'Slett Siste',
    'moves.clearAll': 'Tøm Alt',
    'moves.clearComments': 'Slett Kommentarer',
    'footer.credit': 'Laget med ❤️ av',
    'update.available': 'Oppdatering tilgjengelig',
    'update.refresh': 'Oppdater',
    'metadata.resetValues': 'Tilbakestill Verdier',
    'comment.placeholder': 'Kommentar til trekk {0}...',
    'comment.disabled': 'Velg et trekk for å kommentere',
    'context.deleteComment': 'Slett Kommentar',
    'export.copyWithComments': 'Kopier med Kommentarer',
  },
  sv: {
    'app.placeholder': 'Ange drag (t.ex. e4, Sf3)',
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
    'help.title': 'Hur man Använder',
    'help.close': 'Stäng',
    'help.instructions': `**Ange Drag**
Skriv drag i algebraisk notation: e4, Sf3, O-O (rockad), exd5 (slag).
Använd pjäsbokstäverna för ditt språk (K, D, T, L, S för svenska).

**Navigering**
← → Piltangenter för att navigera
Klicka på ett drag för att välja det

**Redigering**
Skriv ett nytt drag för att ersätta det valda
Cmd/Ctrl + Z för att ångra, Cmd/Ctrl + Shift + Z för att göra om

**Ta bort Drag**
Högerklicka (eller långt tryck på mobil) på ett drag för att ta bort det och alla följande

**Exportera**
Kopiera PGN eller ladda ner som .pgn-fil
Analysera på Lichess med ett klick`,
    'context.deleteFromHere': 'Ta bort härifrån',
    'board.flip': 'Vänd Brädet',
    'help.restartTutorial': 'Starta om Handledning',
    'walkthrough.skip': 'Hoppa över',
    'walkthrough.next': 'Nästa',
    'walkthrough.back': 'Tillbaka',
    'walkthrough.finish': 'Börja',
    'walkthrough.welcome.title': 'Välkommen till PGN Typist!',
    'walkthrough.welcome.description': 'Låt oss ta en snabb rundtur för att visa hur du transkriberar schackpartier.',
    'walkthrough.enterMoves.title': 'Ange Drag',
    'walkthrough.enterMoves.description': 'Skriv drag här (t.ex. e4, Sf3). Förslag visas medan du skriver.',
    'walkthrough.navigation.title': 'Navigera Drag',
    'walkthrough.navigation.description': 'Klicka på ett drag för att välja det, eller använd ← → tangenterna.',
    'walkthrough.editing.title': 'Redigera Drag',
    'walkthrough.editing.description': 'Välj ett drag och skriv ett nytt för att ersätta det. Cmd/Ctrl+Z för att ångra.',
    'walkthrough.comments.title': 'Lägg till Kommentarer',
    'walkthrough.comments.description': 'Välj ett drag, skriv sedan i kommentarsfältet för att lägga till anteckningar.',
    'walkthrough.deleteMenu.title': 'Ta bort Drag',
    'walkthrough.deleteMenu.description': 'Högerklicka (eller långt tryck på mobil) på ett drag för att ta bort det och följande.',
    'walkthrough.export.title': 'Exportera Parti',
    'walkthrough.export.description': 'Kopiera PGN, ladda ner som fil, eller analysera på Lichess.',
    'walkthrough.done.title': 'Redo!',
    'walkthrough.done.description': 'Börja skriva ditt första drag. Klicka på ? för hjälp.',
    'moves.deleteLast': 'Ta bort Senaste',
    'moves.clearAll': 'Rensa Allt',
    'moves.clearComments': 'Rensa Kommentarer',
    'footer.credit': 'Gjord med ❤️ av',
    'update.available': 'Uppdatering tillgänglig',
    'update.refresh': 'Uppdatera',
    'metadata.resetValues': 'Återställ Värden',
    'comment.placeholder': 'Kommentar till drag {0}...',
    'comment.disabled': 'Välj ett drag för att kommentera',
    'context.deleteComment': 'Ta bort Kommentar',
    'export.copyWithComments': 'Kopiera med Kommentarer',
  },
  fi: {
    'app.placeholder': 'Syötä siirto (esim. e4, Rf3)',
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
    'help.title': 'Käyttöohjeet',
    'help.close': 'Sulje',
    'help.instructions': `**Siirtojen Syöttäminen**
Kirjoita siirrot algebrallisessa merkinnässä: e4, Rf3, O-O (linnoitus), exd5 (lyönnit).
Käytä kielesi nappulakirjaimia (K, D, T, L, R suomeksi).

**Navigointi**
← → Nuolinäppäimet selaamiseen
Napsauta siirtoa valitaksesi sen

**Muokkaus**
Kirjoita uusi siirto korvataksesi valitun
Cmd/Ctrl + Z kumotaksesi, Cmd/Ctrl + Shift + Z toistaaksesi

**Siirtojen Poistaminen**
Oikea napsautus (tai pitkä painallus mobiilissa) siirrossa poistaaksesi sen ja kaikki seuraavat

**Vienti**
Kopioi PGN tai lataa .pgn-tiedostona
Analysoi Lichessissä yhdellä napsautuksella`,
    'context.deleteFromHere': 'Poista tästä eteenpäin',
    'board.flip': 'Käännä Lauta',
    'help.restartTutorial': 'Aloita Opas Uudelleen',
    'walkthrough.skip': 'Ohita',
    'walkthrough.next': 'Seuraava',
    'walkthrough.back': 'Takaisin',
    'walkthrough.finish': 'Aloita',
    'walkthrough.welcome.title': 'Tervetuloa PGN Typistiin!',
    'walkthrough.welcome.description': 'Tehdään nopea kierros näyttääksemme miten shakkipelejä kirjataan.',
    'walkthrough.enterMoves.title': 'Syötä Siirtoja',
    'walkthrough.enterMoves.description': 'Kirjoita siirrot tähän (esim. e4, Rf3). Ehdotukset näkyvät kirjoittaessa.',
    'walkthrough.navigation.title': 'Selaa Siirtoja',
    'walkthrough.navigation.description': 'Napsauta siirtoa valitaksesi sen, tai käytä ← → näppäimiä.',
    'walkthrough.editing.title': 'Muokkaa Siirtoja',
    'walkthrough.editing.description': 'Valitse siirto ja kirjoita uusi korvataksesi sen. Cmd/Ctrl+Z kumoamiseen.',
    'walkthrough.comments.title': 'Lisää Kommentteja',
    'walkthrough.comments.description': 'Valitse siirto ja kirjoita kommenttikenttään lisätäksesi merkintöjä.',
    'walkthrough.deleteMenu.title': 'Poista Siirtoja',
    'walkthrough.deleteMenu.description': 'Oikea napsautus (tai pitkä painallus mobiilissa) siirrossa poistaaksesi sen ja seuraavat.',
    'walkthrough.export.title': 'Vie Peli',
    'walkthrough.export.description': 'Kopioi PGN, lataa tiedostona, tai analysoi Lichessissä.',
    'walkthrough.done.title': 'Valmis!',
    'walkthrough.done.description': 'Aloita kirjoittamalla ensimmäinen siirtosi. Napsauta ? saadaksesi apua.',
    'moves.deleteLast': 'Poista Viimeinen',
    'moves.clearAll': 'Tyhjennä Kaikki',
    'moves.clearComments': 'Tyhjennä Kommentit',
    'footer.credit': 'Tehty rakkaudella ❤️',
    'update.available': 'Päivitys saatavilla',
    'update.refresh': 'Päivitä',
    'metadata.resetValues': 'Nollaa Arvot',
    'comment.placeholder': 'Kommentti siirtoon {0}...',
    'comment.disabled': 'Valitse siirto kommentoidaksesi',
    'context.deleteComment': 'Poista Kommentti',
    'export.copyWithComments': 'Kopioi Kommenteilla',
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
