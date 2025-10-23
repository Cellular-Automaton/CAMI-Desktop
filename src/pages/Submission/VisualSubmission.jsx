import React, { useEffect, useState, useContext } from "react";
import gol from "../../../assets/images/gol2.gif";
import { APIContext } from "../../contexts/APIContext.jsx";

export default function VisualSubmission() {
    const { getAlgorithms } = useContext(APIContext);
    const [form, setForm] = useState({
        name: "",
        description: "",
        link: "",
        image: null
    });
    const [imagePath, setImagePath] = useState("");
    const [algorithms, setAlgorithms] = useState([]);

    useEffect(() => {
        const getAllAlgorithms = async () => {
            const algorithms = await getAlgorithms();
            console.log(algorithms);
        }
        getAllAlgorithms();
    }, []);

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
        // Handle form submission logic here
    }
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-midnight font-mono text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-midnight-opacity">
                <img src={gol} alt="Background" className="object-cover w-full h-full blur-sm opacity-30" />
            </div>

            <div className="z-10 w-3/5 bg-midnight shadow-lg shadow-midnight-purple-shadow rounded-lg p-8 flex flex-col gap-6 items-center">
                <div className="flex items-center justify-center h-1/5 w-full my-5">
                    <h1 className="text-white text-4xl">Add a new visualization</h1>
                </div>
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-4"
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
                            Description:
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-gray-300 rounded bg-midnight text-white"
                            />
                        </label>
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
                                    className="text-midnight-purple" href="https://docs.github.com/fr/rest/releases/releases?apiVersion=2022-11-28#get-the-latest-release">
                                    https://api.github.com/repos/[owner]/[repo]/releases/latest
                                </a>)
                            </span>
                            <input
                                name="link"
                                type="url"
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
                </form>
            </div>
        </div>
    );
}
