import React, { useState, useContext } from "react";

import SettingImage from "../../../assets/images/settings.svg";
import HomeImage from "../../../assets/images/home.svg";
import CommunityImage from "../../../assets/images/link.svg";
import LoginImage from "../../../assets/images/login.svg";
import AddImage from "../../../assets/images/add.svg";
import nopicture from "../../../assets/images/nopicture.svg";

import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext.jsx";

const icons = [
    {
        name: "Home",
        icon: HomeImage
    },
    {
        name: "Community",
        icon: CommunityImage
    },
    {
        name: "Settings",
        icon: SettingImage
    },
    {
        name: "Playground",
        icon: SettingImage
    }
];

export default function Navbar() {
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const { userData, loggedIn, logout } = useContext(UserContext);

    const handleRedirect = (iconName) => {
        console.log("Redirecting to:", iconName);
        switch (iconName) {
            case "Home":
                navigate("/Home");
                break;
            case "Community":
                navigate("/Community");
                break;
            case "Settings":
                navigate("/Settings");
                break;
            case "Playground":
                navigate("/Playground");
                break;
            case "Information":
                navigate("/Information");
                break;
            case "Submission":
                navigate("/Submission");
            default:
                break;
        }
    };

    return (
        <div
            className={`fixed top-0 flex h-full flex-col justify-center items-center transition-all duration-300 font-mono z-50
                ${isHovered ? "w-1/5" : "w-16"}
                bg-gradient-to-r from-midnight via-20% via-midnight to-transparent"
                `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col h-72 justify-evenly items-center w-full transition-all duration-300">

                {
                    loggedIn ? (
                        <button className="flex items-center justify-start w-full p-2 pb-5 pt-5 hover:bg-slate-500 transition-all duration-300 overflow-hidden gap-10"
                            onClick={() => {logout(), navigate(0)}}>
                            <img className="h-7 w-7" src={userData.img == null ? nopicture : userData.img} alt="User picture" />
                            <span className="ml-2 text-white">Logout</span>
                        </button>
                    ) : (
                        <button className="flex items-center justify-start w-full p-2 pb-5 pt-5 hover:bg-slate-500 transition-all duration-300 overflow-hidden gap-10"
                            onClick={() => {navigate("/Connection")}}>
                            <img className="h-7 w-7" src={LoginImage} alt="Login" />
                            <span className="text-white">Login</span>
                        </button>
                    )
                }

                {icons.map((icon) => {
                    return (
                        <button key={icon.name} className="flex items-center justify-start w-full p-2 pb-5 pt-5 hover:bg-slate-500 transition-all duration-300 overflow-hidden gap-10"
                            onClick={() => handleRedirect(icon.name)}>
                            <img className="h-7 w-7" src={icon.icon} alt={icon.name} />
                            <span className="ml-2 text-white">{icon.name}</span>
                        </button>
                    );
                })}
                {
                    !loggedIn ?
                        null 
                    : (
                        <button className="flex items-center justify-start w-full p-2 pb-5 pt-5 hover:bg-slate-500 transition-all duration-300 overflow-hidden gap-10"
                            onClick={() => navigate("/Submission")}>
                            <img className="h-7 w-7" src={AddImage} alt="Submission" />
                            <span className="ml-2 text-white">Submission</span>
                        </button>
                    )
                }
            </div>
        </div>
    );
}