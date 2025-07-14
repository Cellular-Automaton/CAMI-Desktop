import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";


export const APIContext = createContext();

export const APIProvider = ({ children }) => {
    // const [apiUrl, setApiUrl] = useState("http://back-dev.cami.ovh/api");
    const [apiUrl, setApiUrl] = useState("http://localhost:4000/api");

    const login = async (formData) => {
        const url = `${apiUrl}/login`;

        try {
            const response = await axios.post(url, formData);
            const data = response.data;
            toast.success("Login successful!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            return data;
        } catch (error) {
            toast.error("Login failed. Please try again." + error.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            throw error;
        }
    };

    const signUp = async (formData) => {
        const url = `${apiUrl}/user`;
        try {
            const response = await axios.post(url, formData);
            const data = response.data;
            toast.success("Account created successfully!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            return data;
        } catch (error) {
            if (error.response && error.response.status === 422) {
                toast.error("Username or email already exists. Please try again with different credentials.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark",
                });
            }
            throw error;
        }
    };

    const addAlgorithm = async (algorithmForm) => {
        const url = `${apiUrl}/automaton/image`;
        const formData = new FormData();

        // Champs simples
        formData.append("automaton[name]", algorithmForm.name);
        formData.append("automaton[description]", algorithmForm.description);
        formData.append("automaton[contents]", algorithmForm.content);
        
        // Fichiers binaires
        formData.append("automaton[file][0][contents]", await blobToBase64(algorithmForm.automaton_node));
        formData.append("automaton[file][0][name]", ".node");

        formData.append("automaton[file][1][contents]", await blobToBase64(algorithmForm.automaton_lib));
        formData.append("automaton[file][1][name]", ".lib");

        formData.append("automaton[file][2][contents]", await blobToBase64(algorithmForm.automaton_exp));
        formData.append("automaton[file][2][name]", ".exp");

        // Image (si c'est un blob ou un fichier)
        formData.append("automaton[image][0][contents_binary]", await blobToBase64(algorithmForm.image));
        formData.append("automaton[image][0][contents_type]", algorithmForm.imageType);

        console.log("Form Data:", formData);
        try {
            const response = await axios.post(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const data = response.data;
            toast.success("Algorithm added successfully!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            return data;
        } catch (error) {
            toast.error("Failed to add algorithm. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            throw error;
        }
    }

    const getAlgorithms = async () => {
        const url = `${apiUrl}/automaton`;
        try {
            const response = await axios.get(url);
            const data = response.data.data;
            return data;
        } catch (error) {
            toast.error('Failed to fetch recent algorithms. Please try later.', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            throw error;
        }
    }

    const addAlgorithmComment = async (commentData) => {
        const url = `${apiUrl}/automaton_comment`;

        console.log("Comment Data:", commentData);
        try {
            const response = await axios.post(url, commentData);
            const data = response.data;
            toast.success("Comment added successfully!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            return data;
        } catch (error) {
            toast.error("Failed to add comment. Please try again. : " + error.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            throw error;
        }
    };

    const getAlgorithmComments = async (algorithmId) => {
        const url = `${apiUrl}/automaton_comment/automaton/${algorithmId}`;
        try {
            const response = await axios.get(url);
            const data = response.data.data;
            return data;
        } catch (error) {
            throw error;
        }
    };

    const getTags = async () => {
        const url = `${apiUrl}/tag`;

        try {
            const response = await axios.get(url);
            const data = response.data.data;
            return data;
        } catch (error) { 
            throw error;
        }
    };

    const postAlgorithmTags = async (algorithmId, tags) => {
        const url = `${apiUrl}/automaton_tag`;
        try {
            const response = await axios.post(url, { automaton_id: algorithmId, tags });
            const data = response.data;
            return data;
        } catch (error) {
            toast.error("Failed to add tags to the algorithm. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
            throw error;
        }
    }

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
      });
    }

    const downloadAlgorithm = async (algorithm_id) => {
        const url = `${apiUrl}/automaton/images/${algorithm_id}`;

        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error("Error downloading algorithm:", error);
            toast.error("Failed to download algorithm. Please try again.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
        }
    }

    const setAlgorithmTags = (algorithm_id, tags) => {
        const URL = `${apiUrl}/automaton_tag`;
        const formData = new FormData();
        try {
            tags.map((tag) => {
                formData.append("automaton_tag[automaton_id]", algorithm_id);
                formData.append("automaton_tag[tag_id]", tag.id);
                axios.post(URL, formData);
            });
        } catch (error) {
            console.error("Error linking algorithm tags:", error);
        }
    }

    return (
        <APIContext.Provider value={{ apiUrl, setApiUrl, login, signUp, addAlgorithm, getAlgorithms, addAlgorithmComment, getAlgorithmComments, getTags, postAlgorithmTags, downloadAlgorithm, setAlgorithmTags }}>
            {children}
        </APIContext.Provider>
    );
};

export const useAPI = () => {
    return useContext(APIContext);
};
export default APIProvider;