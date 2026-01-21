import React, { useRef, useEffect, useState } from 'react';
import { type Language, toLocalizedSAN, t } from '../logic/localization';

interface MoveListProps {
  moves: string[];
  comments: Record<number, string>;
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  onDeleteFrom?: (index: number) => void;
  onDeleteComment?: (index: number) => void;
  lang: Language;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  moveIndex: number;
}

export const MoveList: React.FC<MoveListProps> = ({
  moves,
  comments,
  selectedIndex,
  onSelect,
  onDeleteFrom,
  onDeleteComment,
  lang
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    moveIndex: -1
  });
  const [longPressIndex, setLongPressIndex] = useState<number | null>(null);

  // Build rows - each ply can have 1-4 rows depending on comments
  // Row types: 'move-pair' (both white and black on one row), 
  // 'white-only', 'black-only', 'comment'
  interface MoveRow {
    type: 'move';
    moveNumber: number;
    white: { index: number; san: string } | null;
    black: { index: number; san: string } | null;
  }
  interface CommentRow {
    type: 'comment';
    moveIndex: number;
    text: string;
  }
  type Row = MoveRow | CommentRow;

  const rows: Row[] = [];

  for (let i = 0; i < moves.length; i += 2) {
    const moveNumber = Math.floor(i / 2) + 1;
    const whiteMove = { index: i, san: moves[i] };
    const blackMove = moves[i + 1] ? { index: i + 1, san: moves[i + 1] } : null;
    const whiteComment = comments[i];
    const blackComment = blackMove ? comments[i + 1] : undefined;

    // If white has a comment, we need to split the row
    if (whiteComment) {
      // White move on its own row
      rows.push({ type: 'move', moveNumber, white: whiteMove, black: null });
      // White's comment
      rows.push({ type: 'comment', moveIndex: i, text: whiteComment });
      // Black move on its own row (if exists)
      if (blackMove) {
        rows.push({ type: 'move', moveNumber, white: null, black: blackMove });
        if (blackComment) {
          rows.push({ type: 'comment', moveIndex: i + 1, text: blackComment });
        }
      }
    } else if (blackComment) {
      // White and black on same row, then black's comment
      rows.push({ type: 'move', moveNumber, white: whiteMove, black: blackMove });
      rows.push({ type: 'comment', moveIndex: i + 1, text: blackComment });
    } else {
      // No comments - normal row with both moves
      rows.push({ type: 'move', moveNumber, white: whiteMove, black: blackMove });
    }
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

  // Close context menu when clicking outside and clear highlight
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu.visible) {
        setContextMenu(prev => ({ ...prev, visible: false }));
        setLongPressIndex(null);
      }
    };

    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [contextMenu.visible]);

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    // Position the menu near the click, but ensure it stays in viewport
    const menuHeight = comments[index] ? 100 : 50; // Taller if has comment
    const x = Math.min(e.clientX, window.innerWidth - 180);
    const y = Math.min(e.clientY, window.innerHeight - menuHeight);

    setContextMenu({
      visible: true,
      x,
      y,
      moveIndex: index
    });
    setLongPressIndex(index);
  };

  const handleDeleteFromHere = () => {
    if (onDeleteFrom && contextMenu.moveIndex >= 0) {
      onDeleteFrom(contextMenu.moveIndex);
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
    setLongPressIndex(null);
  };

  const handleDeleteComment = () => {
    if (onDeleteComment && contextMenu.moveIndex >= 0) {
      onDeleteComment(contextMenu.moveIndex);
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
    setLongPressIndex(null);
  };

  const hasComment = contextMenu.moveIndex >= 0 && comments[contextMenu.moveIndex];

  return (
    <>
      <div
        ref={listRef}
        tabIndex={0} // Make focusable
        className="move-list"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          padding: '10px',
          border: '1px solid #444',
          borderRadius: '4px',
          background: '#1e1e1e',
          fontFamily: 'monospace',
          fontSize: '1.3em',
          outline: 'none' // Handled by focus styles
        }}
      >
        {rows.map((row, rowIndex) => {
          if (row.type === 'comment') {
            return (
              <div
                key={`comment-${row.moveIndex}`}
                style={{
                  paddingLeft: '40px',
                  color: '#999',
                  fontSize: '0.8em',
                  fontStyle: 'italic',
                  lineHeight: 1.4,
                  marginTop: '-2px',
                  marginBottom: '2px'
                }}
              >
                {row.text}
              </div>
            );
          }

          // Move row
          return (
            <div key={`move-${rowIndex}`} style={{ display: 'flex', gap: '10px' }}>
              <span style={{ color: '#888', width: '30px', textAlign: 'right' }}>
                {`${row.moveNumber}.`}
              </span>

              {row.white ? (
                <MoveItem
                  index={row.white.index}
                  san={row.white.san}
                  lang={lang}
                  isSelected={selectedIndex === row.white.index}
                  isHighlighted={longPressIndex === row.white.index}
                  onClick={onSelect}
                  onContextMenu={handleContextMenu}
                />
              ) : (
                /* ".." placeholder for white column when black-only row */
                <span style={{ minWidth: '60px', color: '#ccc', padding: '2px 6px' }}>..</span>
              )}

              {row.black ? (
                <MoveItem
                  index={row.black.index}
                  san={row.black.san}
                  lang={lang}
                  isSelected={selectedIndex === row.black.index}
                  isHighlighted={longPressIndex === row.black.index}
                  onClick={onSelect}
                  onContextMenu={handleContextMenu}
                />
              ) : (
                /* ".." placeholder for black column when white-only row */
                <span style={{ minWidth: '60px', color: '#ccc', padding: '2px 6px' }}>..</span>
              )}
            </div>
          );
        })}
        <div style={{ height: '20px' }} /> {/* Spacer at bottom */}
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            backgroundColor: '#2a2a2a',
            border: '1px solid #555',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            overflow: 'hidden',
            minWidth: '160px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleDeleteFromHere}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 14px',
              background: 'transparent',
              border: 'none',
              color: '#e74c3c',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '0.9em'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🗑️ {t(lang, 'context.deleteFromHere')}
          </button>
          {hasComment && (
            <button
              onClick={handleDeleteComment}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 14px',
                background: 'transparent',
                border: 'none',
                borderTop: '1px solid #444',
                color: '#e9a23b',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '0.9em'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              💬 {t(lang, 'context.deleteComment')}
            </button>
          )}
        </div>
      )}
    </>
  );
};

const MoveItem: React.FC<{
  index: number,
  san: string,
  lang: Language,
  isSelected: boolean,
  isHighlighted: boolean,
  onClick: (i: number | null) => void,
  onContextMenu: (e: React.MouseEvent, index: number) => void
}> = ({ index, san, lang, isSelected, isHighlighted, onClick, onContextMenu }) => {
  const longPressTimer = useRef<number | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsLongPress(false);
    longPressTimer.current = window.setTimeout(() => {
      setIsLongPress(true);
      // Create synthetic event for context menu
      const touch = e.touches[0];
      const syntheticEvent = {
        preventDefault: () => { },
        stopPropagation: () => { },
        clientX: touch.clientX,
        clientY: touch.clientY
      } as React.MouseEvent;
      onContextMenu(syntheticEvent, index);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleClick = () => {
    if (!isLongPress) {
      // Toggle: if already selected, deselect (null), otherwise select this index
      onClick(isSelected ? null : index);
    }
    setIsLongPress(false);
  };

  // Determine background color: highlighted (long-press) > selected (navigation)
  const getBackgroundColor = () => {
    if (isHighlighted) return '#8b4513'; // Orange/brown for delete action
    if (isSelected) return '#3a6ea5';    // Blue for navigation
    return 'transparent';
  };

  return (
    <span
      id={`move-${index}`}
      onClick={handleClick}
      onContextMenu={(e) => onContextMenu(e, index)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        cursor: 'pointer',
        padding: '2px 6px',
        borderRadius: '4px',
        backgroundColor: getBackgroundColor(),
        color: (isSelected || isHighlighted) ? '#fff' : '#ccc',
        minWidth: '60px',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      {toLocalizedSAN(san, lang)}
    </span>
  );
};

