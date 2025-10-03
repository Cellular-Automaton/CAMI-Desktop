import React, { useState, useEffect, useContext } from "react";
import SimulationPlayer from "../../components/SimulationPlayer/SimulationPlayer.jsx";
import { SimulationContext } from "../../contexts/SimulationContext.jsx";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import VisualLoader from "../VisualLoader.jsx";
import TwoDDisplay from "../../components/2DDisplay/2DDisplay.jsx";

export default function Playground() {
    const [gridSize, setGridSize] = useState(10);
    const [visualComponent, setVisualComponent] = useState(null);
    const { state } = useLocation();
    const algorithmFromState = state ? state.algorithm : null;

    const { 
        startSimulation, stopSimulation, 
        isSimulationRunning, clearAll,
        importSimulation, exportSimulation, getSimulationParameters,
        clearFrames, parameters, setParameters, importedData
    } = useContext(SimulationContext);

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
        return () => {
            console.log("Cleaning up...");
            stopSimulation();
            clearAll();
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

    const onStartSimulation = async () => {
        const params = Object.keys(parameters).map(key => parameters[key].value);
        Object.keys(params).forEach(key => {
            
            if (key.toLowerCase() === "width" || key.toLowerCase() === "height") {
                params[key] = gridSize;
            }
        });
        // Check if all parameters are set
        if (Object.values(parameters).some(param => param.value === "")) {
            toast.error("Please fill all parameters before starting the simulation.");
            return;
        }

        // Clear old frames
        clearFrames();

        // Start simulation
        await startSimulation(gridSize, params);
    }

    const onStopSimulation = () => {
        stopSimulation();
    }

    const renderVisual = async () => {
        const visualFolder = await window.electron.getVisualFolder();
        const currentUrl = await window.electron.getServerURL();
        const preloadPath = "file://" + visualFolder.replace(/\\/g, "/") + "/webview_preload.js";
        const srcPath = currentUrl + "base.html";
        return (
            <VisualLoader preloadPath={preloadPath} srcPath={srcPath} />
        )
    };

    const loadVisual = async () => {
        const visual = await renderVisual();
        setVisualComponent(visual);
    };

    return (
        <div id="playground" className='flex flex-col h-full w-full relative'>
            {
                visualComponent
            }
        </div>
    );
}