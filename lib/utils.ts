import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function capitalizeName(str: string): string {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .filter(word => word.length > 0)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

export function formatSalary(value: string | number): string {
    if (typeof value === 'number') return `$${value.toLocaleString()}`;
    return value.toString();
}
export function getInitials(fullName?: string, firstName?: string, lastName?: string): string {
    if (firstName && lastName) {
        const f = firstName.trim().charAt(0).toUpperCase();
        const l = lastName.trim().charAt(0).toUpperCase();
        return `${f}${l}`;
    }
    
    if (!fullName) return '';
    
    const parts = fullName.trim().split(/\s+/).filter(p => !['de', 'la', 'del', 'los', 'las'].includes(p.toLowerCase()));
    
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .normalize('NFD') // Normalize to decompose characters (e.g., á -> a + ´)
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Remove duplicate hyphens
}

