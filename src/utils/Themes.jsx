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

    async applyColorTheme(key) {
        if (!key)
            return;
        
        const theme = this.getColorTheme(key);
        if (!theme)
            return;

        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-secondary', theme.secondary);
        root.style.setProperty('--color-accent', theme.accent);
        root.dataset.color = theme.key;
        this.currentColor = theme;
        await window.electron.storeData('color-theme', key);
    }

    async applyTheme(key) {
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
        root.dataset.theme = theme.key;
        this.currentTheme = theme;
        await window.electron.storeData('theme', key);
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
        background: '#F5F5F5',
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
    },
    {
        key: "aquamarine",
        background: '#0A1428',
        backgroundAlt: '#142038',
        text: '#E8F2FF',
        textAlt: '#A8C7E7',
    },
    {
        key: "midnight",
        background: '#0C1221',
        backgroundAlt: '#161D2E',
        text: '#E6EBF5',
        textAlt: '#9BA8C4',
    },
    {
        key: "charcoal",
        background: '#1A1D23',
        backgroundAlt: '#25282F',
        text: '#F0F0F0',
        textAlt: '#B8BCC4',
    },
    {
        key: "burgundy",
        background: '#1A0D14',
        backgroundAlt: '#2A1721',
        text: '#F5E6EE',
        textAlt: '#D4A8BF',
    },
    {
        key: "forest",
        background: '#0D1A12',
        backgroundAlt: '#16261C',
        text: '#E8F5EC',
        textAlt: '#A8D4B8',
    },
    {
        key: "slate",
        background: '#151B24',
        backgroundAlt: '#1F2730',
        text: '#E8EDF3',
        textAlt: '#A5B4C7',
    }
]

export const ThemeManagerInstance = new ThemeManager();