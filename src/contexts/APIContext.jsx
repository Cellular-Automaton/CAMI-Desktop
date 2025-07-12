import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";


export const APIContext = createContext();

export const APIProvider = ({ children }) => {
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

    const addAlgorithm = async (algorithmData) => {
        const url = `${apiUrl}/automaton`;
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
        const url = `${apiUrl}/comment`;

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

    return (
        <APIContext.Provider value={{ apiUrl, setApiUrl, login, signUp, addAlgorithm, getAlgorithms, addAlgorithmComment }}>
            {children}
        </APIContext.Provider>
    );
};

export const useAPI = () => {
    return useContext(APIContext);
};
export default APIProvider;