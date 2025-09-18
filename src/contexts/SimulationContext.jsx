import { frame } from "motion";
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
        try {
            if (!selectedAlgorithm) return;
            const table = cellInstances.map(cell => cell.state);
            const parameters = [selectedAlgorithm.automaton_id, table, ...params];
            const res = await window.electron.callPlugin(parameters);
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

    const importSimulation = async () => {
        const filePath = await window.electron.openDialog("json");

        if (filePath) {
            try {
                const data = await window.electron.loadTextFile(filePath);
                const parsedData = JSON.parse(data);
                setImportedData(parsedData);
                setFrames([]);
                toast.success("Simulation data imported successfully!");
            } catch (error) {
                toast.error("Error importing simulation data");
            }
        }
    };

    const exportSimulation = () => {
        const exportedData = cellInstances.map(cell => (cell.state));
        const data = JSON.stringify(exportedData);

        try {
            window.electron.send('save-json', data);
            toast.success("Simulation data exported successfully!");
        } catch (error) {
            toast.error("Error exporting simulation data");
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
            currentFrameRef, clearFrames, setCurrentFrame
        }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    return useContext(SimulationContext);
};