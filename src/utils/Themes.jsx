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
        root.style.setProperty('--color-text-primary', theme.textPrimary);
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
        textPrimary: '#000000',
    },
    {
        key: "purple",
        primary: '#6B4BCC',
        secondary: '#5538A8',
        accent: '#8B6FE8',
        textPrimary: '#FFFFFF',
    },
    {
        key: "Wisteria",
        primary: '#B4A5F5',
        secondary: '#9887D9',
        accent: '#D4C9FF',
        textPrimary: '#000000',
    },
    {
        key: "red",
        primary: '#EE6E7F',
        secondary: '#B86B5B',
        accent: '#f29a8d',
        textPrimary: '#000000',
    },
    {
        key: "crimson",
        primary: '#B8374A',
        secondary: '#8F2A3A',
        accent: '#D85566',
        textPrimary: '#FFFFFF',
    },
    {
        key: "coral",
        primary: '#FF7A5C',
        secondary: '#E06547',
        accent: '#FF9F85',
        textPrimary: '#000000',
    },
    {
        key: "gold",
        primary: '#EEBA6E',
        secondary: '#B88F5B',
        accent: '#f2d39a',
        textPrimary: '#000000',
    },
    {
        key: "peach",
        primary: '#FFB380',
        secondary: '#E69966',
        accent: '#FFCFA8',
        textPrimary: '#000000',
    },
    {
        key: "copper",
        primary: '#B87333',
        secondary: '#955D28',
        accent: '#D8965A',
        textPrimary: '#FFFFFF',
    },
    {
        key: "green",
        primary: '#6EEE7F',
        secondary: '#5BB86B',
        accent: '#9af2d3',
        textPrimary: '#000000',
    },
    {
        key: "mint",
        primary: '#7FD8BE',
        secondary: '#5FB89E',
        accent: '#A8E8D5',
        textPrimary: '#000000',
    },
    {
        key: "teal",
        primary: '#2D9B9B',
        secondary: '#237676',
        accent: '#4EC4C4',
        textPrimary: '#FFFFFF',
    },
    {
        key: "blue",
        primary: '#6E7FEE',
        secondary: '#5B6BB8',
        accent: '#9aadef',
        textPrimary: '#000000',
    },
    {
        key: "aqua",
        primary: '#7BC9D6',
        secondary: '#5FA8B5',
        accent: '#A8E0EB',
        textPrimary: '#000000',
    },
    {
        key: "ice",
        primary: '#A0D5E8',
        secondary: '#7FB8CC',
        accent: '#C5E8F5',
        textPrimary: '#000000',
    },
    {
        key: "slateblue",
        primary: '#6B8CAE',
        secondary: '#547391',
        accent: '#8FAEC9',
        textPrimary: '#FFFFFF',
    },
    {
        key: "steel",
        primary: '#6B8E9E',
        secondary: '#547280',
        accent: '#8FB0C1',
        textPrimary: '#FFFFFF',
    },
    {
        key: "periwinkle",
        primary: '#8AA8D6',
        secondary: '#6B8AB8',
        accent: '#B3C8E8',
        textPrimary: '#000000',
    },
    {
        key: "navy",
        primary: '#2C5F8D',
        secondary: '#1E4263',
        accent: '#4A8EC2',
        textPrimary: '#FFFFFF',
    },
    {
        key: "pink",
        primary: '#D89CC7',
        secondary: '#BC80AB',
        accent: '#ECBEE0',
        textPrimary: '#000000',
    },
    {
        key: "mauve",
        primary: '#C97BA6',
        secondary: '#A65E87',
        accent: '#E0A0C7',
        textPrimary: '#000000',
    },
    {
        key: "sunset",
        primary: '#FF8BA7',
        secondary: '#E36B7A',
        accent: '#FFB3C6',
        textPrimary: '#000000',
    },
    {
        key: "raspberry",
        primary: '#B85C7A',
        secondary: '#944763',
        accent: '#D9809D',
        textPrimary: '#FFFFFF',
    },
    {
        key: "orange",
        primary: '#FF8C6E',
        secondary: '#B86B5B',
        accent: '#ffb99a',
        textPrimary: '#000000',
    },
    {
        key: "silver",
        primary: '#8B9199',
        secondary: '#6B7178',
        accent: '#B0B8C1',
        textPrimary: '#FFFFFF',
    },
    {
        key: "espresso",
        primary: '#8B6B47',
        secondary: '#6B5238',
        accent: '#B8946B',
        textPrimary: '#FFFFFF',
    },
];

const THEMES = [
    {
        key: "light",
        isDark: false,
        background: '#F5F5F5',
        backgroundAlt: '#DCDCDC',
        text: '#1A1A1A',
        textAlt: '#333333',
    },
    {
        key: "dark",
        isDark: true,
        background: '#0A0A0A',
        backgroundAlt: '#191919',
        text: '#FFFFFF',
        textAlt: '#BDBDBD',
    },
    {
        key: "midnight",
        isDark: true,
        background: '#0C1221',
        backgroundAlt: '#161D2E',
        text: '#E6EBF5',
        textAlt: '#9BA8C4',
    },
    {
        key: "charcoal",
        isDark: true,
        background: '#1A1D23',
        backgroundAlt: '#25282F',
        text: '#F0F0F0',
        textAlt: '#B8BCC4',
    },
    {
        key: "burgundy",
        isDark: true,
        background: '#1A0D14',
        backgroundAlt: '#2A1721',
        text: '#F5E6EE',
        textAlt: '#D4A8BF',
    },
    {
        key: "forest",
        isDark: true,
        background: '#0D1A12',
        backgroundAlt: '#16261C',
        text: '#E8F5EC',
        textAlt: '#A8D4B8',
    },
    {
        key: "slate",
        isDark: true,
        background: '#151B24',
        backgroundAlt: '#1F2730',
        text: '#E8EDF3',
        textAlt: '#A5B4C7',
    }
]

export const ThemeManagerInstance = new ThemeManager();