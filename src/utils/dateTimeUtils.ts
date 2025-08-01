import { format } from 'date-fns';

/**
 * Formats an ISO date string to "dd MMM yyyy @ HH:mm:ss"
 * Example: "2025-07-26T15:33:33Z" => "26 Jul 2025 @ 23:33:33"
 */
export const formatDateTime = (isoString: string, pattern = 'dd MMM yyyy @ HH:mm:ss'): string => {
    try {
        return format(new Date(isoString), pattern);
    } catch (error) {
        console.warn('Invalid date string passed to formatDateTime:', isoString);
        return isoString; // fallback
    }
};