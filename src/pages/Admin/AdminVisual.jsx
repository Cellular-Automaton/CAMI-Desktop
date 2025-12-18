import React, {useState, useEffect, useContext} from "react";
import { Card, CardActionArea, CardContent, Dialog, Divider, TextField, Tooltip, CardMedia } from "@mui/material";
import { formatDistance } from "date-fns";

import { APIContext } from "../../contexts/APIContext.jsx";

export default function AdminVisual({ closeCallback }) {
    const [visual, setVisual] = useState([]);
    const [selectedVisual, setSelectedVisual] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredVisuals, setFilteredVisuals] = useState([]);
    const [visualName, setVisualName] = useState("");
    const [isValidationOpen, setIsValidationOpen] = useState(false);

    const { getAllVisuals, getVisualById, getUserById, deleteVisual } = useContext(APIContext);

    const getVisuals = () => {

        getAllVisuals().then(fetchedVisuals => {
            setVisual(fetchedVisuals);
            setFilteredVisuals(fetchedVisuals);
            
        }).catch(err => {
            console.error("Failed to fetch visuals:", err);
        });
    }

    const getAlgorithmName = (algId) => {
        getAlgorithmById(algId).then(alg => {
            
            if (alg !== undefined) {
                setAlgorithmName(alg.data.name);
            }
        });
    }

    useEffect(() => {
        getVisuals();
    }, []);

    useEffect(() => {
        setFilteredVisuals(visual.filter(visual => visual.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, visual]);

    const getDetails = (userId, algId) => {
        getUserName(userId);
        getAlgorithmName(algId);
    }

    const handleDeleteVisual = (visualId) => {
        // deleteVisual(visualId).then(() => {
        //     setVisual(visual.filter(visual => visual.id !== visualId));
        //     setFilteredVisuals(filteredVisuals.filter(visual => visual.id !== visualId));
        //     setSelectedVisual(null);
        //     setIsValidationOpen(false);
        // }).catch(err => {
        //     console.error("Failed to delete visual:", err);
        // });
        // Todo: Delete visual from API
    }

    return (
        <div className="bg-background w-full h-full pt-10 px-10 flex flex-col">
            <div className="px-5">
                <h2 className="text-2xl font-bold text-text mb-4">Algorithm Management</h2>
                <p className="text-text">Here you can manage the algorithms used in the application.</p>
            </div>
            <Divider sx={{ my: 2, backgroundColor: 'var(--color-text-alt)', height: '1px' }} flexItem />

             <div className="w-full flex flex-row justify-center">
                <TextField label="Search Algorithm" variant="outlined" className="!w-1/5 !rounded-sm"
                    sx={{ 
                        input: { color: 'var(--color-text)', backgroundColor: 'var(--color-background-alt)' },
                        label: { color: 'var(--color-text-alt)' },
                        fieldset: { borderColor: 'var(--color-text-alt)' }
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-row flex-wrap mt-5 overflow-y-auto h-full w-full px-5 gap-5 items-center justify-center">

                {
                    filteredVisuals.length === 0 ? (
                        <p className="text-text">No visual found.</p>
                    ) : (
                    filteredVisuals.map((vis) => (
                        <Card key={vis.automaton_id} className="
                            !bg-backgroundAlt !text-text !h-fit !w-1/3 overflow-y-hidden text-ellipsis
                            hover:scale-105 hover:ring-4 hover:ring-primary !transition-all duration-200
                            focus-within:scale-105 focus-within:ring-4 focus-within:ring-primary
                        ">
                            <CardActionArea className="!h-fit" onClick={() => setSelectedVisual(vis)}>
                                <CardContent className="!h-fit w-full">
                                    <div className="h-max flex flex-col overflow-hidden text-ellipsis">
                                        <h3 className="text-lg font-bold mb-2">{vis.name}</h3>
                                        <p className="text-sm text-ellipsis overflow-y-hidden truncate opacity-70">{vis.description}</p>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )))
                }
            </div>

            <Dialog open={selectedVisual !== null} onClose={() => setSelectedVisual(null)} maxWidth="lg" fullWidth>
                <div className="bg-background p-5 flex flex-col text-text font-mono">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">{selectedVisual?.name}</h3>
                        <p className="text-sm opacity-70">{selectedVisual?.description}</p>
                        <a href="https://github.com" onClick={
                            (e) => {
                                e.preventDefault(); 
                                openExternal("https://github.com");
                            }} className="text-blue-400 underline">{selectedVisual?.link}</a>
                    </div>
                    <div className="flex flex-row-reverse gap-5">
                        <Tooltip title="Deleting an algorithm will remove it from the system." arrow>
                            <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                                onClick={() => setIsValidationOpen(true)}>
                                Delete
                            </button>
                        </Tooltip>
                        <Tooltip title="Accepting an algorithm will add it to the system." arrow>
                            <button className="mt-5 p-2 bg-midnight-green text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                                onClick={() => setSelectedVisual(null)}>
                                Accept
                            </button>
                        </Tooltip>
                        <Tooltip title="Rejecting an algorithm will keep it in the system but users can't see it." arrow>
                            <button className="mt-5 p-2 bg-midnight-blue text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                                onClick={() => setSelectedVisual(null)}>
                                Reject
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </Dialog>

            <Dialog open={isValidationOpen} onClose={() => setIsValidationOpen(false)} className="flex flex-col p-5">
                <div className="bg-background p-5 flex flex-col text-text font-mono">
                    <h2 className="text-lg font-bold pb-5">Are you sure to delete this algorithm?</h2>
                    <div className="flex flex-row-reverse gap-5 mt-5">
                        <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                            onClick={() => handleDeleteVisual(selectedVisual?.automaton_id)}>
                            Yes
                        </button>
                        <button className="mt-5 p-2 bg-primary text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                            onClick={() => setIsValidationOpen(false)}>
                            No
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
