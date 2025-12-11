import { Box, Divider, Tab, Tabs } from "@mui/material";
import React, {useEffect, useState} from "react";

import { ThemeManagerInstance } from "../../utils/Themes.jsx";

const Settings = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [currentColorTheme, setCurrentColorTheme] = useState(ThemeManagerInstance.getCurrentColorTheme());
    const [currentTheme, setCurrentTheme] = useState(ThemeManagerInstance.getCurrentTheme());
    const colorThemes = ThemeManagerInstance.getAllColorThemes();
    const themes = ThemeManagerInstance.getAllThemes();

    const applyColorTheme = (name) => {
        ThemeManagerInstance.applyColorTheme(name);
        setCurrentColorTheme(ThemeManagerInstance.getCurrentColorTheme());
    }

    const applyTheme = (name) => {
        ThemeManagerInstance.applyTheme(name);
        setCurrentTheme(ThemeManagerInstance.getCurrentTheme());
    }

    return (
        <div className="flex flex-col w-full h-full bg-background justify-start items-center text-text pt-10">
            <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
                <Tabs
                    value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} 
                    aria-label="settings tabs" slotProps={{indicator: {style: {backgroundColor: 'var(--color-accent)'}}}}>
                    <Tab label="Appearance" sx={{
                            color: 'var(--color-text)',
                            '&.Mui-selected': { 
                                color: 'var(--color-accent)',
                            },
                        }}/>
                    <Tab label="WIP" sx={{
                            color: 'var(--color-text)',
                            '&.Mui-selected': { 
                                color: 'var(--color-accent)',
                            },
                        }}/>
                </Tabs>
            </Box>

            <div id="container" className="px-32 py-16 w-full h-full text-wrap overflow-hidden">

                <div id="appearance-tab-panel" role="tabpanel" hidden={tabIndex !== 0} className="flex flex-col gap-5 w-full h-full bg-background">
                    <div>
                        <h1 className="text-3xl text-text font-bold">Appearance Settings</h1>
                        <p className="text-lg text-textAlt">Here you can customize the appearance of the application.</p>
                    </div>

                    <div>
                        <h2 className="text-xl text-text font-bold mt-5">Themes</h2>
                        <p className="text-md text-textAlt mb-3">Select a theme for the application.</p>
                        <div className="flex flex-row flex-wrap gap-4">
                            {
                                themes.map((theme) => (
                                    <button
                                        key={theme.key}
                                        className={`flex flex-col size-24 justify-center items-center p-4 rounded-lg hover:scale-110 transition-transform duration-300
                                            bg-midnight-opacity hover:bg-midnight-hover ${currentTheme.key === theme.key ? 'ring-4' : ''}
                                            ${currentTheme.isDark ? 'ring-white' : 'ring-black'}
                                        `}
                                        style={{backgroundColor: theme.background}}
                                        onClick={() => {
                                            applyTheme(theme.key);
                                        }}
                                    >
                                        <div
                                            className="text-white font-bold text-lg"
                                            style={{color: theme.text}}
                                        >
                                            {theme.key.charAt(0).toUpperCase() + theme.key.slice(1)}
                                        </div>
                                    </button>
                                ))
                            }
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl text-text font-bold mt-5">Color Themes</h2>
                        <p className="text-md text-textAlt mb-3">Select a color accentuation for the application.</p>
                        <div className="flex flex-row flex-wrap gap-4">
                            {
                                colorThemes.map((color) => (
                                    <button 
                                        key={color.key}
                                        className={`flex flex-col size-24 justify-center items-center p-4 rounded-lg hover:scale-110 transition-transform duration-300
                                            bg-midnight-opacity hover:bg-midnight-hover ${currentColorTheme.key === color.key ? 'ring-4' : ''}
                                            ${currentTheme.isDark ? 'ring-white' : 'ring-black'}
                                            `}
                                        style={{backgroundColor: color.primary}}
                                        onClick={() => {
                                            applyColorTheme(color.key);
                                        }}
                                    >
                                        <div
                                            className="font-bold text-lg"
                                            style={{color: color.textPrimary}}
                                        >
                                            {color.key.charAt(0).toUpperCase() + color.key.slice(1)}
                                        </div>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>

                <div id="wip-tab-panel" role="tabpanel" hidden={tabIndex !== 1} className="flex flex-col justify-center items-center w-full h-full bg-background">
                    <h1 className="text-2xl text-text font-bold">Work In Progress</h1>
                    <p className="text-md text-textAlt">This section is under development. Stay tuned for more features!</p>
                </div>

            </div>
        </div>
    );
}

export default Settings;