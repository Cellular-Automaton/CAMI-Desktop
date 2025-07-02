import React, { createContext, useContext, useState } from "react";

export const APIContext = createContext();

export const APIProvider = ({ children }) => {
    const [apiUrl, setApiUrl] = useState("http://localhost:4000/api");

    const login = async (formData) => {
        const url = `${apiUrl}/login`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error("Login failed");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error during login:", error);
            alert("Login failed. Please try again. : " + error.message);
            throw error;
        }
    };

    const signUp = async (formData) => {
        const url = `${apiUrl}/user`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error("Sign up failed");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error during sign up:", error);
            alert("Sign up failed. Please try again. : " + error.message);
            throw error;
        }
    };

    const addAlgorithm = async (algorithmData) => {
        const url = `${apiUrl}/automaton`;
    }

    return (
        <APIContext.Provider value={{ apiUrl, setApiUrl, login, signUp }}>
            {children}
        </APIContext.Provider>
    );
};

export const useAPI = () => {
    return useContext(APIContext);
};
export default APIProvider;