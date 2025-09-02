import React, {useState, useEffect} from "react";
import { CardMedia, Divider, TextField, Card, CardActionArea, CardContent, Dialog, Avatar } from "@mui/material";

export default function AdminAlgorithm({ closeCallback }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [algorithm, setAlgorithm] = useState([]);
    const [filteredAlgorithms, setFilteredAlgorithms] = useState([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);

    useEffect(() => {
        setFilteredAlgorithms(algorithm.filter(alg => alg.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, algorithm]);

    const getAllAlgorithms = () => {
        // Fetch all algorithms from the backend (not implemented)
        // Temporarily give fake data
        for (let i = 0; i < 30; i++) {
            setAlgorithm(prevAlgorithms => [...prevAlgorithms, { id: i, image: "https://citygem.app/wp-content/uploads/2024/08/placeholder-1-1.png", name: `Algorithm ${i + 1}`, description: `Description for Algorithm ${i + 1}`, link: `https://github.com` }]);
        }
    }

    const openExternal = (url) => {
        window.electron.openExternal(url);
    }

    useEffect(() => {
        getAllAlgorithms();
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
                    filteredAlgorithms.map((alg) => (
                        <Card key={alg.id} className="!bg-midnight-opacity !text-white !h-1/3 !w-1/3">
                            <CardActionArea onClick={() => setSelectedAlgorithm(alg)}>
                                <CardMedia sx={{height: 140}} image={alg.image} title={alg.name} />
                                <CardContent>
                                    <div className="h-full w-full flex flex-col">
                                        <h3 className="text-lg font-bold mb-2">{alg.name}</h3>
                                        <p>Description: {alg.description}</p>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))
                }
            </div>

            <Dialog open={selectedAlgorithm !== null} onClose={() => setSelectedAlgorithm(null)} maxWidth="lg" fullWidth>
                <div className="w-full h-2/3">
                    <img src={selectedAlgorithm?.image} alt={selectedAlgorithm?.name} className="w-full h-48 object-cover" />
                </div>
                <div className="bg-midnight p-5 flex flex-col text-white font-mono">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">{selectedAlgorithm?.name}</h3>
                        <p className="mb-5">{selectedAlgorithm?.description}</p>
                        <a href="https://github.com" onClick={
                            (e) => {
                                e.preventDefault(); 
                                openExternal("https://github.com");
                            }} className="text-blue-400 underline">{selectedAlgorithm?.link}</a>
                    </div>
                    <div className="flex flex-row-reverse gap-5">
                        {/* More user details and management options would go here */}
                        <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                            onClick={() => setSelectedAlgorithm(null)}>
                            Delete
                        </button>
                        <button className="mt-5 p-2 bg-green-500 text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                            onClick={() => setSelectedAlgorithm(null)}>
                            Accept
                        </button>
                        <button className="mt-5 p-2 bg-blue-500 text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                            onClick={() => setSelectedAlgorithm(null)}>
                            Reject
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
