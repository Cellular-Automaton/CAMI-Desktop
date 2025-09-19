import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        window.electron.onUserSession((user) => {
            console.log("User session received in UserProvider:", user);
            if (user && user.token) {
                setUser(user);
                setToken(user.token);
            }
        });

        window.addEventListener("beforeunload", () => {
            sessionStorage.setItem("isReload", "true");
        });

        if (sessionStorage.getItem("isReload") === "true") {
            console.log("Page reloaded, retrieving user data from storage...");
            window.electron.getData("user").then((data) => {
                console.log("Stored user data:", data);
                if (data && data.token) {
                    setUser(data);
                    setToken(data.token);
                }
            }).catch((error) => {
                console.error("Error retrieving stored user data:", error);
            });
            sessionStorage.setItem("isReload", "false");
        }
    }, []);

    const setToken = (token) => {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        localStorage.setItem("token", token);
        setUserData((prevData) => ({
            ...prevData,
            token: token,
        }));
    }

    const setUser = async (user) => {
        setUserData({
            user_id: user.user_id || null,
            username: user.username || null,
            email: user.email || null,
            img: user.img || null,
            token: user.token || null,
            role: user.role || null,
        });
        setLoggedIn(true);
    }

    const logout = () => {
        setUser({});
        setToken(null);

        window.electron.deleteData("user");
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