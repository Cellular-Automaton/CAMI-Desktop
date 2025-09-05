import React, {useState, useEffect, useContext} from "react";
import { CardMedia, Divider, TextField, Card, CardActionArea, CardContent, Dialog, Avatar, Tooltip } from "@mui/material";

import { APIContext } from "../../contexts/APIContext.jsx";
import { set } from "date-fns";

export default function AdminAlgorithm({ closeCallback }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [algorithms, setAlgorithms] = useState([]);
    const [filteredAlgorithms, setFilteredAlgorithms] = useState([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
    const [isValidationOpen, setIsValidationOpen] = useState(false);

    const { getAllAlgorithms, deleteAlgorithm } = useContext(APIContext);

    useEffect(() => {
        setFilteredAlgorithms(algorithms.filter(alg => alg.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, algorithms]);

    const getAlgorithms = () => {
        // Fetch all algorithms from the backend (not implemented)

        getAllAlgorithms().then(fetchedAlgorithms => {
            setAlgorithms(fetchedAlgorithms);
            setFilteredAlgorithms(fetchedAlgorithms);
        }).catch(err => {
            console.error("Failed to fetch algorithms:", err);
        });
    }

    const openExternal = (url) => {
        window.electron.openExternal(url);        // Temporarily give fake data
    }

    const handleDeleteAlgorithm = (algId) => {
        deleteAlgorithm(algId).then(() => {
            setAlgorithms(algorithms.filter(alg => alg.automaton_id !== algId));
            setFilteredAlgorithms(filteredAlgorithms.filter(alg => alg.automaton_id !== algId));
            setSelectedAlgorithm(null);
            setIsValidationOpen(false);
        }).catch(err => {
            console.error("Failed to delete algorithm:", err);
        });
    }

    useEffect(() => {
        getAlgorithms();
    }, []);

    return (
        <div className="bg-midnight w-full h-full p-5 flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4">Algorithm Management</h2>
            <p className="text-white">Here you can manage the algorithms used in the application.</p>
            <Divider sx={{ my: 2, backgroundColor: 'white', height: '1px' }} flexItem />

             <div className="w-full flex flex-row justify-center">
                <TextField label="Search Algorithm" variant="outlined" className="!w-1/5 !rounded-sm"
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, fieldset: { borderColor: 'white' } }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-row flex-wrap mt-5 overflow-y-auto h-full w-full px-5 gap-5 items-center justify-center">

                {
                    filteredAlgorithms.length === 0 ? (
                        <p className="text-white">No algorithms found.</p>
                    ) : (
                    filteredAlgorithms.map((alg) => (
                        <Card key={alg.automaton_id} className="!bg-midnight-opacity !text-white !h-1/4 !w-1/3 overflow-y-hidden text-ellipsis">
                            <CardActionArea className="!h-full" onClick={() => setSelectedAlgorithm(alg)}>
                                <CardMedia sx={{ height: 140}} image={alg?.image[0]?.contents_binary ? `data:image/png;base64,${alg.image[0].contents_binary}` : "https://citygem.app/wp-content/uploads/2024/08/placeholder-1-1.png"} title={alg.name} />
                                <CardContent className="!h-full w-full">
                                    <div className="h-max flex flex-col overflow-hidden text-ellipsis">
                                        <h3 className="text-lg font-bold mb-2">{alg.name}</h3>
                                        <p className="text-sm text-ellipsis overflow-y-hidden truncate opacity-70">{alg.description}</p>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )))
                }
            </div>

            <Dialog open={selectedAlgorithm !== null} onClose={() => setSelectedAlgorithm(null)} maxWidth="lg" fullWidth>
                <div className="w-full h-2/3">
                    <img src={selectedAlgorithm?.image[0]?.contents_binary ? `data:image/png;base64,${selectedAlgorithm?.image[0].contents_binary}` : "https://citygem.app/wp-content/uploads/2024/08/placeholder-1-1.png"} alt={selectedAlgorithm?.name} className="w-full h-48 object-cover" />
                </div>
                <div className="bg-midnight p-5 flex flex-col text-white font-mono">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">{selectedAlgorithm?.name}</h3>
                        <p className="text-sm opacity-70">{selectedAlgorithm?.description}</p>
                        <a href="https://github.com" onClick={
                            (e) => {
                                e.preventDefault(); 
                                openExternal("https://github.com");
                            }} className="text-blue-400 underline">{selectedAlgorithm?.link}</a>
                    </div>
                    <div className="flex flex-row-reverse gap-5">
                        {/* More user details and management options would go here */}
                        <Tooltip title="Deleting an algorithm will remove it from the system." arrow>
                            <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                                onClick={() => setIsValidationOpen(true)}>
                                Delete
                            </button>
                        </Tooltip>
                        <Tooltip title="Accepting an algorithm will add it to the system." arrow>
                            <button className="mt-5 p-2 bg-midnight-green text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                                onClick={() => setSelectedAlgorithm(null)}>
                                Accept
                            </button>
                        </Tooltip>
                        <Tooltip title="Rejecting an algorithm will keep it in the system but users can't see it." arrow>
                            <button className="mt-5 p-2 bg-midnight-blue text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                                onClick={() => setSelectedAlgorithm(null)}>
                                Reject
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </Dialog>

            <Dialog open={isValidationOpen} onClose={() => setIsValidationOpen(false)} className="flex flex-col p-5">
                <div className="bg-midnight p-5 flex flex-col text-white font-mono">
                    <h2 className="text-lg font-bold pb-5">Are you sure to delete this algorithm?</h2>
                    <div className="flex flex-row-reverse gap-5 mt-5">
                        <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                            onClick={() => handleDeleteAlgorithm(selectedAlgorithm?.automaton_id)}>
                            Yes
                        </button>
                        <button className="mt-5 p-2 bg-midnight-purple text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                            onClick={() => setIsValidationOpen(false)}>
                            No
                        </button>
                    </div>
                </div>
            </Dialog>

            <div className="w-full flex justify-center">
                <button className="mt-5 p-2 bg-midnight-purple text-white rounded-lg w-32 transition hover:opacity-50 ease-in-out duration-200"
                    onClick={closeCallback}>
                    Close
                </button>
            </div>
        </div>
    );
}
