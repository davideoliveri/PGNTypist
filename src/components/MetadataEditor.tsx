import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, X, RotateCcw } from 'lucide-react';
import { type Language, t } from '../logic/localization';

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
      <div className="metadata-row" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
        <button
          onClick={() => onDelete(originalKey)}
          style={{
            padding: '4px 8px',
            background: '#5e2a2a',
            color: '#ffcccc'
          }}
        >
          <X size={14} />
        </button>
        <input
          value={editingKey}
          onChange={(e) => setEditingKey(e.target.value)}
          onBlur={handleKeyBlur}
          className="metadata-key"
          style={{
            background: '#222',
            border: '1px solid #555',
            color: '#fff',
            padding: '4px',
            borderRadius: '4px',
            width: '20%',
          }}
        />
        <input
          value={value}
          onChange={(e) => onValueChange(originalKey, e.target.value)}
          className="metadata-value"
          style={{
            flex: 1,
            width: '55%',
            background: '#111',
            border: '1px solid #555',
            color: '#fff',
            padding: '4px',
            borderRadius: '4px'
          }}
        />
      </div>
      <hr style={{ width: '100%', border: '1px solid #444' }} />
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
    <div style={{ border: '1px solid #444', borderRadius: '4px', background: '#262626' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 500
        }}
      >
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        PGN Metadata
      </div>

      {isOpen && (
        <div style={{ padding: '10px', borderTop: '1px solid #444' }}>
          {/* Reset Values Button */}
          <button
            onClick={onResetValues}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              marginBottom: '10px',
              background: '#3a3a3a',
              border: '1px solid #555',
              borderRadius: '4px',
              color: '#ccc',
              cursor: 'pointer',
              fontSize: '0.85em'
            }}
          >
            <RotateCcw size={14} />
            {t(lang, 'metadata.resetValues')}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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

          <div className="metadata-row" style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #444', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            <button
              onClick={handleAdd}
              style={{
                padding: '4px 8px',
                background: '#2a5e2a',
                color: '#ccffcc'
              }}
            >
              <Plus size={14} />
            </button>
            <input
              placeholder="Key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="metadata-key"
              style={{
                width: '20%',
                background: '#333',
                border: '1px solid #555',
                color: '#fff',
                padding: '4px',
                borderRadius: '4px'
              }}
            />
            <input
              placeholder="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="metadata-value"
              style={{
                flex: 1,
                width: '55%',
                background: '#111',
                border: '1px solid #555',
                color: '#fff',
                padding: '4px',
                borderRadius: '4px'
              }}
            />

          </div>
        </div>
      )}
    </div>
  );
};
