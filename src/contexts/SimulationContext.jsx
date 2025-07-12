import React, { createContext, useContext, useState } from "react";

export const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
    const [cellInstances, setCellInstances] = useState([]);
    const [response, setResponse] = useState([]);
    const [fetchInterval, setFetchInterval] = useState(null);
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const [importedData, setImportedData] = useState(null);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

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
            console.log(params);
            const parameters = [selectedAlgorithm.automaton_id, table, ...params];
            console.log("Parameters sent to plugin:", parameters);
            const response = await window.electron.callPlugin(parameters);
            setResponse(response);
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
            const data = await window.electron.loadTextFile(filePath);
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

    const getSimulationParameters = async () => {
        try {
            const response = await window.electron.getAlgorithmParameters([selectedAlgorithm.automaton_id]);
            return response;
        } catch (error) {
            console.error("Error fetching simulation parameters:", error);
        }
    };

    return (
        <SimulationContext.Provider value={{
            startSimulation, stopSimulation, response, setResponse,
            cellInstances, setCellInstances, isSimulationRunning,
            clearAll, importSimulation, exportSimulation, importedData, setImportedData,
            selectedAlgorithm, setSelectedAlgorithm, getSimulationParameters
        }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    return useContext(SimulationContext);
};