import React, { useState, useEffect, useRef, useContext } from "react";
import SimulationPlayer from "../../components/SimulationPlayer/SimulationPlayer.jsx";
import TwoDDisplay from "../../components/2DDisplay/2DDisplay.jsx";
import { SimulationContext } from "../../contexts/SimulationContext.jsx";
import { toast } from "react-toastify";

export default function Playground() {
    const [gridSize, setGridSize] = useState(10);
    const [parameters, setParameters] = useState({});
    const [gap, setGap] = useState(5);
    const [response, setResponse] = useState([]);

    const { 
        startSimulation, stopSimulation, 
        isSimulationRunning, clearAll,
        importSimulation, exportSimulation, getSimulationParameters 
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
                
            });
        } catch (error) {
            console.error("Error fetching simulation parameters:", error);
            toast.error("Error fetching simulation parameters: " + error.message);
        }
        return () => {
            
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
        await startSimulation(gridSize, params);
    }

    const onStopSimulation = () => {
        stopSimulation();
    }

    return (
        <div id="playground" className='flex flex-col h-full w-full relative'>
            <div className="flex flex-col justify-center absolute right-4 w-1/4 h-full bg-transparent z-50 pointer-events-none">
                <div id="configuration-panel" className="flex flex-col w-full bg-midnight-opacity p-4 rounded-lg font-mono gap-4 pointer-events-auto">
                    <div id="configurations" className="flex flex-col gap-4 ">
                        {
                            Object.keys(parameters).length > 0 ? (
                                Object.keys(parameters).map((key) => {
                                    return (
                                        <div key={key} className="flex flex-col w-full">
                                            <label className="text-white">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                                            <input
                                                className="text-white bg-midnight-opacity rounded-md"
                                                type={parameters[key].type.toLowerCase() === "number" ? "number" : "text"}
                                                value={parameters[key].value}
                                                disabled={isSimulationRunning}
                                                onChange={(e) => {
                                                    setParameters(prev => ({
                                                        ...prev,
                                                        [key]: {
                                                            ...prev[key],
                                                            value: e.target.value
                                                        }
                                                    }));
                                                }}
                                            />
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-white">Loading parameters...</p>
                            )
                        }
                        <div id="size" className="flex flex-col w-full">
                            <label className="text-white">Size</label>
                            <input 
                                className="text-white bg-midnight-opacity rounded-md" type="number" 
                                max={50} min={5} value={gridSize} disabled={isSimulationRunning}
                                onChange={(e) => {setGridSize(e.target.value)}}/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 justify-center items-center">
                        <div id="start" className="flex justify-center items-center w-3/4">
                            <button className="flex flex-col justify-center items-center w-full h-10 bg-midnight-purple text-white rounded-lg"
                                onClick={onStartSimulation} >
                                Start
                            </button>
                        </div>
                        <div id="import-export" className="flex flex-row justify-center w-3/4 gap-2 items-center">
                            <button className="flex flex-col justify-center items-center w-1/2 h-10 bg-midnight-purple text-white rounded-lg"
                                onClick={importSimulation} >
                                Import
                            </button>
                            <button className="flex flex-col justify-center items-center w-1/2 h-10 bg-midnight-purple text-white rounded-lg"
                                onClick={exportSimulation} >
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <SimulationPlayer 
                onStartSimulation={onStartSimulation} 
                onStopSimulation={onStopSimulation}
                isPlaying={isSimulationRunning}
            />
            <TwoDDisplay
                gridSize={gridSize}
                setGridSize={setGridSize}
            />
        </div>
    );
}