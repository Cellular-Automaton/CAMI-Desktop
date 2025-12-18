import React, { useContext, useEffect, useState } from "react";
import { Button, Card, CardActionArea, Chip } from "@mui/material";
import { APIContext } from "../../contexts/APIContext.jsx";
import { toast } from "react-toastify";

const fakeData = [
    { id: "ea5d5dd5-b48d-4898-9a07-dab38be1e1c", name: "GameOfLife", visualUrl: "https://api.github.com/repos/Cellular-Automaton/GameOfLifeVisual/releases/latest" },
    { id: "template-1", name: "Template 1" },
    { id: "template-2", name: "Template 2" },
    { id: "template-3", name: "Template 3" },
]

const VisualSelector = ({ algorithmId, selectedVisual, onSelect }) => {
    const [currentVisual, setCurrentVisual] = useState([]);
    const { getVisualLinkedToAlgorithm } = useContext(APIContext);

    useEffect(() => {
        const fetchCurrentVisual = async () => {
            console.log("Fetching current visual for algorithm:", algorithmId);
            try {
                const visuals = await getVisualLinkedToAlgorithm(algorithmId);
                console.log("Fetched current visual:", visuals);
                for (let i = 0; i < visuals.length; i++) {
                    visuals[i].isInstalled = await window.electron.isVisualInstalled(visuals[i].id);
                }
                setCurrentVisual(visuals);
            } catch (error) {
                console.error("Error fetching current visual:", error);
            }
        }
        fetchCurrentVisual();
    }, []);

    const handleDeleteVisual = async (visual) => {
        try {
            await window.electron.uninstallVisual(visual.id);
            const updatedVisuals = currentVisual.map(v => {
                if (v.id === visual.id) {
                    return { ...v, isInstalled: false };
                }
                return v;
            });
            setCurrentVisual(updatedVisuals);
            toast.success(`Visual "${visual.name}" uninstalled successfully.`);
        } catch (error) {
            console.error("Error uninstalling visual:", error);
            toast.error(`Failed to uninstall visual "${visual.name}".`);
        }
    }

    return (
        <div id="visual-container" className="bg-background h-full text-text px-5 py-5 flex flex-col overflow-hidden font-mono">
            <label htmlFor="visual-select" className="text-xl font-bold">Visuals available:</label>
            <p className="mb-5 text-textAlt">Select a visual you want to use.</p>
            <div id="visual-select" className="flex flex-col gap-5 overflow-y-scroll px-10 py-5 max-h-96">
                {
                    currentVisual.map((vis) => {
                        return (
                        <Card
                            key={vis.id}
                            className="
                                relative flex flex-row items-center h-fit w-full shrink-0
                                cursor-pointer hover:opacity-50 !bg-backgroundAlt
                                hover:ring-4 hover:ring-primary hover:scale-105 !transition-all duration-200
                                focus-within:opacity-50 focus-within:ring-4 focus-within:ring-primary
                                focus-within:scale-105
                                "
                            variant={selectedVisual && selectedVisual.id === vis.id ? "elevation" : "outlined"}
                            onClick={() => onSelect(vis)}
                    >
                        <CardActionArea>
                            <div className="p-4 h-full w-full flex flex-row items-center gap-5">
                                <div className="flex flex-col w-3/5 h-full justify-center">
                                    <h1 className="!text-text">{vis.name}</h1>
                                    <h2 className="!text-textAlt text-sm">Made by: {vis.posted_by.username === null ? "Unknown" : vis.posted_by.username}</h2>
                                </div>
                                <div className="flex flex-col h-full w-1/5 justify-center">
                                    {
                                        vis.isInstalled === undefined ? (
                                            <Chip label="Loading..." color="warning"></Chip>
                                        ) : vis.isInstalled ? (
                                            <Chip label="Installed" color="success"></Chip>
                                        ) : (
                                            <Chip label="Not Installed" color="error"></Chip>
                                        )
                                    }
                                </div>
                                <div className="flex flex-col h-full w-1/5 justify-center items-center">
                                    {
                                        vis.isInstalled ? (
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                await handleDeleteVisual(vis);
                                            }}
                                        >
                                            Uninstall
                                        </Button>
                                        ) : 
                                        null
                                    }
                                </div>
                            </div>
                        </CardActionArea>
                    </Card>
                        )
                    })
                }
            </div>
        </div>
    );
}

export default VisualSelector;