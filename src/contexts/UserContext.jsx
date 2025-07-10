import React, { createContext, useContext, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({
        user_id: null,
        username: null, 
        img: null,
        email: null,
        token: null,
    });
    const [loggedIn, setLoggedIn] = useState(false);

    const setToken = (token) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);
        setUserData((prevData) => ({
            ...prevData,
            token: token,
        }));
    }

    const setUser = async (user) => {
        console.log("HERE", user)
        setUserData({
            user_id: user.user_id || null,
            username: user.username || null,
            email: user.email || null,
            img: user.img || null,
            token: user.token || null,
        });
        setLoggedIn(true);
    }

    const logout = () => {
        setUser({
            id: null,
            username: null,
            //img: null,
            email: null,
            //token: null,
        });

        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setLoggedIn(false);
    };

    return (
        <UserContext.Provider value={{ userData, setUser, logout, loggedIn, setToken }}>
            {children}
        </UserContext.Provider>
    );
}