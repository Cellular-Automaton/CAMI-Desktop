import React, { useState } from "react";
import SettingImage from "../../../assets/images/settings.svg";
import HomeImage from "../../../assets/images/home.svg";
import CommunityImage from "../../../assets/images/link.svg";
import "./Navbar.css";

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
];

export default function Navbar() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`fixed top-0 flex h-full flex-col justify-center items-center transition-all duration-300 font-mono z-50
                ${isHovered ? "w-1/5" : "w-16"}
                bg-gradient-to-r from-midnight via-20% via-midnight to-transparent"
                `}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col h-64 justify-evenly items-center w-full transition-all duration-300">
                {icons.map((icon) => {
                    return (
                        <button key={icon.name} className="flex items-center justify-start w-full p-2 hover:bg-slate-500 transition-all duration-300 overflow-hidden gap-10">
                            <img className="h-7 w-7" src={icon.icon} alt={icon.name} />
                            <span className="ml-2 text-white">{icon.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}