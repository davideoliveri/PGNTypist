import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, X, RotateCcw } from 'lucide-react';
import { type Language, t } from '../logic/localization';
import './MetadataEditor.css';

interface MetadataEditorProps {
  headers: { [key: string]: string };
  onChange: (headers: { [key: string]: string }) => void;
  onResetValues: () => void;
  lang: Language;
}

// Separate component for each row to manage local key editing state
const MetadataRow: React.FC<{
  originalKey: string;
  value: string;
  onKeyChange: (oldKey: string, newKey: string) => void;
  onValueChange: (key: string, value: string) => void;
  onDelete: (key: string) => void;
}> = ({ originalKey, value, onKeyChange, onValueChange, onDelete }) => {
  const [editingKey, setEditingKey] = useState(originalKey);

  const handleKeyBlur = () => {
    if (editingKey !== originalKey && editingKey.trim()) {
      onKeyChange(originalKey, editingKey.trim());
    } else if (!editingKey.trim()) {
      setEditingKey(originalKey); // Reset if empty
    }
  };

  return (
    <>
      <div className="metadata-row">
        <button
          onClick={() => onDelete(originalKey)}
          className="metadata-btn-delete"
        >
          <X size={14} />
        </button>
        <input
          value={editingKey}
          onChange={(e) => setEditingKey(e.target.value)}
          onBlur={handleKeyBlur}
          className="metadata-key"
        />
        <input
          value={value}
          onChange={(e) => onValueChange(originalKey, e.target.value)}
          className="metadata-value"
        />
      </div>
      <hr className="metadata-separator" />
    </>
  );
};

export const MetadataEditor: React.FC<MetadataEditorProps> = ({ headers, onChange, onResetValues, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleUpdate = (key: string, value: string) => {
    onChange({ ...headers, [key]: value });
  };

  const handleKeyChange = (oldKey: string, newKey: string) => {
    if (newKey === oldKey || !newKey) return;
    // Build new headers with key renamed, preserving order
    const newHeaders: { [key: string]: string } = {};
    for (const [k, v] of Object.entries(headers)) {
      if (k === oldKey) {
        newHeaders[newKey] = v;
      } else {
        newHeaders[k] = v;
      }
    }
    onChange(newHeaders);
  };

  const handleDelete = (key: string) => {
    const next = { ...headers };
    delete next[key];
    onChange(next);
  };

  const handleAdd = () => {
    if (newKey && newValue) {
      onChange({ ...headers, [newKey]: newValue });
      setNewKey('');
      setNewValue('');
    }
  };

  return (
    <div className="metadata-editor">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="metadata-header"
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        PGN Metadata
      </div>

      {isOpen && (
        <div className="metadata-content">
          {/* Reset Values Button */}
          <button
            onClick={onResetValues}
            className="metadata-btn-reset"
          >
            <RotateCcw size={14} />
            {t(lang, 'metadata.resetValues')}
          </button>

          <div className="metadata-rows">
            {Object.entries(headers).map(([key, value]) => (
              <MetadataRow
                key={key}
                originalKey={key}
                value={value}
                onKeyChange={handleKeyChange}
                onValueChange={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>

          <div className="metadata-row metadata-row--add">
            <button
              onClick={handleAdd}
              className="metadata-btn-add"
            >
              <Plus size={14} />
            </button>
            <input
              placeholder="Key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="metadata-key metadata-key--new"
            />
            <input
              placeholder="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="metadata-value"
            />
          </div>
        </div>
      )}
    </div>
  );
};

