import React, {useContext, useEffect, useRef, useState} from "react";
import { CircularProgress } from "@mui/material";
import { SimulationContext } from "../contexts/SimulationContext.jsx";

export default function VisualLoader({preloadPath, srcPath}) {
    const webviewRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const urlRef = useRef("");

    const { 
        simulationTable, setSimulationTable,
        parameters, setParameters,
        startSimulation, stopSimulation,
        response, importSimulation, exportSimulation,
    } = useContext(SimulationContext);

    useEffect(() => {
        const webview = webviewRef.current;
        if (!webview) return;

        const handleDomReady = async () => {
            console.log("Webview DOM is ready:", webview);
            try {
                const url = await window.electron.getServerURL();
                urlRef.current = url;

                const trueUrl = url + "plugin.js"; 
                webview.openDevTools();

                webview.contentWindow.postMessage({ action: 'LOAD_VISUAL', payload: { url: trueUrl } }, '*');
                setIsLoading(false);
                webview.contentWindow.postMessage({ action: 'PARAMETERS', data: { parameters: parameters } }, '*');
            } catch (err) {
                console.error("Failed to get server URL:", err);
                setIsLoading(false);
            }
        };

        webview.addEventListener('dom-ready', handleDomReady);

        // Setup all event listeners to handle messages from the webview
        webview.addEventListener('ipc-message', (event) => {
            console.log("IPC message received from webview:", event.channel, event.args);
            const msg = event.args[0];
            const data = event.args[0].data;
            console.log("Message received from webview:", msg);
            if (msg.action === 'UPDATE_TABLE') {
                setSimulationTable(msg.payload.table);
                console.log("Table updated from webview:", msg.payload.table);
            }

            // Launch the simulation with parameters from webview
            if (msg.action === 'PLAY_SIMULATION') {
                const parameters = data.parameters;
                const table = data.table;
                console.log("Play simulation requested with parameters:", msg);
                setSimulationTable(table);
                setParameters(parameters);
                startSimulation(table, parameters);
            }

            if (msg.action === 'PAUSE_SIMULATION') {
                stopSimulation();
                console.log("Pause simulation requested");
            }

            if (msg.action === 'EXPORT') {
                const table = data.table;
                const parameters = data.parameters;

                exportSimulation(table, parameters);
            }

            if (msg.action === 'IMPORT') {}
        });

        return () => {
            if (webview) {
                webview.removeEventListener('dom-ready', handleDomReady);
                webview.removeEventListener('ipc-message', () => {});
            }
        };
    }, []);

    useEffect(() => {
        // Send table to the webview when simulationTable changes
        const webview = webviewRef.current;
        if (webview) {
            webview.contentWindow.postMessage({ action: 'UPDATE_TABLE', data: { table: response } }, '*');
        }
        // setSimulationTable([1]);
    }, [response]);

    return (
        <div className="w-full h-full relative">
            {
                isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <CircularProgress />
                </div>
            )}
            <webview
                className="w-full h-full p-0 m-0"
                ref={webviewRef}
                src={srcPath}
                preload={preloadPath}
                nodeintegration="false"
            />
        </div>
    );
}