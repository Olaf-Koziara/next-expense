'use client';
import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";
import {MoonIcon, SunIcon} from "lucide-react";
import styled from "styled-components";

const ThemeToggleWrapper = styled.div`
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 50;
`
const ThemeToggle = () => {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark && theme === 'system') {
            setTheme('dark');
        }
    }, [theme, setTheme]);

    if (!mounted) return null;

    const handleThemeChange = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeToggleWrapper>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleThemeChange}
                aria-label="Toggle theme"
            >
                {theme === "light" ? <MoonIcon size={20} /> : <SunIcon size={20} />}
            </Button>
        </ThemeToggleWrapper>
    );
};

export default ThemeToggle;