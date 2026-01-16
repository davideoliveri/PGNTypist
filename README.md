# ♞ PGN Typist

A fast, keyboard-first web app for transcribing chess games into PGN (Portable Game Notation) format.

**[→ Try it live](https://davideoliveri.github.io/PGNTypist/)**

![PGN Typist Screenshot](public/logo.svg)

## Features

- 🎯 **Keyboard-first** - Type moves quickly with autocomplete suggestions
- 🌍 **Localized notation** - Type in your language (Spanish: `Cf3`, English: `Nf3`)
- ♟️ **Real-time validation** - Only legal moves are accepted
- 📋 **One-click export** - Copy PGN to clipboard or download as file
- 📱 **Mobile-friendly** - Works great on phones and tablets
- 🔒 **Offline support** - Install as a PWA to use without internet
- 🎨 **Clean dark theme** - Easy on the eyes during long transcription sessions

## Quick Start

1. Visit the [live demo](https://davideoliveri.github.io/PGNTypist/)
2. Start typing chess moves (e.g., `e4`, `Nf3`, `O-O`)
3. Use arrow keys to navigate between moves
4. Click "Copy PGN" when done

## Tech Stack

- **React 19** + TypeScript
- **chess.js** for move validation
- **react-chessboard** for board visualization
- **Vite** with single-file build (entire app is one HTML file!)
- **PWA** with service worker for offline use

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Submit move |
| `↑` / `↓` | Navigate suggestions |
| `←` / `→` | Navigate move history |
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |

## Supported Languages

| Language | Piece Notation |
|----------|----------------|
| English | K, Q, R, B, N |
| Spanish | R, D, T, A, C |
| Italian | R, D, T, A, C |
| French | R, D, T, F, C |
| Portuguese | R, D, T, B, C |
| Greek | Ρ, Β, Π, Α, Ι |
| Russian | Кр, Ф, Л, С, К |
| Dutch | K, D, T, L, P |
| Norwegian | K, D, T, L, S |
| Swedish | K, D, T, L, S |
| Finnish | K, D, T, L, R |
| Catalan | R, D, T, A, C |

## License

MIT License - feel free to use, modify, and distribute.

---

Made with ❤️ for chess enthusiasts who prefer typing over clicking.
