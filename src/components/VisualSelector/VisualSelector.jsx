import React, { useEffect, useState } from "react";
import { Button, Card, Chip } from "@mui/material";

const fakeData = [
    { id: "ea5d5dd5-b48d-4898-9a07-dab38be1e1c", name: "GameOfLife", visualUrl: "https://api.github.com/repos/Cellular-Automaton/GameOfLifeVisual/releases/latest" },
    { id: "template-1", name: "Template 1" },
    { id: "template-2", name: "Template 2" },
    { id: "template-3", name: "Template 3" },
    { id: "template-4", name: "Template 4" },
    { id: "template-5", name: "Template 5" },
    { id: "template-6", name: "Template 6" },
    { id: "template-7", name: "Template 7" },
    { id: "template-8", name: "Template 8" },
    { id: "template-9", name: "Template 9" },
]

const VisualSelector = ({ visual, selectedVisual, onSelect }) => {
    const [installedId, setInstalledId] = useState({});
    
    useEffect(() => {
        let alive = true;

        const loadState = async () => {
            try {
                const pairs = await Promise.all(
                    fakeData.map(async (vis) => {
                        const ok = await window.electron.isVisualInstalled(vis.id);
                        return [vis.id, !!ok];
                    })
                )
                if (alive) {
                    setInstalledId(Object.fromEntries(pairs))
                }
            } catch (error) {
                console.error("Error loading visual state:", error);
            }
        }
        loadState();
        return () => { alive = false; }
    }, []);

    return (
        <div id="visual-container" className="bg-midnight h-full text-white px-5 py-5 flex flex-col overflow-hidden font-mono">
            <label htmlFor="visual-select" className="text-xl font-bold">Visuals available:</label>
            <p className="mb-5 opacity-50">Select a visual you want to use.</p>
            <div id="visual-select" className="flex flex-col gap-5 overflow-y-scroll py-2 max-h-96">
                {
                    fakeData.map((vis) => {
                        const isInstalled = installedId[vis.id];
                        return (
                        <Card
                            key={vis.id}
                            className="
                                flex flex-row items-center h-20 shrink-0
                                p-4 cursor-pointer hover:opacity-50 !bg-midnight"
                            onClick={() => onSelect(vis)}
                    >
                        <span className="flex flex-col w-3/5 h-full justify-center !text-white">{vis.name}</span>
                        <div className="flex flex-col h-full w-1/5 justify-center">
                            {
                                isInstalled === undefined ? (
                                    <Chip label="Loading..." color="warning"></Chip>
                                ) : isInstalled ? (
                                    <Chip label="Installed" color="success"></Chip>
                                ) : (
                                    <Chip label="Not Installed" color="error"></Chip>
                                )
                            }
                        </div>
                        <div className="flex flex-col h-full w-1/5 justify-center items-center">
                            {
                                isInstalled ? (
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    Uninstall
                                </Button>
                                ) : 
                                null
                            }
                        </div>
                    </Card>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default VisualSelector;