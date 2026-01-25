import { usePersistedBoolean, usePersistedState } from './usePersistedState';
import { STORAGE_KEYS } from '../services/storage';

export interface BoardSettings {
    orientation: 'white' | 'black';
    showLastMoveHighlight: boolean;
    showSelectedMoveHighlight: boolean;
}

export interface BoardSettingsHandlers {
    toggleOrientation: () => void;
    toggleLastMoveHighlight: () => void;
    toggleSelectedMoveHighlight: () => void;
}

export function useBoardSettings() {
    const [orientation, setOrientation] = usePersistedState<'white' | 'black'>(STORAGE_KEYS.BOARD_ORIENTATION, 'white');
    const [showLastMoveHighlight, toggleLastMove] = usePersistedBoolean(STORAGE_KEYS.SHOW_LAST_MOVE, true);
    const [showSelectedMoveHighlight, toggleSelectedMove] = usePersistedBoolean(STORAGE_KEYS.SHOW_SELECTED_MOVE, true);

    const toggleOrientation = () => setOrientation(o => o === 'white' ? 'black' : 'white');

    const settings: BoardSettings = {
        orientation,
        showLastMoveHighlight,
        showSelectedMoveHighlight
    };

    const handlers: BoardSettingsHandlers = {
        toggleOrientation,
        toggleLastMoveHighlight: toggleLastMove,
        toggleSelectedMoveHighlight: toggleSelectedMove
    };

    return { settings, handlers };
}
