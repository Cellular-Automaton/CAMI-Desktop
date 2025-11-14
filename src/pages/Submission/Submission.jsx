import React, { useContext, useEffect, useState } from "react";
import gol from "../../../assets/images/gol2.gif";
import { toast } from "react-toastify";
import { APIContext } from "../../contexts/APIContext.jsx";
import { Select, Box, MenuItem, Chip, Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Submission() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        image: null,
        link: "",
        content: "",
        tags: []
    });

    const [filePaths, setFilePaths] = useState({
        image: ""
    });

    const { addAlgorithm } = useContext(APIContext);
    const [tags, setTags] = useState([]);
    const { getTags, setAlgorithmTags } = useContext(APIContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch tags from the API
        getTags().then((fetchedTags) => {
            setTags(fetchedTags);
            
        }).catch((error) => {
            console.error("Error fetching tags:", error)
            toast.error("Error fetching tags. Please try again later.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            navigate("/Home");
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const openExternalLink = (url) => {
        window.electron.openExternal(url);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        

        // Check link validity
        try {
            const url = form.link;
            if (!url.includes("api.github.com")) {
                throw new Error("Invalid hostname.");
            }
            axios.get(url, {
                auth: {}
            }).then((response) => {
                if (response.status !== 200 && response.status !== 201 && response.status !== 304) {
                    throw new Error("GitHub API link is not reachable.");
                }
            }).catch((error) => {
                return error;
            });
        } catch (error) {
            toast.error(error.message + " Please provide a valid GitHub API link.", {
                position: "top-right",
                autoClose: 5000,
            });
            return;
        }

        // Send to the API
        addAlgorithm(form).then((response) => {
            
            setAlgorithmTags(response.data.automaton_id, form.tags);
            navigate("/Home");
        }).catch((error) => {
            console.error("Error adding algorithm:", error);
        });
    };

    const handleImportImage = async () => {
        const imagePath = await window.electron.openDialog("png jpg jpeg");
        if (!imagePath || imagePath == null) return;

        var image = null;
        setFilePaths((prev) => ({
            ...prev,
            image: imagePath,
        }));
        image = await window.electron.loadFile(imagePath);
        image = new Blob([image]);
        
        setForm((prev) => ({
            ...prev,
            image: image, // Convert Blob to URL
        }));
    }

    const handleReset = () => {
        setForm({
            name: "",
            description: "",
            image: null,
            tags: [],
            content: "",
            link: ""
        });
        setFilePaths({
            image: ""
        });
    };

    return (
        <div id="submission-content" className="w-full h-full flex flex-col items-center justify-center p-4 bg-midnight font-mono relative text-white">
            <div className="absolute top-0 left-0 w-full h-full bg-midnight-opacity">
                <img src={gol} alt="Background" className="object-cover w-full h-full blur-sm opacity-40"/>
            </div>
        
            <div className="flex flex-col items-center w-3/5 relative shadow-lg rounded-lg bg-midnight shadow-midnight-purple-shadow p-6 overflow-y-scroll overflow-x-hidden">
                <div className="flex items-center justify-center h-1/5 w-full my-5">
                    <h1 className="text-white text-4xl">Add a new cellular automaton</h1>
                </div>

                <form 
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-4 mx-20"
                >
                    <div>
                        <label>
                            Name:
                            <input
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded bg-midnight text-white"
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Tags:
                            {/* A list of tag that can be clicked and then be add in form.tags */}
                            <Select
                                multiple
                                value={form.tags}
                                onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
                                sx={{ width: "100%", border: "1px solid #FFFFFF", color: "white" }}
                                renderValue={(selected) => (
                                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, padding: "2px", borderRadius: "4px" }}>
                                        {
                                            selected.map((tag) => {
                                                
                                                
                                                return (
                                                    <Tooltip title={tag.description} key={tag.id} arrow 
                                                        sx={{ fontFamily: "'JetBrains Mono', monospace" }}
                                                    >
                                                        <Chip
                                                            key={tag.id}
                                                            label={tag.name} size="small" variant="filled"
                                                            sx={{backgroundColor: "#7F6EEE", color: "white", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold"}}
                                                        />
                                                    </Tooltip>

                                                )
                                            })
                                        }
                                    </Box>
                                )}
                            >
                                {
                                    tags.map((tag) =>
                                        {
                                            
                                            return (
                                                <MenuItem
                                                    key={tag.id}
                                                    value={tag}
                                                    sx={{ fontFamily: "'JetBrains Mono', monospace" }}
                                                >
                                                {tag.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </Select>
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
                                style={{ resize: "none" }}
                                className="w-full h-48 p-2 border border-gray-300 rounded bg-midnight text-white"
                            />
                        </label>
                    </div>

                    <div>
                        <label>
                            Parameters:
                            <textarea
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                                required
                                style={{ resize: "none" }}
                                className="w-full h-48 p-2 border border-gray-300 rounded bg-midnight text-white"
                            />
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="justify-center flex flex-col items-center">
                            <span className="w-full text-left">Github link to release:</span>
                            <span className="text-xs opacity-70 w-full text-left">(e.g., 
                                <a 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        openExternalLink("https://docs.github.com/fr/rest/releases/releases?apiVersion=2022-11-28#get-the-latest-release");
                                    }}
                                    className="text-midnight-purple" href="https://docs.github.com/fr/rest/releases/releases?apiVersion=2022-11-28#get-the-latest-release">
                                    https://api.github.com/repos/[owner]/[repo]/releases/latest
                                </a>)
                            </span>
                            <input
                                name="link"
                                type="text"
                                value={form.link}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded bg-midnight text-white"
                            />
                        </label>
                    </div>

                    <div>
                        <label className="justify-center flex flex-col items-center">
                            <span className="w-full text-left">Image:</span>
                        </label>

                        {
                            !form.image ?   
                            <button
                                type="button"
                                className="bg-midnight-purple text-white w-full py-2 px-4 rounded hover:bg-midnight-purple-dark"
                                onClick={handleImportImage}
                            >
                                Import image
                            </button>
                            :
                            <div className="flex flex-row justify-between items-center my-2 p-2 w-full h-24 bg-midnight-opacity rounded">
                                <div className="h-full flex flex-row items-center justify-center gap-5">
                                    <img src={URL.createObjectURL(new Blob([form.image]))} alt="Imported" className="h-full max-h-48 object-fill" />
                                    <p className="text-sm text-center max-w-xs overflow-hidden text-ellipsis">
                                        {filePaths.image.split("\\").pop()}
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

                    <div className="flex items-center justify-between mt-4 gap-5">
                        <button type="submit" className="bg-midnight-purple text-white py-2 px-4 rounded hover:bg-midnight-purple-dark w-full">Submit</button>
                        <button onClick={handleReset} type="button" className="bg-red-400 text-white py-2 px-4 rounded hover:bg-red-500 w-full">Reset</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Submission;