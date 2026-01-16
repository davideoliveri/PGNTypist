import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Plus, X } from 'lucide-react';

interface MetadataEditorProps {
  headers: { [key: string]: string };
  onChange: (headers: { [key: string]: string }) => void;
  // lang: Language; // Unused for now, maybe for translating labels later?
}

export const MetadataEditor: React.FC<MetadataEditorProps> = ({ headers, onChange }) => { // Removed lang
  const [isOpen, setIsOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleUpdate = (key: string, value: string) => {
    onChange({ ...headers, [key]: value });
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

  // Common PGN headers for suggestions or default view?
  // PDR says "collapsed by default".
  
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {Object.entries(headers).map(([key, value]) => (
                    <>
                    <div key={key} className="metadata-row" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <button 
                            onClick={() => handleDelete(key)}
                            style={{ 
                                padding: '4px 8px', 
                                background: '#5e2a2a', 
                                color: '#ffcccc' 
                            }}
                        >
                            <X size={14} />
                        </button>
                        <input 
                            readOnly
                            value={key}
                            className="metadata-key"
                            style={{ 
                                background: '#333', 
                                border: '1px solid #555', 
                                color: '#aaa',
                                padding: '4px', 
                                borderRadius: '4px',
                                width: '20%',
                            }}
                        />
                        <input 
                            value={value}
                            onChange={(e) => handleUpdate(key, e.target.value)}
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
                    <hr style={{ width: '100%', border: '1px solid #444' }}/>
                    </>
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
