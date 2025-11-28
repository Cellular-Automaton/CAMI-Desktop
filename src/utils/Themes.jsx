import React, { useState } from "react";

class ThemeManager {
    constructor() {
        this.colorThemes = COLOR_THEMES;
        this.themes = THEMES;
        this.currentColor = COLOR_THEMES[0];
        this.currentTheme = THEMES[1]; // Default to dark theme
    }

    getAllColorThemes() {
        return this.colorThemes;
    }

    getAllThemes() {
        return this.themes;
    }

    getColorTheme(key) {
        return this.colorThemes.find(theme => theme.key === key);
    }

    getTheme(key) {
        return this.themes.find(theme => theme.key === key);
    }

    getCurrentColorTheme() {
        return this.currentColor;
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    applyColorTheme(key) {
        if (!key)
            return;
        
        const theme = this.getColorTheme(key);
        if (!theme)
            return;

        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-secondary', theme.secondary);
        root.style.setProperty('--color-accent', theme.accent);
        root.setAttribute('data-color', name);
        this.currentColor = theme;
    }

    applyTheme(key) {
        if (!key)
            return;

        const theme = this.getTheme(key);
        if (!theme)
            return;

        const root = document.documentElement;
        root.style.setProperty('--color-background', theme.background);
        root.style.setProperty('--color-background-alt', theme.backgroundAlt);
        root.style.setProperty('--color-text', theme.text);
        root.style.setProperty('--color-text-alt', theme.textAlt);
        root.setAttribute('data-theme', name);
        this.currentTheme = theme;
    }
}

const COLOR_THEMES = [
    {
        key: "violet",
        primary: '#7F6EEE',
        secondary: '#6B5BB8',
        accent: '#9a8df2',
    },
    {
        key: "red",
        primary: '#EE6E7F',
        secondary: '#B86B5B',
        accent: '#f29a8d',
    },
    {
        key: "gold",
        primary: '#EEBA6E',
        secondary: '#B88F5B',
        accent: '#f2d39a',
    },
    {
        key: "green",
        primary: '#6EEE7F',
        secondary: '#5BB86B',
        accent: '#9af2d3',
    },
    {
        key: "blue",
        primary: '#6E7FEE',
        secondary: '#5B6BB8',
        accent: '#9aadef',
    },
    {
        key: "cyan",
        primary: '#6EE7FF',
        secondary: '#5BB8C8',
        accent: '#9af2ff',
    },
    {
        key: "pink",
        primary: '#EE6EFF',
        secondary: '#B85BB8',
        accent: '#f29aff',
    },
    {
        key: "orange",
        primary: '#FF8C6E',
        secondary: '#B86B5B',
        accent: '#ffb99a',
    },
];

const THEMES = [
    {
        key: "light",
        background: '#FFFAFA',
        backgroundAlt: '#DCDCDC',
        text: '#1A1A1A',
        textAlt: '#333333',
    },
    {
        key: "dark",
        background: '#0A0A0A',
        backgroundAlt: '#191919',
        text: '#FFFFFF',
        textAlt: '#BDBDBD',
    }
]

export const ThemeManagerInstance = new ThemeManager();