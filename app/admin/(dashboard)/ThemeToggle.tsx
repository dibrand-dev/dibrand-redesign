'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check for saved preference or system preference
        const savedTheme = localStorage.getItem('admin-theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newDark = !isDark;
        setIsDark(newDark);

        if (newDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('admin-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('admin-theme', 'light');
        }
    };

    return (
        <div className="flex items-center bg-gray-50 dark:bg-admin-card-bg p-1 rounded-full border border-gray-100 dark:border-admin-border transition-colors">
            <button
                onClick={() => isDark && toggleTheme()}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${!isDark
                        ? 'bg-white shadow-sm text-admin-accent'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                title="Light Mode"
            >
                <Sun size={16} />
            </button>
            <button
                onClick={() => !isDark && toggleTheme()}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isDark
                        ? 'bg-admin-accent/20 text-admin-accent'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                title="Dark Mode"
            >
                <Moon size={16} />
            </button>
        </div>
    );
}
