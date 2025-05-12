'use client';

import dynamic from 'next/dynamic';

const ThemeToggle = dynamic(() => import('@/components/themeToggle'), { ssr: false });

export default function ThemeToggleWrapper() {
    return <ThemeToggle />;
} 