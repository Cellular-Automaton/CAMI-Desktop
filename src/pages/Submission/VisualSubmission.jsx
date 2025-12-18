import React, { useEffect, useState, useContext } from "react";
import gol from "../../../assets/images/gol2.gif";
import { APIContext } from "../../contexts/APIContext.jsx";
import { Dialog, DialogActions, DialogContent, DialogTitle, Chip } from "@mui/material";

export default function VisualSubmission() {
    const { getAlgorithms } = useContext(APIContext);
    const [form, setForm] = useState({
        name: "",
        description: "",
        link: "",
        image: null
    });
    const [imagePath, setImagePath] = useState("");
    const [isAlgorithmDialogOpen, setIsAlgorithmDialogOpen] = useState(false);
    const [algorithms, setAlgorithms] = useState([]);
    const [searchedAlgorithm, setSearchedAlgorithm] = useState([]);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const getAllAlgorithms = async () => {
            let algorithms = await getAlgorithms();
            algorithms = algorithms.map((prev) => {
                return {...prev, selected: false}
            })

            setAlgorithms(algorithms);
            setSearchedAlgorithm(algorithms);
        }
        getAllAlgorithms();
    }, []);

    useEffect(() => {
        if (search === "") {
            setSearchedAlgorithm(algorithms);
            return;
        }

        setSearchedAlgorithm(
            algorithms.filter((algorithm) =>
                algorithm.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleImportImage = async () => {
        const imagePath = await window.electron.openDialog("png jpg jpeg");
        if (!imagePath || imagePath == null) return;

        var image = null;
        setImagePath(imagePath);
        image = await window.electron.loadFile(imagePath);
        image = new Blob([image]);
        
        setForm((prev) => ({
            ...prev,
            image: image, // Convert Blob to URL
        }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let toSendForm = { ...form };

        toSendForm.related_algorithms = selectedAlgorithm.map((alg) => alg.automaton_id);
        console.log(toSendForm);
    }

    return (
        <div className="w-full h-full flex flex-col items-center px-6 bg-background font-mono text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-backgroundAlt">
                <img src={gol} alt="Background" className="object-cover w-full h-full blur-sm opacity-30" />
            </div>

            <div className="z-10 h-full w-3/5 justify-center bg-background px-8 flex flex-col gap-6 items-center">

                <form
                    onSubmit={handleSubmit}
                    className="w-full h-full flex flex-col gap-4 justify-center"
                >
                    <h1 className="text-text text-4xl mb-10">Add a new visualization</h1>
                    <div className="flex flex-col gap-4">
                        <div>
                            <label>
                                Name:
                                <input
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded bg-backgroundAlt text-text"
                                />
                            </label>
                        </div>

                        <div>
                            <label>
                                Description:
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded bg-backgroundAlt text-text"
                                />
                            </label>
                        </div>

                        <div >
                            <label className="w-full">
                                Related algorithms:
                            </label>
                            <div className="flex flex-row justify-between items-center gap-4 min-h-10">
                                <div className="
                                    w-full h-full min-h-10 flex flex-row flex-wrap gap-2 border items-center 
                                    border-gray-300 rounded bg-backgroundAlt text-text
                                    px-3
                                ">
                                    {
                                        selectedAlgorithm.map((algorithm) => (
                                            <Chip
                                                size="small"
                                                key={algorithm.automaton_id}
                                                label={algorithm.name}
                                                className="m-1 !bg-primary !text-textPrimary"
                                                onDelete={() => {
                                                    setSelectedAlgorithm((prev) => prev.filter((a) => a.automaton_id !== algorithm.automaton_id));
                                                }}
                                            />
                                        ))
                                    }
                                </div>
                                <button type="button" className="w-1/4 h-full min-h-10 bg-primary rounded hover:bg-secondary text-textPrimary"
                                    onClick={(e) => setIsAlgorithmDialogOpen(true)}
                                >
                                    Add
                                </button>
                            </div>
                        </div>

                        <div>
                            <label>
                                <span className="w-full text-left">Github link to release:</span>
                                <span className="text-xs opacity-70 w-full text-left">(e.g., 
                                    <a 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            openExternalLink("https://docs.github.com/fr/rest/releases/releases?apiVersion=2022-11-28#get-the-latest-release");
                                        }}
                                        className="text-primary" href="https://docs.github.com/fr/rest/releases/releases?apiVersion=2022-11-28#get-the-latest-release">
                                        https://api.github.com/repos/[owner]/[repo]/releases/latest
                                    </a>)
                                </span>
                                <input
                                    name="link"
                                    type="url"
                                    value={form.link}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-2 border border-gray-300 rounded bg-backgroundAlt text-text"
                                />
                            </label>
                        </div>

                        <div>
                            <label className="justify-center flex flex-col items-center">
                                <span className="w-full text-left">Image:</span>
                            </label>

                            {
                                !form.image ?
                                <div className="flex flex-col justify-center items-center py-2 my-2 h-24">
                                    <button
                                        type="button"
                                        className="bg-primary text-textPrimary w-full py-2 px-4 rounded hover:bg-secondary"
                                        onClick={handleImportImage}
                                    >
                                        Import image
                                    </button>
                                </div> 
                                :
                                <div className="flex flex-row justify-between items-center my-2 p-2 w-full h-24 bg-backgroundAlt rounded">
                                    <div className="h-full flex flex-row items-center justify-center gap-5">
                                        <img src={URL.createObjectURL(new Blob([form.image]))} alt="Imported" className="h-full max-h-48 object-fill" />
                                        <p className="text-sm text-center max-w-xs overflow-hidden text-ellipsis">
                                            {imagePath.split("\\").pop()}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setForm((prev) => ({ ...prev, image: null }))}
                                        className="hover:bg-red-500 rounded w-1/12 h-full"
                                    >
                                        X
                                    </button>
                                </div>
                            }
                        </div>
                    </div>
                    
                    <div className="flex w-full items-center justify-between mt-4 gap-5">
                        <button type="submit" className="bg-primary text-textPrimary py-2 px-4 rounded hover:bg-secondary w-full">Submit</button>
                        <button type="button" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 w-full">Reset</button>
                    </div>
                </form>

                {/* MODAL FOR ALGORITHM SELECTION */}
                <Dialog 
                    open={isAlgorithmDialogOpen} 
                    onClose={() => setIsAlgorithmDialogOpen(false)}
                    maxWidth="lg"
                    slotProps={{ 
                        paper: { 
                            className: "!rounded-lg !text-text !bg-backgroundAlt"
                        }
                    }}
                >
                    <DialogTitle>Select an Algorithm</DialogTitle>
                    <DialogContent className="flex flex-col">
                        <div className="flex flex-col flex-1 w-full my-4 sticky top-0 z-20 bg-backgroundAlt">
                            <input
                                type="text"
                                placeholder="Search algorithms..."
                                className="p-2 w-full border border-gray-300 rounded bg-backgroundAlt text-text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                            >
                            </input>
                            <div className="w-full h-4 bg-backgroundAlt"></div>
                        </div>

                        <div className="flex flex-row mt-2 flex-wrap gap-4 justify-center items-center">
                            {
                                searchedAlgorithm.map((algorithm) =>
                                    {
                                        return (
                                            <button className={`
                                                relative size-52 bg-background rounded-lg overflow-hidden
                                                hover:scale-105 focus-visible:scale-105 transition-all duration-200
                                                ${algorithm.selected ? "ring-4 ring-midnight-purple" : ""}
                                                `} key={algorithm.automaton_id}
                                                onClick={() => {
                                                    if (selectedAlgorithm.find((a) => a.automaton_id === algorithm.automaton_id)) {
                                                        algorithm.selected = false;
                                                        setSelectedAlgorithm((prev) => prev.filter((a) => a.automaton_id !== algorithm.automaton_id));
                                                        return;
                                                    }
                                                    algorithm.selected = true;
                                                    setSelectedAlgorithm((prev) => [...prev, algorithm]);
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
                            onClick={() => setIsAlgorithmDialogOpen(false)}
                        >
                            Close
                        </button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}
