import { useState, useEffect, useCallback } from 'react';

/**
 * A useState hook that persists to localStorage.
 * @param key - localStorage key
 * @param defaultValue - default value if nothing stored
 * @returns [value, setValue] tuple
 */
export function usePersistedState<T>(
    key: string,
    defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            if (stored !== null) {
                return JSON.parse(stored) as T;
            }
        } catch (e) {
            // Ignore parse errors
        }
        return defaultValue;
    });

    // Persist to localStorage on change
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // Ignore storage errors
        }
    }, [key, value]);

    return [value, setValue];
}

/**
 * A simpler version for boolean flags that defaults to true if not found.
 */
export function usePersistedBoolean(
    key: string,
    defaultValue: boolean = true
): [boolean, () => void] {
    const [value, setValue] = usePersistedState(key, defaultValue);
    const toggle = useCallback(() => setValue(v => !v), [setValue]);
    return [value, toggle];
}
