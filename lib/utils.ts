/**
 * Capitalizes every word in a string (e.g., "diego salvatore" -> "Diego Salvatore")
 * and handles multi-word names correctly.
 */
export function capitalizeName(str: string): string {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Common formatting for currency/salary ranges
 */
export function formatSalary(value: string | number): string {
    if (typeof value === 'number') return `$${value.toLocaleString()}`;
    return value.toString();
}
