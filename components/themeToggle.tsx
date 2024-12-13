'use client';
import React from 'react';
import {Button} from "@/components/ui/button";
import {useTheme} from "next-themes";
import {MoonIcon, SunIcon} from "lucide-react";
import styled from "styled-components";

const ThemeToggleWrapper = styled.div`
    position: fixed;
    top: 1rem;
    right: 1rem;
`
const ThemeToggle = () => {
    const {theme, setTheme} = useTheme();
    // useLayoutEffect(() => window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleBrowserColorSchemeChange), []);
    const handleBrowserColorSchemeChange = (event) => {
        const newColorScheme = event.matches ? "dark" : "light";
        setTheme(newColorScheme);
    }

    const handleThemeChange = () => theme === 'light' ? setTheme('dark') : setTheme('light');
    return (
        <ThemeToggleWrapper>
            <Button variant={'ghost'} onClick={handleThemeChange}>
                {theme === "light" ? <MoonIcon/> : <SunIcon/>}
            </Button>
        </ThemeToggleWrapper>
    );
};

export default ThemeToggle;