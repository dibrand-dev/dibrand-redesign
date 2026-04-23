'use client'

import React, { useState } from 'react';
import { Code } from 'lucide-react';

interface Props {
    name: string;
    iconUrl?: string;
    className?: string;
    size?: number;
}

export default function TechStackIcon({ name, iconUrl, className = "w-8 h-8", size = 20 }: Props) {
    const [hasError, setHasError] = useState(false);

    // Simple Icons Slug logic
    // We clean the name to match common Simple Icons slugs
    const getSimpleIconSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/\.js/g, 'dotjs')
            .replace(/\+/g, 'plus')
            .replace(/#/g, 'sharp')
            .replace(/\s+/g, '')
            .replace(/[^a-z0-9]/g, '');
    };

    const slug = getSimpleIconSlug(name);
    // Simple Icons CDN allows passing a color or just the slug
    // We try the iconUrl if provided, then Simple Icons
    const finalSrc = iconUrl && !hasError ? iconUrl : `https://cdn.simpleicons.org/${slug}`;

    return (
        <div 
            className={`${className} rounded-xl bg-admin-bg flex items-center justify-center text-gray-400 border border-transparent transition-all group-hover:border-admin-border overflow-hidden shrink-0`}
            title={name}
        >
            {!hasError && name ? (
                <img 
                    src={finalSrc} 
                    alt={name} 
                    className="w-full h-full object-contain p-2 transition-transform group-hover:scale-110"
                    onError={() => {
                        if (iconUrl || (!iconUrl && finalSrc.includes('simpleicons'))) {
                            setHasError(true);
                        }
                    }}
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-admin-accent/10 text-admin-accent font-black text-xs uppercase animate-in zoom-in-90 duration-300">
                    {name ? name.charAt(0) : '?'}
                </div>
            )}
        </div>
    );
}
