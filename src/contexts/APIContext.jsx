import axios from "axios";
import React, { createContext, useContext, useState } from "react";

export const APIContext = createContext();

export const APIProvider = ({ children }) => {
    const [apiUrl, setApiUrl] = useState("http://localhost:4000/api");

    const login = async (formData) => {
        const url = `${apiUrl}/login`;

        try {
            const response = await axios.post(url, formData);
            const data = response.data;
            return data;
        } catch (error) {
            alert("Login failed. Please try again. : " + error.message);
            throw error;
        }
    };

    const signUp = async (formData) => {
        const url = `${apiUrl}/user`;
        try {
            const response = await axios.post(url, formData);
            const data = response.data;
            return data;
        } catch (error) {
            if (error.response && error.response.status === 422) {
                alert("Username or email already exists. Please try again with different credentials.");
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
            alert("Failed to fetch algorithms. Please try again. : " + error.message);
            throw error;
        }
    }

    return (
        <APIContext.Provider value={{ apiUrl, setApiUrl, login, signUp, addAlgorithm, getAlgorithms }}>
            {children}
        </APIContext.Provider>
    );
};

export const useAPI = () => {
    return useContext(APIContext);
};
export default APIProvider;