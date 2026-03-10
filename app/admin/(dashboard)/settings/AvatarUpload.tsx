'use client'

import { useRef, useState, useTransition } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import { updateUserProfileImage } from './actions';

interface AvatarUploadProps {
    userId: string;
    currentAvatarUrl?: string | null;
    displayName: string;
}

export default function AvatarUpload({ userId, currentAvatarUrl, displayName }: AvatarUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(currentAvatarUrl ?? null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const initials = displayName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview instantly
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setError(null);
        setUploading(true);

        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            // Upload to Storage: avatars/{userId}/{timestamp}_{filename}
            const filePath = `${userId}/${Date.now()}_${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw new Error(uploadError.message);

            // Get the public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            // Persist to user metadata via Server Action
            startTransition(async () => {
                await updateUserProfileImage(publicUrl);
            });

        } catch (err: any) {
            setError(err.message || 'Error al subir la imagen.');
            setPreview(currentAvatarUrl ?? null);
        } finally {
            setUploading(false);
            // Reset input so the same file can be re-selected
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const isLoading = uploading || isPending;

    return (
        <div className="flex flex-col items-center gap-5">
            {/* Avatar circle */}
            <div className="relative group">
                <div className="w-28 h-28 rounded-full overflow-hidden bg-admin-bg border-4 border-admin-card-bg shadow-xl flex items-center justify-center">
                    {preview ? (
                        <Image
                            src={preview}
                            alt={displayName}
                            width={112}
                            height={112}
                            className="object-cover w-full h-full"
                            unoptimized={preview.startsWith('blob:')}
                        />
                    ) : (
                        <span className="text-3xl font-black text-admin-text-secondary opacity-30 tracking-widest">{initials}</span>
                    )}
                </div>

                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                        <Loader2 size={28} className="text-white animate-spin" />
                    </div>
                )}

                {/* Hover overlay */}
                {!isLoading && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all"
                        title="Cambiar foto"
                    >
                        <Camera size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                    </button>
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
            />

            {/* Button below */}
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={isLoading}
                className="px-5 py-2 text-[11px] uppercase tracking-widest font-black rounded-xl border border-admin-border text-admin-text-secondary hover:border-admin-accent hover:text-admin-accent disabled:opacity-40 transition-all bg-admin-card-bg shadow-sm"
            >
                {isLoading ? 'Subiendo...' : 'Cambiar Foto'}
            </button>

            {/* Error message */}
            {error && (
                <p className="text-[10px] uppercase font-bold tracking-widest text-red-500 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                    {error}
                </p>
            )}
        </div>
    );
}
