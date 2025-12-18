import React, { useState, useContext, useEffect } from "react";

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import logo from "../../../assets/images/logo.png";

import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext.jsx";

export default function Navbar() {
    const navigate = useNavigate();
    const { userData, loggedIn, logout } = useContext(UserContext);

  return (
    <div
      className="
                    fixed top-0 flex h-full flex-col justify-center
                    items-center transition-all duration-300 font-mono z-50
                    hover:w-96 w-16 backdrop-blur-md
                    bg-gradient-to-r from-midnight to-transparent
                    rounded-r-xl shadow-2xl shadow-black
                "
        >
            <div className="flex flex-col h-full justify-center items-center w-full transition-all duration-300 gap-3 pl-1.5">

                {
                    loggedIn ? (
                        <button className="
                            flex items-center justify-start w-full p-2 pb-5 pt-5 
                            transition-all hover:bg-midnight-purple-dark/80
                            duration-300 overflow-hidden gap-10 h-12
                            hover:shadow-lg hover:black rounded-l-md"
                            onClick={() => {logout(), navigate(0)}}
                        >
                            <AccountBoxRoundedIcon sx={{ color: "#FFFFFF", fontSize: 32 }} />
                            <span className="text-white">Logout</span>
                        </button>
                    ) : (
                        <button className="
                            flex items-center justify-start w-full p-2 pb-5 pt-5 
                            transition-all hover:bg-midnight-purple-dark/80
                            duration-300 overflow-hidden gap-10 h-12
                            hover:shadow-lg hover:black rounded-l-md"
                            onClick={() => {navigate("/Connection")}}>
                            <LoginRoundedIcon sx={{ color: "#FFFFFF", fontSize: 32 }} />
                            <span className="text-white">Login</span>
                        </button>
                    )
                }
                
                <button className="
                    flex items-center justify-start w-full p-2 pb-5 pt-5 
                    transition-all hover:bg-midnight-purple-dark/80
                    duration-300 overflow-hidden gap-10 h-12
                    hover:shadow-lg hover:black rounded-l-md"
                    onClick={() => {navigate("/Home")}}
                >
                    <HomeRoundedIcon sx={{ color: "#FFFFFF", fontSize: 32 }} />
                    <span className="text-white">Home</span>
                </button>

                
                <button className="
                    flex items-center justify-start w-full p-2 pb-5 pt-5 
                    transition-all hover:bg-midnight-purple-dark/80
                    duration-300 overflow-hidden gap-10 h-12
                    hover:shadow-lg hover:black rounded-l-md"
                    onClick={() => {navigate("/Community")}}
                >
                    <ForumRoundedIcon sx={{ color: "#FFFFFF", fontSize: 32 }} />
                    <span className="text-white">Community</span>
                </button>

                {
                    loggedIn ?
                        <button className="
                            flex items-center justify-start w-full p-2 pb-5 pt-5 
                            transition-all hover:bg-midnight-purple-dark/80
                            duration-300 overflow-hidden gap-10 h-12
                            hover:shadow-lg hover:black rounded-l-md"
                            onClick={() => {navigate("/Submission")}}
                        >
                            <AddBoxRoundedIcon sx={{ color: "#FFFFFF", fontSize: 32 }} />
                            <span className="text-white">Submission</span>
                        </button>
                    :
                        null
                }

                {
                    loggedIn && userData.role === "admin" ?
                        <button className="
                            flex items-center justify-start w-full p-2 pb-5 pt-5 
                            transition-all hover:bg-midnight-purple-dark/80
                            duration-300 overflow-hidden gap-10 h-12
                            hover:shadow-lg hover:black rounded-l-md"
                            onClick={() => {navigate("/Admin")}}
                        >
                            <RemoveRedEyeRoundedIcon sx={{ color: "#FFFFFF", fontSize: 32 }} />
                            <span className="text-white">Admin</span>
                        </button>
                    :
                        null
                }

                {/* <button className="
                    flex items-center justify-start w-full p-2 pb-5 pt-5 
                    transition-all hover:bg-midnight-purple-dark/80
                    duration-300 overflow-hidden gap-10 h-12
                    hover:shadow-lg hover:black rounded-l-md"
                    onClick={() => {navigate("/Settings")}}
                >
                    <SettingsRoundedIcon sx={{ color: "#FFFFFF", fontSize: 32 }} />
                    <span className="text-white">Settings</span>
                </button> */}
            </div>
            
            <div className="
                    flex items-center justify-start w-full p-2 pb-5 pt-5
                    duration-300 overflow-hidden gap-10 h-12
                    hover:shadow-lg hover:black rounded-l-md
            ">
                <img src={logo} alt="CAMI logo" className="w-12 h-auto shrink-0" />
                <span className="text-white/50 min-w-52 text-sm mb-3 text-center h-full">CAMI v1.0.0</span>
            </div>
        </div>
    );
}
