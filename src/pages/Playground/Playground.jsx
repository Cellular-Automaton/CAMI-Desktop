import React, { useState, useEffect, useContext } from "react";
import { SimulationContext } from "../../contexts/SimulationContext.jsx";
import { NavigateBackContext } from "../../contexts/NavigateBackContext.jsx";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import VisualLoader from "../VisualLoader.jsx";
import { useNavigate } from "react-router-dom";

export default function Playground() {
    const [gridSize, setGridSize] = useState(10);
    const [visualComponent, setVisualComponent] = useState(null);
    const { state } = useLocation();
    const algorithmFromState = state ? state.algorithm : null;
    const visualFromState = state ? state.visual : null;
    const isTryFromState = state ? state.isTry : false;
    const navigate = useNavigate();

    const { 
        startSimulation, stopSimulation, 
        isSimulationRunning, clearAll,
        importSimulation, exportSimulation, getSimulationParameters,
        clearFrames, parameters, setParameters, importedData, setSelectedAlgorithm
    } = useContext(SimulationContext);
    const { hideReturnButton, setReturnCallback } = useContext(NavigateBackContext);

    useEffect(() => {

        try {
            getSimulationParameters().then((params) => {
                const tmp = {};
                
                // delete first parameter because not needed
                params.shift();
                params.map((param, index) => {
                    const [name, type] = param.split(':');
                    tmp[name] = {
                        type: type,
                        value: ""
                    };
                });
                setParameters(tmp);
                console.log(algorithmFromState);

                // Load visual with preload and src paths
                loadVisual();
            });
        } catch (error) {
            console.error("Error fetching simulation parameters:", error);
            toast.error("Error fetching simulation parameters: " + error.message);
        }

        hideReturnButton();
        setReturnCallback(null);
        return () => {
            console.log("Cleaning up...");
            stopSimulation();
            clearAll();

            if (isTryFromState) {
                window.electron.removeTryVisual()
            }
        }
    }, []);

    useEffect(() => {
        if (parameters && Object.keys(parameters).length < 0)
            return;
        setParameters(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(key => {
                if (key.toLowerCase() === "width" || key.toLowerCase() === "height") {
                    updated[key] = {
                        ...updated[key],
                        value: gridSize
                    };
                }
            });
            return updated;
        });
    }, [gridSize]);

    useEffect(() => {
        if (importedData === undefined || importedData === null)
            return;

        const params = importedData.parameters;
        if (!params || Object.keys(params).length === 0) {
            toast.error("Imported data does not contain parameters.");
            return;
        }
        // Replace current parameters with imported ones
        setParameters(prev => {
            const updated = { ...prev };
            Object.keys(params).forEach(key => {
                if (updated[key]) {
                    updated[key] = {
                        ...updated[key],
                        value: params[key].value
                    };
                }
            });
            console.log("Parameters after import:", updated);
            return updated;
        });
    }, [importedData]);

    const renderVisual = async () => {
        let visualUrl;
        const visualFolder = await window.electron.getVisualFolder();
        const currentUrl = await window.electron.getServerURL();
        const preloadPath = "file://" + visualFolder.replace(/\\/g, "/") + "/webview_preload.js";
        const srcPath = currentUrl + "base.html";

        if (!isTryFromState) {
            const visualById = await window.electron.getVisualById(visualFromState.id);
            if (!visualById) {
                toast.error("Visual not found: " + visualFromState.name);
                return null;
            }
            visualUrl = currentUrl + visualById.path.replace("Visuals/", "");
        } else {
            visualUrl = currentUrl + "try.js";
            setSelectedAlgorithm(algorithmFromState);
        }
        return (
            <VisualLoader preloadPath={preloadPath} srcPath={srcPath} visualUrl={visualUrl} />
        )
    };

    const loadVisual = async () => {
        try {
            const visual = await renderVisual();
            setVisualComponent(visual);
        } catch (error) {
            console.error("Error loading visual:", error);
            toast.error("An error occurred while loading the visual. Returning to home.");
            navigate("/Home");
        }
    };

    return (
        <div id="playground" className='flex flex-col h-full w-full relative'>
            {
                visualComponent
            }
        </div>
    );
}