import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { type Language, toEnglishSAN, t } from '../logic/localization';
import './MoveInput.css';

interface MoveInputProps {
  onMove: (san: string) => boolean;
  legalMoves: string[]; // Localized legal moves
  onNavigate: (direction: -1 | 1) => void;
  lang: Language;
}

export interface MoveInputHandle {
  focus: () => void;
}

export const MoveInput = forwardRef<MoveInputHandle, MoveInputProps>(({ onMove, legalMoves, lang, onNavigate }, ref) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus()
  }));

  // Auto-focus on mount and keep focus
  useEffect(() => {
    inputRef.current?.focus();
    return () => { };
  }, []);

  // Update suggestions on input change
  useEffect(() => {
    if (!value) {
      setSuggestions([]);
      return;
    }
    const lowerVal = value.toLowerCase();
    const matched = legalMoves.filter(m => m.toLowerCase().startsWith(lowerVal));
    setSuggestions(matched.slice(0, 10)); // Limit to 10
    setHighlightIndex(0);
  }, [value, legalMoves]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLInputElement;

    // Up/Down for suggestions
    if (suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex(prev => (prev + 1) % suggestions.length);
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex(prev => (suggestions.length + prev - 1) % suggestions.length);
        return;
      }
    }

    if (e.key === 'ArrowLeft') {
      // Navigate back if at start of input
      if (target.selectionStart === 0 && target.selectionEnd === 0) {
        e.preventDefault();
        onNavigate(-1);
      }
    } else if (e.key === 'ArrowRight') {
      // Navigate forward if at end of input
      if (target.selectionStart === value.length && target.selectionEnd === value.length) {
        e.preventDefault();
        onNavigate(1);
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const move = suggestions.length > 0 ? (suggestions[highlightIndex] || value) : value;
      if (move) submitMove(move);
    } else if (e.key === 'Escape') {
      setValue('');
      setSuggestions([]);
    }
  };

  const submitMove = (inputSan: string) => {
    const englishSan = toEnglishSAN(inputSan, lang);
    const success = onMove(englishSan);
    if (success) {
      setValue('');
      setSuggestions([]);
    }
  };

  return (
    <div className="move-input-container">
      <input
        ref={inputRef}
        type="text"
        id="move-input"
        className="move-input"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t(lang, 'app.placeholder')}
      />
      {/* Suggestions Popup */}
      {suggestions.length > 0 && (
        <div className="suggestions-popup">
          {suggestions.map((m, i) => (
            <div
              key={m}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent input blur
                submitMove(m);
              }}
              className={`suggestion-item ${i === highlightIndex ? 'suggestion-item--highlighted' : ''}`}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

