export interface PgnExportOptions {
    headers: { [key: string]: string };
    moveList: string[];
    comments: Record<number, string>;
    result: string;
    withComments?: boolean;
}

// Build PGN string from game data
export const buildPgnString = ({
    headers,
    moveList,
    comments,
    result,
    withComments = false
}: PgnExportOptions): string => {
    let pgn = '';

    // Headers
    for (const [key, value] of Object.entries(headers)) {
        pgn += `[${key} "${value}"]\n`;
    }
    pgn += '\n';

    // Moves with optional comments
    let moveText = '';
    for (let i = 0; i < moveList.length; i++) {
        const isWhite = i % 2 === 0;
        const moveNumber = Math.floor(i / 2) + 1;

        if (isWhite) {
            moveText += `${moveNumber}. `;
        }

        moveText += `${moveList[i]} `;

        // Add comment if enabled and exists
        if (withComments && comments[i]) {
            moveText += `{${comments[i]}} `;
        }
    }
    pgn += moveText + (headers['Result'] || result);

    return pgn;
};

// Download PGN as file
export const downloadPgn = (pgn: string, filename: string = 'game.pgn'): void => {
    const blob = new Blob([pgn], { type: 'application/x-chess-pgn' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};
