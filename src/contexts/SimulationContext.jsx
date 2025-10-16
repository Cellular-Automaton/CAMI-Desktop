import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

export const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
    const [simulationTable, setSimulationTable] = useState([]);
    const [response, setResponse] = useState([]);
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
    const [frames, setFrames] = useState([]);
    const [parameters, setParameters] = useState({});
    
    const currentTableRef = useRef([]);
    const currentParametersRef = useRef({});

    const intervalRef = useRef(null);
    const currentFrameRef = useRef(0);

    const startSimulation = (table, params) => {
        setIsSimulationRunning(true);
        currentTableRef.current = table;
        currentParametersRef.current = params;

        // Set first frame to the frames
        setFrames(table);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        intervalRef.current = setInterval(() => getSimulationData(), 50);
    };


    const stopSimulation = () => {
        setIsSimulationRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const getSimulationData = async () => {
        console.log(currentFrameRef.current);
        try {
            if (!selectedAlgorithm) return;

            console.log("Parameters before sending to plugin:", currentParametersRef.current);
            const table = currentTableRef.current;
            const param = [selectedAlgorithm.automaton_id, table, ...Object.values(currentParametersRef.current)];
            console.log(param);
            const res = await window.electron.callPlugin(param);
            console.log("Response from plugin:", res);
            setResponse(res);
            currentTableRef.current = res;
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
                    toast.error("Imported save does not match the selected algorithm");
                    throw new Error("Imported save does not match the selected algorithm");
                }

                toast.success("Simulation data imported successfully!");
                return parsedData;
            } catch (error) {
                toast.error("Error importing simulation data");
            }
        }
    };

    const exportSimulation = async (table, params) => {
        const exportedData = simulationTable;
        const data = {
            "algorithm_id" : selectedAlgorithm ? selectedAlgorithm.automaton_id : null,
            "parameters": params,
            "frames": table,
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
            const res = await window.electron.getAlgorithmParameters([selectedAlgorithm.automaton_id]);
            return res;
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
        simulationTables.forEach((cell, i) => {
            cell.setState(currentFrame[i]);
        });
        setSimulationTable([...simulationTable]);
        currentFrameRef.current = index;
    };

    const clearCells = () => {
        simulationTable.forEach(cell => cell.setState(0));
        setSimulationTable([...simulationTable]);
        setResponse([]);
    }

    const clearFrames = () => {
        setFrames([]);
        currentFrameRef.current = 0;
    };

    return (
        <SimulationContext.Provider value={{
            startSimulation, stopSimulation, response, setResponse,
            simulationTable, setSimulationTable, isSimulationRunning,
            clearAll, importSimulation, exportSimulation, selectedAlgorithm,
            setSelectedAlgorithm, getSimulationParameters, frames, setFrames,
            currentFrameRef, clearFrames, setCurrentFrame, parameters, setParameters
        }}>
            {children}
        </SimulationContext.Provider>
    );
};

export const useSimulation = () => {
    return useContext(SimulationContext);
};