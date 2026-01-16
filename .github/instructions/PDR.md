# **Product Requirements Document (PRD)**

## **Product name (working)**

**Fast PGN Typist**

(Localised SAN input → editable move list → PGN export)

---

## **1\. Purpose & problem statement**

The goal is to build a **very lightweight, keyboard-first web application** that allows users to:

* Rapidly enter chess moves using **algebraic notation (SAN)**

* Use **localized piece letters** (e.g. Spanish C for knight instead of N)

* Receive **immediate validation and suggestions**

* **Edit any previously entered move**

* Export the resulting game as a **valid PGN** (copy or download)

The app is intended for:

* Transcribing handwritten chess games

* Typing moves while watching a live or recorded game

The application must be:

* **Client-only**

* **Hosted as a single HTML file on GitHub Pages**

* Accessible to other users, not just the creator

---

## **2\. Target users**

* Chess players, coaches, arbiters, or hobbyists

* Users who may not be comfortable with English algebraic notation

* Users who prioritize **speed and correctness** over advanced PGN features

---

## **3\. Platform & technical constraints**

* **Hosting**: GitHub Pages

* **Architecture**: Single HTML file

* **Backend**: None

* **Offline**: Nice to have, but not required

* **Browser support**: Modern desktop browsers (Chrome, Firefox, Edge, Safari)

---

## **4\. Core features (must-have)**

### **4.1 Move entry (primary interaction)**

* Single input field, **focused by default**

* User enters **SAN only** (e.g. e4, Nf3, Cf6, O-O, exd5, e8=Q\#)

* Input is **one move at a time**

* On confirmation (Enter):

  * Move is validated

  * Move is added to the move list

  * Input field is cleared

  * Focus stays in input field for next move

This must feel **fast and uninterrupted**.

---

### **4.2 Localized algebraic notation (critical feature)**

Users can select an **input language** that affects how piece letters are interpreted.

Example:

* English:

  * Knight → N

* Spanish:

  * Knight → C

* User types Cf6

* Internally interpreted as Nf6

#### **Localization scope (v1)**

* Localize **piece letters only**

* Squares remain standard (a1–h8)

* Supported SAN elements:

  * Piece moves

  * Pawn moves

  * Captures (x)

  * Castling (O-O, O-O-O)

  * Promotions (e8=Q)

  * Check (+) and mate (\#)

#### **Internal normalization rule**

* Localized input → **normalized to English SAN**

* Validation and game state use English SAN

* App stores:

  * Canonical English SAN

  * Localized SAN (for display/export if needed)

---

### **4.3 Validation & suggestions (important)**

#### **Validation (how it works in practice)**

The app **maintains a full chess board state** from the initial position.

For each move:

1. Generate all **legal moves** from the current position

2. Parse the user’s input (after localization normalization)

3. Check if it matches a legal move

4. If valid:

   * Accept and apply the move

5. If invalid:

   * Reject and show a clear error

This allows:

* Detection of illegal moves

* Correct handling of:

  * Ambiguity (Nbd2)

  * Checks and checkmates

  * Promotions

* Confidence that exported PGN is valid

⚠️ Important:  
This should **not be implemented from scratch**.  
The dev agent should use a small, existing chess rules engine (pure JS, client-side).

#### **Suggestions**

* While typing, show a list of **legal moves** filtered by what the user has typed

* Suggestions should respect the selected input language

* Keyboard navigation:

  * ↑ / ↓ to select suggestion

  * Enter to confirm

Autocomplete does **not** need to be perfect — filtering legal moves is sufficient.

---

### **4.4 Move list & editing**

* Moves are displayed with numbering:

```markdown

1. e4 e5

2. Nf3 Nc6

```

* Each move is:

  * Clickable

  * Keyboard-navigable (arrow keys)

* User can select a move and overwrite it

#### **Editing behavior**

* When a move is edited:

  * The game is recalculated from that move onward

  * If a later move becomes illegal:

    * All subsequent moves are **automatically removed**

* Undo / redo must work across:

  * Move entry

  * Move edits

---

### **4.5 PGN metadata (optional, not core)**

* Metadata section is **collapsed by default**

* User can click “Add header field”

* Available standard PGN fields:

  * Event, Site, Date, Round, White, Black, Result, etc.

* User can:

  * Add fields

  * Remove fields

  * Edit values freely

No metadata is mandatory.

---

### **4.6 Export**

* Export options:

  * **Copy PGN to clipboard**

  * **Download .pgn file**

* Export language:

  * English SAN

  * Localized SAN (matching user input language)

* Single game only

---

## **5\. UI language (interface translation)**

* UI labels, buttons, and messages must be translatable

* Simple dictionary-based i18n

* Default UI language: English

* UI language can be tied to input language (simpler)

---

## **6\. Non-goals (explicitly out of scope)**

* Variations ( … )

* Comments { … }

* NAGs (\!, ?, $1)

* Multiple games per file

* Chess960

* Custom starting FEN

* Cloud sync or autosave

---

## **7\. Keyboard-first interaction model**

* Input focused on load

* Enter → commit move

* Arrow keys:

  * Navigate suggestions (when input active)

  * Navigate move list (when move list focused)

* Escape → cancel edit

* Ctrl/Cmd \+ Z → undo

* Ctrl/Cmd \+ Shift \+ Z → redo

---

## **8\. Data model (conceptual)**

* settings

  * inputLanguage

  * uiLanguage

  * exportLanguage

* headers\[\]

  * { key, value }

* moves\[\]

  * { ply, sanEnglish, sanLocalized }

* history

  * Undo / redo stack

---

## **9\. Acceptance criteria**

* User can type Cf6 in Spanish mode → move accepted if legal

* Illegal moves are rejected with a clear error

* Editing a move recalculates the game correctly

* PGN export opens cleanly in standard chess software

* App works fully when hosted on GitHub Pages as a single HTML file

---

## **10\. Non-negotiables (as stated)**

* Enter moves in English **and** other languages

* Validate moves

* Edit existing moves

* Copy and download PGN

* Single-file static app

---

If you want, next steps could be:

1. I create a **very explicit technical task list** for an AI dev agent

2. I design a **minimal UI wireframe (text-based)**

3. I propose a **language mapping structure** (for adding new languages cleanly)

Just tell me which one you want next.
