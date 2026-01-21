import { useState, useCallback, useMemo } from 'react';
import { Chess, Move } from 'chess.js';
import { toLocalizedSAN, type Language } from './localization';

export interface GameState {
  fen: string;
  turn: 'w' | 'b';
  isCheck: boolean;
  isCheckmate: boolean;
  isDraw: boolean;
  lastMove: Move | null;
  moveList: string[]; // English SAN
  history: { ply: number; move: Move }[]; // Detailed history from chess.js
}

// Type for history state (moves + comments together for undo/redo)
interface HistoryState {
  moves: string[];
  comments: Record<number, string>;
}

export function useChessGame(initialMoves: string[] = [], initialComments: Record<number, string> = {}) {
  // The source of truth is the array of moves (English SAN).
  const [moves, setMoves] = useState<string[]>(initialMoves);
  // Comments keyed by move index (half-ply)
  const [comments, setComments] = useState<Record<number, string>>(initialComments);
  // History for Undo/Redo (of the moves + comments together)
  const [historyStack, setHistoryStack] = useState<HistoryState[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryState[]>([]);

  // Selection/Focus state
  // If null, we are at the end of the game (appending).
  // If number, we are focusing on that index in the moves array (to edit it).
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const pushHistory = (newMoves: string[], newComments?: Record<number, string>) => {
    setHistoryStack((prev) => [...prev, { moves, comments }]);
    setRedoStack([]);
    setMoves(newMoves);
    if (newComments !== undefined) {
      setComments(newComments);
    }
  };

  const undo = useCallback(() => {
    if (historyStack.length === 0) return;
    const prev = historyStack[historyStack.length - 1];
    setRedoStack((r) => [{ moves, comments }, ...r]);
    setHistoryStack((h) => h.slice(0, -1));
    setMoves(prev.moves);
    setComments(prev.comments);
    setSelectedIndex(null); // Reset selection on undo
  }, [historyStack, moves, comments]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistoryStack((h) => [...h, { moves, comments }]);
    setRedoStack((r) => r.slice(1));
    setMoves(next.moves);
    setComments(next.comments);
    setSelectedIndex(null);
  }, [redoStack, moves, comments]);

  // Derived state: Replay the game
  // Let's compute the FULL game state first.
  // let validMoves: string[] = [];

  // for (const san of moves) {
  //   try {
  //     chess.move(san);
  //     validMoves.push(san);
  //   } catch (e) {
  //     // Should not happen if we validate on input, but if editing causes downstream illegality, we truncate.
  //     // The truncate logic handles this in 'editMove', so here we just assume validity or stop.
  //     break;
  //   }
  // }

  // return { chess, validMoves };

  // Compute state at the cursor (for display and validation of new input)
  // If selectedIndex is null, cursor is at end.
  // If selectedIndex is 0, cursor is at start (move 1).
  const cursorGame = useMemo(() => {
    const chess = new Chess();
    const limit = selectedIndex === null ? moves.length : selectedIndex;

    for (let i = 0; i < limit; i++) {
      try {
        chess.move(moves[i]);
      } catch (e) { break; }
    }
    return chess;
  }, [moves, selectedIndex]);

  const addMove = useCallback((san: string) => {
    // 1. Validate against cursorGame
    try {
      // clone to test
      const temp = new Chess(cursorGame.fen());
      temp.move(san);
      // valid
    } catch (e) {
      return false;
    }

    if (selectedIndex === null) {
      // Append
      pushHistory([...moves, san]);
    } else {
      // Edit/Insert at index
      // We replace the move at selectedIndex
      // Then we try to replay subsequent moves from 'moves' list.
      const newMoves = moves.slice(0, selectedIndex);
      newMoves.push(san);

      // Replay rest
      const tempGame = new Chess(cursorGame.fen());
      tempGame.move(san);

      for (let i = selectedIndex + 1; i < moves.length; i++) {
        try {
          tempGame.move(moves[i]);
          newMoves.push(moves[i]);
        } catch (e) {
          // Future move is now invalid -> Truncate rest
          break;
        }
      }

      pushHistory(newMoves);
      // Advance cursor to next move (or end) behavior?
      // PDR: "Input focus stays in input field for next move"
      // If editing, maybe we just complete the edit and go to next ply?
      // For now, let's reset selection to null (append mode) or advance?
      // PDR doesn't explicitly say "remain in edit mode for subsequent moves".
      // Usually if you fix a move, you might want to continue entering from there.
      // Let's set selection to next index if it exists, or null if we are at end.
      if (selectedIndex + 1 < newMoves.length) {
        setSelectedIndex(selectedIndex + 1);
      } else {
        setSelectedIndex(null);
      }
    }
    return true;
  }, [cursorGame, moves, selectedIndex]);

  const setCursor = (indexOrFn: number | null | ((prev: number | null) => number | null)) => {
    if (typeof indexOrFn === 'function') {
      setSelectedIndex(prev => indexOrFn(prev));
    } else {
      setSelectedIndex(indexOrFn);
    }
  };

  const getLegalMoves = (lang: Language): string[] => {
    const moves = cursorGame.moves();
    // Localize
    return moves.map(m => toLocalizedSAN(m, lang));
  };

  // Helper to filter out comments for indices >= threshold
  const filterOrphanedComments = (threshold: number): Record<number, string> => {
    const filtered: Record<number, string> = {};
    for (const [key, value] of Object.entries(comments)) {
      const idx = Number(key);
      if (idx < threshold) {
        filtered[idx] = value;
      }
    }
    return filtered;
  };

  const truncateFromIndex = useCallback((index: number) => {
    if (index < 0 || index >= moves.length) return;
    const newMoves = moves.slice(0, index);
    const newComments = filterOrphanedComments(index);
    pushHistory(newMoves, newComments);
    setSelectedIndex(null);
  }, [moves, comments]);

  const deleteLast = useCallback(() => {
    if (moves.length === 0) return;
    const newMoves = moves.slice(0, -1);
    const newComments = filterOrphanedComments(moves.length - 1);
    pushHistory(newMoves, newComments);
    setSelectedIndex(null);
  }, [moves, comments]);

  const clearAll = useCallback(() => {
    if (moves.length === 0 && Object.keys(comments).length === 0) return;
    pushHistory([], {});
    setSelectedIndex(null);
  }, [moves, comments]);

  // Comment management functions
  const setComment = useCallback((index: number, comment: string) => {
    if (index < 0 || index >= moves.length) return;
    const newComments = { ...comments };
    if (comment.trim() === '') {
      delete newComments[index];
    } else {
      newComments[index] = comment;
    }
    pushHistory(moves, newComments);
  }, [moves, comments]);

  const deleteComment = useCallback((index: number) => {
    if (comments[index] === undefined) return;
    const newComments = { ...comments };
    delete newComments[index];
    pushHistory(moves, newComments);
  }, [moves, comments]);

  const clearAllComments = useCallback(() => {
    if (Object.keys(comments).length === 0) return;
    pushHistory(moves, {});
  }, [moves, comments]);

  // Load moves without affecting undo history (for initial load from localStorage)
  const loadMoves = useCallback((newMoves: string[], newComments: Record<number, string> = {}) => {
    setMoves(newMoves);
    setComments(newComments);
    setHistoryStack([]);
    setRedoStack([]);
    setSelectedIndex(null);
  }, []);

  return {
    fen: cursorGame.fen(),
    moveList: moves, // The source of truth
    comments, // Comments keyed by move index
    selectedIndex,
    setCursor,
    addMove,
    truncateFromIndex,
    deleteLast,
    clearAll,
    setComment,
    deleteComment,
    clearAllComments,
    loadMoves,
    undo,
    redo,
    canUndo: historyStack.length > 0,
    canRedo: redoStack.length > 0,
    legalMoves: (lang: Language) => getLegalMoves(lang),
    turn: cursorGame.turn(),
    isCheck: cursorGame.isCheck(),
    isGameOver: cursorGame.isGameOver(),
    result: cursorGame.isGameOver() ? (cursorGame.isCheckmate() ? (cursorGame.turn() === 'w' ? '0-1' : '1-0') : '1/2-1/2') : '*',
  };
}
