import React, { useRef, useEffect, useState } from 'react';
import { type Language, toLocalizedSAN, t } from '../../../../services/localization';
import './MoveList.css';

interface MoveListProps {
  moves: string[];
  comments: Record<number, string>;
  selectedIndex: number | null;
  onSelect: (index: number | null) => void;
  onDeleteFrom?: (index: number) => void;
  onDeleteComment?: (index: number) => void;
  onFocusMoveInput?: () => void;
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
  onFocusMoveInput,
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
        tabIndex={0}
        className="move-list"
      >
        {rows.map((row, rowIndex) => {
          if (row.type === 'comment') {
            return (
              <div
                key={`comment-${row.moveIndex}`}
                className="comment-row"
              >
                {row.text}
              </div>
            );
          }

          // Move row
          return (
            <div key={`move-${rowIndex}`} className="move-row">
              <span className="move-number">
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
                  onFocusMoveInput={onFocusMoveInput}
                />
              ) : (
                <span className="move-placeholder">..</span>
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
                  onFocusMoveInput={onFocusMoveInput}
                />
              ) : (
                <span className="move-placeholder">..</span>
              )}
            </div>
          );
        })}
        <div className="move-list-spacer" />
      </div>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleDeleteFromHere}
            className="context-menu-btn context-menu-btn--delete"
          >
            🗑️ {t(lang, 'context.deleteFromHere')}
          </button>
          {hasComment && (
            <button
              onClick={handleDeleteComment}
              className="context-menu-btn context-menu-btn--comment"
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
  onContextMenu: (e: React.MouseEvent, index: number) => void,
  onFocusMoveInput?: () => void
}> = ({ index, san, lang, isSelected, isHighlighted, onClick, onContextMenu, onFocusMoveInput }) => {
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
      // If deselecting (clicking on already selected move), focus the move input
      if (isSelected) {
        onClick(null);
        onFocusMoveInput?.();
      } else {
        onClick(index);
      }
    }
    setIsLongPress(false);
  };

  // Determine CSS class based on state
  const getClassName = () => {
    if (isHighlighted) return 'move-item move-item--highlighted';
    if (isSelected) return 'move-item move-item--selected';
    return 'move-item';
  };

  return (
    <span
      id={`move-${index}`}
      onClick={handleClick}
      onContextMenu={(e) => onContextMenu(e, index)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={getClassName()}
    >
      {toLocalizedSAN(san, lang)}
    </span>
  );
};
