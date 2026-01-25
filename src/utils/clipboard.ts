// Clipboard helper with iOS Safari fallback
export const copyToClipboard = async (text: string): Promise<boolean> => {
    // Try modern API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fall through to fallback
        }
    }
    // Fallback for iOS Safari and older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    } catch (err) {
        document.body.removeChild(textarea);
        return false;
    }
};
