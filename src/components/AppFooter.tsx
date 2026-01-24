import React from 'react';
import { type Language, t } from '../logic/localization';

interface AppFooterProps {
    moveList: string[];
    boardOrientation: 'white' | 'black';
    lang: Language;
}

export const AppFooter: React.FC<AppFooterProps> = ({
    moveList,
    boardOrientation,
    lang
}) => {
    const lichessUrl = moveList.length > 0
        ? `https://lichess.org/analysis/pgn/${encodeURIComponent(
            moveList.reduce((acc, move, i) => {
                if (i % 2 === 0) acc += `${Math.floor(i / 2) + 1}.`;
                return acc + move + ' ';
            }, '').trim()
        )}?color=${boardOrientation}`
        : null;

    return (
        <>
            {lichessUrl && (
                <div className="lichess-link-wrapper">
                    <a
                        href={lichessUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="lichess-link"
                    >
                        {t(lang, 'export.lichessAnalysis')} ↗
                    </a>
                </div>
            )}
            <div className="credits">
                <p>
                    {t(lang, 'footer.credit')} <a href="https://github.com/davideoliveri" target="_blank" rel="noopener noreferrer">Davide Oliveri</a>
                </p>
            </div>
        </>
    );
};
