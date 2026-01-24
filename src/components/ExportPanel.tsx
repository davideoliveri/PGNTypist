import React from 'react';
import { Copy, Download, MessageSquare, FileDown } from 'lucide-react';
import { type Language, t } from '../logic/localization';
import { copyToClipboard } from '../logic/clipboard';
import { buildPgnString, downloadPgn } from '../logic/pgnExport';

interface ExportPanelProps {
    headers: { [key: string]: string };
    moveList: string[];
    comments: Record<number, string>;
    result: string;
    fen: string;
    onNotify: (message: string) => void;
    lang: Language;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
    headers,
    moveList,
    comments,
    result,
    fen,
    onNotify,
    lang
}) => {
    const hasComments = Object.keys(comments).length > 0;

    const handleExport = (type: 'copy' | 'download', withComments: boolean = false) => {
        const pgn = buildPgnString({ headers, moveList, comments, result, withComments });

        if (type === 'copy') {
            copyToClipboard(pgn);
            onNotify(t(lang, 'export.copied'));
        } else {
            downloadPgn(pgn);
        }
    };

    const handleCopyFen = async () => {
        await copyToClipboard(fen);
        onNotify(t(lang, 'export.copied'));
    };

    return (
        <>
            <div className="export-section">
                {/* Copy Buttons Group */}
                <div className="export-buttons">
                    <button
                        onClick={() => handleExport('copy', false)}
                        className="export-btn"
                    >
                        <Copy size={16} />
                        {t(lang, 'export.copy')}
                    </button>
                    <button
                        onClick={() => handleExport('copy', true)}
                        disabled={!hasComments}
                        className="export-btn"
                    >
                        <MessageSquare size={16} />
                        {t(lang, 'export.copyWithComments')}
                    </button>
                </div>

                {/* Download Buttons Group */}
                <div className="export-buttons">
                    <button
                        onClick={() => handleExport('download', false)}
                        className="export-btn"
                    >
                        <FileDown size={16} />
                        {t(lang, 'export.downloadMoves')}
                    </button>
                    <button
                        onClick={() => handleExport('download', true)}
                        disabled={!hasComments}
                        className="export-btn"
                    >
                        <Download size={16} />
                        {t(lang, 'export.download')}
                    </button>
                </div>
            </div>

            {/* SAN Note */}
            <p className="san-note">
                {t(lang, 'export.sanNote')}
            </p>

            {/* FEN Display */}
            <div className="fen-display">
                <strong className="fen-label">{t(lang, 'export.fen')}:</strong>
                <input
                    type="text"
                    readOnly
                    value={fen}
                    className="fen-input"
                    onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                    onClick={handleCopyFen}
                    className="fen-copy-btn"
                >
                    {t(lang, 'export.copyFen')}
                </button>
            </div>
        </>
    );
};
