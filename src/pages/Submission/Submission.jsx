import React, { useState } from "react";
import gol from "../../../assets/images/gol2.gif";
import { toast } from "react-toastify";

function Submission() {
    const [form, setForm] = useState({
        name: "",
        description: "",
        image: null,
        file: null,
    });
    const [filePaths, setFilePaths] = useState({
        automaton: "",
        image: ""
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.description || !form.file) {
            toast.error("Please fill in all fields and select a file.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            return;
        }
        alert(`Name: ${form.name}\nDescription: ${form.description}\nFile: ${form.file ? form.file.name : "No file selected"}`);
        // Send to the API
    };

    const handleRemoveFile = () => {
        setForm((prev) => ({
            ...prev,
            file: null,
        }));
    }

    const handleImportFile = async () => {
        const filePath = await window.electron.openDialog("node");
        if (!filePath || filePath == null) return;
        setFilePaths((prev) => ({
            ...prev,
            automaton: filePath,
        }));
        const file = await window.electron.loadFile(filePath);
        setForm((prev) => ({
            ...prev,
            file: file,
        }));
    }

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
        console.log(image);
        setForm((prev) => ({
            ...prev,
            image: URL.createObjectURL(image), // Convert Blob to URL
        }));
    }

    const handleReset = () => {
        setForm({
            name: "",
            description: "",
            image: null,
            file: null,
        });
        setFilePaths({
            automaton: "",
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
                            Content:
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
                                    <img src={form.image} alt="Imported" className="h-full max-h-48 object-fill" />
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

                    <div>
                        <label className="w-full justify-center flex flex-col items-center">
                            <span className="w-full text-left">Automaton:</span>
                        </label>

                        <h2 className="text-yellow-200 text-center text-xl mb-5">! Automaton must have .node extension !</h2>
                        {
                            !form.file ?
                                <button
                                    type="button"
                                    onClick={handleImportFile}
                                    className="bg-midnight-purple text-white w-full py-2 px-4 rounded hover:bg-midnight-purple-dark"
                                >
                                    Import file
                                </button>
                            :
                            <div className="flex flex-row w-full justify-between items-center my-2 p-2 h-16 bg-midnight-opacity rounded">
                                <p>
                                    <span className="text-sm text-center max-w-xs overflow-hidden text-ellipsis">
                                        {filePaths.automaton.split("\\").pop()}
                                    </span>
                                </p>
                                <button onClick={handleRemoveFile} type="button" className="hover:bg-red-500 rounded w-1/12 h-full">X</button>
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