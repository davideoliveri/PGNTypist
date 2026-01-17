import React from 'react';
import { Chessboard } from 'react-chessboard';

interface MiniBoardProps {
  fen: string;
  orientation?: 'white' | 'black';
}

export const MiniBoard: React.FC<MiniBoardProps> = ({ fen, orientation = 'white' }) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '400px', // Slightly larger max width
      aspectRatio: '1/1',
      margin: '0 auto'
    }}>
      <Chessboard
        options={{
          position: fen,
          id: "MiniBoard",
          boardOrientation: orientation,
          allowDragging: false,
          darkSquareStyle: { backgroundColor: '#b58863' },
          lightSquareStyle: { backgroundColor: '#f0d9b5' }
        }}
      />
    </div>
  );
};

