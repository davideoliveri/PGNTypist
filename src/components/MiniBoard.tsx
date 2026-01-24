import React, { useMemo } from 'react';
import { Chessboard } from 'react-chessboard';
import './MiniBoard.css';

interface MiniBoardProps {
  fen: string;
  orientation?: 'white' | 'black';
  lastMoveSquares?: { from: string; to: string } | null;
  selectedMoveSquares?: { from: string; to: string } | null;
}

// Lichess-style highlight color (yellow-green tint)
const HIGHLIGHT_STYLE = { backgroundColor: 'rgba(155, 199, 0, 0.41)' };

// Blue outline for selected move (matches move list selection color #3a6ea5)
const SELECTED_OUTLINE_STYLE = { boxShadow: 'inset 0 0 0 3px rgba(40, 43, 240, 0.85)' };

export const MiniBoard: React.FC<MiniBoardProps> = ({
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

  return (
    <div className="mini-board-container">
      <Chessboard
        options={{
          position: fen,
          id: "MiniBoard",
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
