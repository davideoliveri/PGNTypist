import React, { useRef, useEffect } from 'react';
import { type Language, toLocalizedSAN } from '../logic/localization';

interface MoveListProps {
  moves: string[];
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  lang: Language;
}

export const MoveList: React.FC<MoveListProps> = ({ moves, selectedIndex, onSelect, lang }) => {
  const listRef = useRef<HTMLDivElement>(null);
  
  // Chunk moves into pairs
  const rows = [];
  for (let i = 0; i < moves.length; i += 2) {
    rows.push({
      number: Math.floor(i / 2) + 1,
      white: { index: i, san: moves[i] },
      black: moves[i + 1] ? { index: i + 1, san: moves[i + 1] } : null,
    });
  }

  // Scroll active move into view
  useEffect(() => {
    if (selectedIndex !== null) {
        const el = document.getElementById(`move-${selectedIndex}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    } else {
        // If appending, scroll to bottom
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }
  }, [selectedIndex, moves.length]);
  
  // Handling focus and arrow keys within the list container
  // Removed internal handler to rely on Global App handler
  // const handleKeyDown = ...

  return (
    <div 
        ref={listRef}
        tabIndex={0} // Make focusable
        className="move-list"
        style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4px', 
            flex: 1,
            overflowY: 'auto',
            padding: '10px',
            border: '1px solid #444',
            borderRadius: '4px',
            background: '#1e1e1e',
            fontFamily: 'monospace',
            fontSize: '1em',
            outline: 'none' // Handled by focus styles
        }}
    >
      {rows.map((row) => (
        <div key={row.number} style={{ display: 'flex', gap: '10px' }}>
          <span style={{ color: '#888', width: '30px', textAlign: 'right' }}>{row.number}.</span>
          
          <MoveItem 
            index={row.white.index} 
            san={row.white.san} 
            lang={lang} 
            isSelected={selectedIndex === row.white.index} 
            onClick={onSelect} 
          />
          
          {row.black && (
            <MoveItem 
                index={row.black.index} 
                san={row.black.san} 
                lang={lang}
                isSelected={selectedIndex === row.black.index} 
                onClick={onSelect} 
            />
          )}
        </div>
      ))}
      <div style={{ height: '20px' }} /> {/* Spacer at bottom */}
    </div>
  );
};

const MoveItem: React.FC<{
    index: number, 
    san: string, 
    lang: Language, 
    isSelected: boolean, 
    onClick: (i: number) => void
}> = ({ index, san, lang, isSelected, onClick }) => {
    return (
        <span 
            id={`move-${index}`}
            onClick={() => onClick(index)}
            style={{ 
                cursor: 'pointer',
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: isSelected ? '#3a6ea5' : 'transparent',
                color: isSelected ? '#fff' : '#ccc',
                minWidth: '60px'
            }}
        >
            {toLocalizedSAN(san, lang)}
        </span>
    );
};
