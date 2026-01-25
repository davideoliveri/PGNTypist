import React, { useMemo, useEffect } from 'react';
import { Chessboard } from 'react-chessboard';
import './ChessBoard.css';

interface ChessBoardProps {
  fen: string;
  orientation?: 'white' | 'black';
  lastMoveSquares?: { from: string; to: string } | null;
  selectedMoveSquares?: { from: string; to: string } | null;
}

// Lichess-style highlight color (yellow-green tint)
const HIGHLIGHT_STYLE = { backgroundColor: 'rgba(155, 199, 0, 0.41)' };

// Blue outline for selected move (matches move list selection color #3a6ea5)
const SELECTED_OUTLINE_STYLE = { boxShadow: 'inset 0 0 0 3px rgba(40, 43, 240, 0.85)' };

export const ChessBoard: React.FC<ChessBoardProps> = ({
  fen,
  orientation = 'white',
  lastMoveSquares,
  selectedMoveSquares
}) => {
  // Compute custom square styles for highlighting
  const customSquareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};

    // Add fill highlight for last move
    if (lastMoveSquares) {
      styles[lastMoveSquares.from] = { ...styles[lastMoveSquares.from], ...HIGHLIGHT_STYLE };
      styles[lastMoveSquares.to] = { ...styles[lastMoveSquares.to], ...HIGHLIGHT_STYLE };
    }

    // Add outline for selected move
    if (selectedMoveSquares) {
      styles[selectedMoveSquares.from] = { ...styles[selectedMoveSquares.from], ...SELECTED_OUTLINE_STYLE };
      styles[selectedMoveSquares.to] = { ...styles[selectedMoveSquares.to], ...SELECTED_OUTLINE_STYLE };
    }

    return styles;
  }, [lastMoveSquares, selectedMoveSquares]);

  // Robustly prevent any element within the board from being focusable via Tab.
  // We use a MutationObserver because the library dynamically re-adds tabindex="0"
  // to pieces as they move or are highlighted.
  useEffect(() => {
    const boardElement = document.getElementById("ChessBoard");
    if (!boardElement) return;

    const stripFocus = (root: HTMLElement | DocumentFragment) => {
      const focusables = root.querySelectorAll('[tabindex="0"]');
      focusables.forEach(el => el.setAttribute('tabindex', '-1'));
    };

    // Initial strip
    stripFocus(boardElement);

    // Watch for ANY changes to the board's DOM structure
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (node.getAttribute('tabindex') === '0') {
                node.setAttribute('tabindex', '-1');
              }
              stripFocus(node);
            }
          });
        } else if (mutation.type === 'attributes' && mutation.attributeName === 'tabindex') {
          const target = mutation.target as HTMLElement;
          if (target.getAttribute('tabindex') === '0') {
            target.setAttribute('tabindex', '-1');
          }
        }
      });
    });

    observer.observe(boardElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['tabindex']
    });

    return () => observer.disconnect();
  }, []); // Re-run only on mount; observer handles dynamic changes

  return (
    <div className="chess-board-container" id="ChessBoard">
      <Chessboard
        options={{
          position: fen,
          id: "ChessBoard",
          boardOrientation: orientation,
          allowDragging: false,
          darkSquareStyle: { backgroundColor: '#b58863' },
          lightSquareStyle: { backgroundColor: '#f0d9b5' },
          squareStyles: customSquareStyles
        }}
      />
    </div>
  );
};
