import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

export const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
    const [cellInstances, setCellInstances] = useState([]);
    const [response, setResponse] = useState([]);
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const [importedData, setImportedData] = useState(null);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
    const [frames, setFrames] = useState([]);
    const [parameters, setParameters] = useState({});
    
    const intervalRef = useRef(null);
    const currentFrameRef = useRef(0);

    const startSimulation = (gridSize, params) => {
        setIsSimulationRunning(true);

        // Set first frame to the frames
        setFrames([cellInstances.map(cell => cell.state)]);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        intervalRef.current = setInterval(() => getSimulationData(gridSize, params), 50);
    };

    const stopSimulation = () => {
        setIsSimulationRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const getSimulationData = async (gridSize, params) => {
        console.log(parameters)
        try {
            if (!selectedAlgorithm) return;
            console.log("Parameters before sending to plugin:", params);
            const table = cellInstances.map(cell => cell.state);
            const param = [selectedAlgorithm.automaton_id, table, ...params];
            const res = await window.electron.callPlugin(param);
            setResponse(res);
            setFrames(prev => {
                const next = [...prev, res];
                currentFrameRef.current = next.length - 1;
                return next;
            });
        } catch (error) {
            console.error("IPC Call error :", error);
        }
    };

    const clearAll = () => {
        clearCells();
        setResponse([]);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsSimulationRunning(false);
        setFrames([]);
        currentFrameRef.current = 0;
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []);

    const importSimulation = async (algorithm_id) => {
        const filePath = await window.electron.openDialog("json");

        if (filePath) {
            try {
                const data = await window.electron.loadTextFile(filePath);
                const parsedData = JSON.parse(data);

                if (algorithm_id && parsedData.algorithm_id !== algorithm_id) {
                    throw new Error("Imported save does not match the selected algorithm");
                }

                setImportedData(parsedData);
                clearCells();
                toast.success("Simulation data imported successfully!");
            } catch (error) {
                toast.error("Error importing simulation data");
            }
        }
    };

    const exportSimulation = async () => {
        const exportedData = cellInstances.map(cell => (cell.state));
        const data = {
            "algorithm_id" : selectedAlgorithm ? selectedAlgorithm.automaton_id : null,
            "parameters": parameters,
            "frames": exportedData,
        }

        // TODO : Faire en sorte que le toast ne s'enclenche qu'une fois l'export terminé
        try {
            await window.electron.saveJson(data);
            toast.success("Simulation data exported successfully!");
        } catch (error) {
            toast.error("Error exporting simulation data: " + error.message);
        }
    }

    const getSimulationParameters = async () => {
        try {
            if (!selectedAlgorithm) return [];
            const response = await window.electron.getAlgorithmParameters([selectedAlgorithm.automaton_id]);
            return response;
        } catch (error) {
            console.error("Error fetching simulation parameters:", error);
            return [];
        }
    };

    const setCurrentFrame = (index) => {
        if (index < 0 || index >= frames.length) {
            console.warn("Index out of bounds for frames array");
            return;
        }
        const currentFrame = frames[index];
        cellInstances.forEach((cell, i) => {
            cell.setState(currentFrame[i]);
        });
        setCellInstances([...cellInstances]);
        currentFrameRef.current = index;
    };

    const clearCells = () => {
        cellInstances.forEach(cell => cell.setState(0));
        setCellInstances([...cellInstances]);
        setResponse([]);
    }

    const clearFrames = () => {
        setFrames([]);
        currentFrameRef.current = 0;
    };

    return (
        <SimulationContext.Provider value={{
            startSimulation, stopSimulation, response, setResponse,
            cellInstances, setCellInstances, isSimulationRunning,
            clearAll, importSimulation, exportSimulation, importedData, setImportedData,
            selectedAlgorithm, setSelectedAlgorithm, getSimulationParameters, frames, setFrames,
            currentFrameRef, clearFrames, setCurrentFrame, parameters, setParameters
        }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    return useContext(SimulationContext);
};