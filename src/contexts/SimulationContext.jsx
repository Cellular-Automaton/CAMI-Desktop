import React, { createContext, useContext, useState } from "react";

export const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
    const [cellInstances, setCellInstances] = useState([]);
    const [response, setResponse] = useState([]);
    const [fetchInterval, setFetchInterval] = useState(null);
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const [importedData, setImportedData] = useState(null);

    const startSimulation = (gridSize) => {
        setIsSimulationRunning(true);
        setFetchInterval(setInterval(() => getSimulationData(gridSize), 150));
    };

    const stopSimulation = () => {
        setIsSimulationRunning(false);
        if (fetchInterval) {
            clearInterval(fetchInterval);
            setFetchInterval(null);
        }
    };

    const getSimulationData = async (gridSize) => {
        try {
            const table = new Uint32Array(cellInstances.map(cell => cell.state));
            const parameters = [table, new Number(gridSize), new Number(gridSize)];
            setResponse(await window.electron.callSimulateGol(parameters));
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
        const filePath = await window.electron.openDialog();

        if (filePath) {
            const data = await window.electron.loadFile(filePath);
            const parsedData = JSON.parse(data);
            console.log("Imported Data:", parsedData);
            setImportedData(parsedData);
        }
    };

    const exportSimulation = () => {
        const exportedData = cellInstances.map(cell => (cell.state));
        const data = JSON.stringify(exportedData);

        console.log("Exported Data:", data);
        window.electron.send('save-json', data);
    }

    return (
        <SimulationContext.Provider value={{
            startSimulation, stopSimulation, response, setResponse,
            cellInstances, setCellInstances, isSimulationRunning,
            clearAll, importSimulation, exportSimulation, importedData, setImportedData
        }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    return useContext(SimulationContext);
};