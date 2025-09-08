import { frame } from "motion";
import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

export const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
    const [cellInstances, setCellInstances] = useState([]);
    const [response, setResponse] = useState([]);
    const [fetchInterval, setFetchInterval] = useState(null);
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const [importedData, setImportedData] = useState(null);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
    const [frames, setFrames] = useState([]);
    const [cFrame, setCFrame] = useState(0);

    const startSimulation = (gridSize, params) => {
        setIsSimulationRunning(true);
        setFetchInterval(setInterval(() => getSimulationData(gridSize, params), 50));
    };

    const stopSimulation = () => {
        setIsSimulationRunning(false);
        if (fetchInterval) {
            clearInterval(fetchInterval);
            setFetchInterval(null);
        }
    };

    const getSimulationData = async (gridSize, params) => {
        try {
            const table = cellInstances.map(cell => cell.state);
            const parameters = [selectedAlgorithm.automaton_id, table, ...params];
            const response = await window.electron.callPlugin(parameters);
            setResponse(response);
            setFrames(prevFrames => [...prevFrames, response]);
            setCFrame(frames.length - 1);
        } catch (error) {
            console.error("IPC Call error :", error);
        }
    };

    const clearAll = () => {
        setCellInstances([]);
        setResponse([]);
        if (fetchInterval) {
            clearInterval(fetchInterval);
            setFetchInterval(null);
        }
        setIsSimulationRunning(false);
    };

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
            const response = await window.electron.getAlgorithmParameters([selectedAlgorithm.automaton_id]);
            return response;
        } catch (error) {
            console.error("Error fetching simulation parameters:", error);
        }
    };

    const setCurrentFrame = (index) => {
        if (index < 0 || index >= frames.length) {
            console.error("Index out of bounds for frames array");
            return;
        }
        const currentFrame = frames[index];
        cellInstances.forEach((cell, i) => {
            cell.setState(currentFrame[i]);
        });
        setCellInstances([...cellInstances]);
    };

    const clearFrames = () => {
        setFrames([]);
        setCFrame(0);
    };

    return (
        <SimulationContext.Provider value={{
            startSimulation, stopSimulation, response, setResponse,
            cellInstances, setCellInstances, isSimulationRunning,
            clearAll, importSimulation, exportSimulation, importedData, setImportedData,
            selectedAlgorithm, setSelectedAlgorithm, getSimulationParameters, frames, setFrames, setCurrentFrame,
            cFrame, setCFrame, clearFrames
        }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    return useContext(SimulationContext);
};