import React, { useEffect, useState, useContext } from "react";
import gol from "../../../assets/images/gol2.gif";
import { APIContext } from "../../contexts/APIContext.jsx";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function TryVisual() {
    const { getAlgorithms } = useContext(APIContext);
    const [algorithms, setAlgorithms] = useState([]);
    const [search, setSearch] = useState("");
    const [searchedAlgorithm, setSearchedAlgorithm] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
    const [selectedVisual, setSelectedVisual] = useState(null);
    const [visualName, setVisualName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlgorithms = async () => {
            try {
                const algos = await getAlgorithms();
                setAlgorithms(algos);
                setSearchedAlgorithm(algos);
            } catch (error) {
                console.error("Error fetching algorithms:", error);
            }
        };

        fetchAlgorithms();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [search]);

    const handleSearch = () => {
        if (search.trim() === "") {
            setSearchedAlgorithm(algorithms);
        } else {
            const filtered = algorithms.filter((algorithm) =>
                algorithm.name.toLowerCase().includes(search.toLowerCase())
            );
            setSearchedAlgorithm(filtered);
        }
    }

    const onClickVisualSelect = async () => {
        try {
            const filePath = await window.electron.openDialog('js');
            const fileData = await window.electron.loadTextFile(filePath);
            setSelectedVisual(fileData);
            const path = filePath.replace(/\\/g, '/');
            setVisualName(path.split('/').pop());
            toast.success("Visual file loaded successfully");
        } catch (error) {
            toast.error("Failed to load visual file");
        }
    };

    const onClickReset = () => {
        setSelectedAlgorithm(null);
        setSelectedVisual(null);
        setVisualName("");
    };

    const onClickStart = async () => {
        // Must install the visual in a temporary way and wait for the installation to be done
        if (!await verifyAFields()) {
            return;
        }
        toast.info("Processing visual...");
        let path = await window.electron.installTryVisual(selectedVisual);
        path = path.replace(/\\/g, '/').split('/').pop();
        const serverUrl = await window.electron.getServerURL();
        const tryVisualUrl = serverUrl + path;
        console.log("Opening visual at URL:", tryVisualUrl);
        navigate("/Playground", { 
            state: { 
                algorithm: selectedAlgorithm, 
                visual: selectedVisual,
                isTry: true,
            } 
        });
    }

    const verifyAFields = async () => {
        let flag = true;
        if (!selectedAlgorithm) {
            toast.error("Please select an algorithm");
            flag = false;
        }
        if (!selectedVisual) {
            toast.error("Please select a visual");
            flag = false;
        }
        console.log("Selected algorithm for installation check:", selectedAlgorithm);
        const isInstalled = await window.electron.isAlgorithmInstalled([selectedAlgorithm.automaton_id]);
        console.log("Is algorithm installed:", isInstalled);
        if (selectedAlgorithm && isInstalled === false) {
            toast.error("Selected algorithm is not installed. Please install it first.");
            flag = false;
        }
        return flag;
    }

    return (
        <div id="submission-content" className="w-full h-full flex flex-col items-center justify-center p-4 bg-midnight font-mono relative text-white">
            <div className="absolute top-0 left-0 w-full h-full bg-midnight-opacity">
                <img src={gol} alt="Background" className="object-cover w-full h-full blur-sm opacity-40"/>
            </div>
                
            <div className="flex flex-col items-center w-3/5 relative shadow-lg rounded-lg bg-midnight shadow-midnight-purple-shadow p-6 overflow-x-hidden">
                <div className="flex flex-col items-center justify-center h-1/5 w-full my-5">
                    <h1 className="text-white text-4xl">Try your visual</h1>
                </div>
                <p className="text-white/70 text-lg">Here you can try your visual before submitting it to CAMI's community. Simply provide the necessary details and test it out!</p>

                {/* Selection container */}
                <div className="w-full">
                    <div className="w-full">
                        <label htmlFor="algorithm-select" className="block mt-4 mb-2 text-white text-lg">Select Algorithm:</label>
                        <button
                            id="algorithm-select"
                            className="w-full p-3 bg-midnight-purple text-white rounded-lg hover:bg-midnight-purple-dark transition-colors"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            {selectedAlgorithm ? selectedAlgorithm.name : "Select an Algorithm"}
                        </button>
                    </div>

                    <div>
                        <label htmlFor="visual-select" className="block mt-4 mb-2 text-white text-lg">User visual:</label>
                        <button
                            id="visual-select"
                            className="w-full p-3 bg-midnight-purple text-white rounded-lg hover:bg-midnight-purple-dark transition-colors"
                            onClick={() => onClickVisualSelect()}
                        >
                            {visualName ? visualName : "Select the visual you want to test"}
                        </button>
                    </div>
                </div>

                <div id="button-group" className="flex w-full justify-between mt-4">
                    <button
                        className="px-4 py-2 w-1/2 bg-midnight-purple text-white rounded-lg hover:bg-midnight-purple-dark transition-colors"
                        onClick={() => onClickStart()}
                    >
                        Start
                    </button>
                    <button
                        className="px-4 w-1/2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors ml-4"
                        onClick={() => onClickReset()}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* MODAL FOR ALGORITHM SELECTION */}
            <Dialog 
                open={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)}
                maxWidth="lg"
                slotProps={{ 
                    paper: { 
                        className: "!rounded-lg !text-white !bg-midnight"
                    }
                }}
            >
                <DialogTitle>Select an Algorithm</DialogTitle>
                <DialogContent className="flex flex-col">
                    <div className="flex flex-col flex-1 w-full my-4 sticky top-0 z-20 bg-midnight">
                        <input
                            type="text"
                            placeholder="Search algorithms..."
                            className="p-2 w-full border border-gray-300 rounded bg-midnight text-white"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                            }}
                        >
                        </input>
                        <div className="w-full h-4 bg-midnight"></div>
                    </div>

                    <div className="flex flex-row mt-2 flex-wrap gap-4 justify-center items-center">
                        {
                            searchedAlgorithm.map((algorithm) =>
                                {
                                    return (
                                        <button className={`
                                            relative size-52 bg-white rounded-lg overflow-hidden
                                            ${algorithm.selected ? "ring-4 ring-midnight-purple" : ""}
                                            `} key={algorithm.automaton_id}
                                            onClick={() => {
                                                setSelectedAlgorithm(algorithm);
                                                setIsDialogOpen(false);
                                            }}
                                            type="button"
                                        >
                                            <img 
                                                src={`data:image/png;base64,${algorithm.image[0].contents_binary}`} 
                                                alt={algorithm.name} className="absolute top-0 w-full h-full object-cover"
                                            />
                                            <div className="absolute flex w-full bottom-2 justify-center">
                                                <div className="flex justify-center mx-3 p-2 rounded-lg w-full backdrop-blur-md bg-midnight/30">
                                                    {algorithm.name}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                }
                            )
                        }
                    </div>
                </DialogContent>
                <DialogActions>
                    <button
                        className="px-4 py-2 bg-midnight-purple text-white rounded-lg hover:bg-midnight-purple-dark transition-colors"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Close
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}