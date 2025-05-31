import React, { useState, useEffect, useRef, useContext } from "react";
import Cell from "../../classes/Cell.jsx";
import SimulationPlayer from "../../components/SimulationPlayer/SimulationPlayer.jsx";
import TwoDDisplay from "../../components/2DDisplay/2DDisplay.jsx";
import { SimulationContext } from "../../contexts/SimulationContext.jsx";

export default function Playground() {
    const [gridSize, setGridSize] = useState(10);
    const [gap, setGap] = useState(5);
    const [response, setResponse] = useState([]);

    const { 
        startSimulation, stopSimulation, 
        isSimulationRunning, clearAll,
        importSimulation, exportSimulation
    } = useContext(SimulationContext);

    useEffect(() => {
        return () => {
            clearAll(); // Clear all when the component unmounts
        }
    }, []);

    const onStartSimulation = async () => {
        await startSimulation(gridSize);
    }

    const onStopSimulation = () => {
        stopSimulation();
    }

    return (
        <div id="playground" className='flex flex-col h-full w-full relative'>
            <div className="flex flex-col justify-center absolute right-4 w-1/4 h-full bg-transparent z-50 pointer-events-none">
                <div id="configuration-panel" className="flex flex-col w-full bg-midnight-opacity p-4 rounded-lg font-mono gap-4 pointer-events-auto">
                    <div id="configurations" className="flex flex-col gap-4 ">
                        {/* 
                            Ask to the app all the configuartion elements of the simulation such as : Size, Rules, etc...
                            Currently, the configuration panel is empty so Size as a functionnal placeholder
                            Should be in JSON format like this : {"name": "format"}
                            example : {"size": "number", "rules": "string", etc...}
                        */}
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