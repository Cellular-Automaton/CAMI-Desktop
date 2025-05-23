import React, { createContext, useContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const url = "http://localhost:4000/api/user";
    const [user, setUser] = useState({
        user_id: null,
        username: null,
        img: null,
        email: null,
        token: null,
    });
    const [loggedIn, setLoggedIn] = useState(false);
    

    const login = async (userData) => {
        // Temporary Waiting the backend route for login
        await axios.post(url, userData).then((response) => {
            if (response.status === 201) {
                const { user_id, username, img, email, token } = response.data.data;
                
                setUser({
                    user_id,
                    username,
                    img,
                    email,
                    token,
                });
                
                localStorage.setItem("token", token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                setLoggedIn(true);
            } else {
                console.error("Login failed");
                throw new Error(response.data.message);
            }
        })
    };

    const logout = () => {
        setUser({
            id: null,
            username: null,
            img: null,
            email: null,
            token: null,
        });

        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setLoggedIn(false);
    };

    return (
        <UserContext.Provider value={{ user, login, logout, loggedIn }}>
            {children}
        </UserContext.Provider>
    );
}