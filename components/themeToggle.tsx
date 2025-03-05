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
`
const ThemeToggle = () => {
    const {theme, setTheme} = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        const initialTheme = localStorage.getItem('theme');
        if (!initialTheme) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                setTheme('dark')
            } else {
                setTheme('light')
            }
            return;
        }
        setTheme(initialTheme);

    }, []);


    const handleThemeChange = () => theme === 'light' ? setTheme('dark') : setTheme('light');
    return (
        <ThemeToggleWrapper>
            <Button variant={'ghost'} onClick={handleThemeChange}>
                {theme === "light" && mounted ? <MoonIcon/> : <SunIcon/>}
            </Button>
        </ThemeToggleWrapper>
    );
};

export default ThemeToggle;