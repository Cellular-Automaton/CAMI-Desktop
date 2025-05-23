import React from "react";
import { useEffect, useState, useContext } from "react";
import  Lenia from "../../../assets/images/lenia.gif";
import close from "../../../assets/images/close.svg";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext.jsx";

import bcrypt from "bcryptjs";
import axios from "axios";

export default function Connection() {
    const { user, login } = useContext(UserContext);
    const [isSignIn, setIsSignIn] = useState(true);
    const navigate = useNavigate();

    const onSignUp = async (formData) => {
        const url = "http://localhost:4000/api/user";
        var data = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password")
        }
        var flag = false;

        Object.keys(data).forEach(element =>  {
            if (element === "confirm") 
                return;
            if (data[element] === "") {
                document.getElementById(`signup-error-${element}`).classList.remove("hidden");
                document.getElementById(`signup-${element}`).classList.add("bg-midnight-red");
                document.getElementById(`signup-${element}`).classList.remove("bg-midnight");
                flag = true;
            } else {
                document.getElementById(`signup-error-${element}`).classList.add("hidden");
                document.getElementById(`signup-${element}`).classList.remove("bg-midnight-red");
                document.getElementById(`signup-${element}`).classList.add("bg-midnight");
            }
        });

        if (flag)
            return;

        if (data.password !== formData.get("confirm")) {
            document.getElementById("signup-error-confirm").classList.remove("hidden");
            document.getElementById("signup-confirm").classList.add("bg-midnight-red");
            document.getElementById("signup-confirm").classList.remove("bg-midnight");
            return;
        } else {
            document.getElementById("signup-error-confirm").classList.add("hidden");
            document.getElementById("signup-confirm").classList.remove("bg-midnight-red");
            document.getElementById("signup-confirm").classList.add("bg-midnight");
        }

        // Crypt the password
        var hashedPassword = "";
        await bcrypt.hash(data.password, 10).then(hash => {
            hashedPassword = hash;
        }).catch(err => {
            console.error("Error hashing password:", err);
            return;
        });

        // Check if the email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            document.getElementById("signup-error-email").classList.remove("hidden");
            document.getElementById("signup-email").classList.add("bg-midnight-red");
            document.getElementById("signup-email").classList.remove("bg-midnight");
            return;
        } else {
            document.getElementById("signup-error-email").classList.add("hidden");
            document.getElementById("signup-email").classList.remove("bg-midnight-red");
            document.getElementById("signup-email").classList.add("bg-midnight");
        }

        const body = {
            user: {
                ...data,
                password: hashedPassword,
                verified: false,
                user_role: "user"
            }
        };
        
        try {
            await login(body);
            navigate("/Home");
        } catch (error) {
            console.error("Error logging in:", error);
            return;
        }
    }

    const onSignIn = (formData) => {
        const url = "https://localhost:3000/api/user";
        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (data.email === "" || emailRegex.test(data.email) === false) {
            document.getElementById("signin-error-email").classList.remove("hidden");
            document.getElementById("signin-email").classList.add("bg-midnight-red");
            document.getElementById("signin-email").classList.remove("bg-midnight");
            return;
        } else {
            document.getElementById("signin-error-email").classList.add("hidden");
            document.getElementById("signin-email").classList.remove("bg-midnight-red");
            document.getElementById("signin-email").classList.add("bg-midnight");
        }

        if (data.password === "") {
            document.getElementById("signin-error-password").classList.remove("hidden");
            document.getElementById("signin-password").classList.add("bg-midnight-red");
            document.getElementById("signin-password").classList.remove("bg-midnight");
            return;
        } else {
            document.getElementById("signin-error-password").classList.add("hidden");
            document.getElementById("signin-password").classList.remove("bg-midnight-red");
            document.getElementById("signin-password").classList.add("bg-midnight");
        }

        // Check password to connect.
    }

    return (
        <div id="container" className="flex flex-col items-center justify-center h-screen bg-midnight">

            <div id="login-container" className=" relative flex flex-row rounded-md h-4/5 w-5/6 
                items-center justify-center bg-midnight-opacity p-8 shadow-lg m-5
                shadow-midnight-purple-shadow">

                <div id="image-container" className="relative flex flex-row items-center justify-center w-1/2 h-full">
                    <img src={Lenia} alt="Logo" className="absolute rounded-md h-full w-full object-cover opacity-40 z-0 blur-sm"/>
                    <h1 className="text-6xl font-bold text-left w-full text-white z-10 m-10">{isSignIn ? "Login" : "Sign Up"}</h1>
                </div>

                {/* Add Fade In Animation */}

                {
                    isSignIn ?
                        // SIGN IN
                        <div id="form-container" className="flex flex-col items-center justify-center w-1/2 h-full">

                            <div className="flex flex-col items-center justify-center w-full h-1/2 px-24">

                                <div className="flex flex-col items-center justify-center w-full h-1/2 mb-5 gap-5">
                                    <h1 className="text-6xl font-bold w-full text-white text-center">Welcome back</h1>
                                    <p className="text-midnight-text text-center text-sm">Enter your credentials to access your account</p>
                                </div>

                                <form action={onSignIn} onSubmit={ (e) => {
                                    const formData = new FormData(e.target);

                                    e.preventDefault();
                                    onSignIn(formData);
                                }} className="flex flex-col items-center justify-center w-full h-full gap-2">

                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-midnight-text text-md text-left w-full">Email</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signin-email"
                                                name="email" type="text" placeholder="Enter your email" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-midnight text-midnight-text"/>
                                            <p id="signin-error-email" className="text-midnight-red text-sm hidden text-left">Email is not valid</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-midnight-text text-md text-left w-full">Password</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signin-password"
                                                name="password" type="password" placeholder="Enter your password" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-midnight text-midnight-text"/>
                                            <p id="signin-error-password" className="text-midnight-red text-sm hidden text-left">Password is not valid</p>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full h-10 p-2 mt-5 rounded-md bg-midnight-purple text-white font-bold">Sign In</button>
                                </form>

                                <div className="flex flex-col items-center justify-end w-full h-full mt-5 gap-2">
                                    <p className="text-midnight-text text-center">Don't have an account? 
                                        <a href="#/Connection" className="text-midnight-purple font-bold" onClick={() => setIsSignIn(false)}> Sign Up</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    :
                        // SIGN UP
                        <div id="form-container" className="flex flex-col items-center justify-center w-1/2 h-full">

                            <button className="absolute top-5 right-5 z-10" onClick={() => setIsSignIn(true)}>
                                <img src={close} alt="Close" className="h-10 w-10"/>
                            </button>

                            <div className="flex flex-col items-center justify-center w-full h-1/2 px-24">

                                <div className="flex flex-col items-center justify-center w-full h-1/2 mb-5 gap-5">
                                    <h1 className="text-6xl font-bold w-full text-white text-center">Create an account</h1>
                                    <p className="text-midnight-text text-center text-sm">Enter your credentials to create an account</p>
                                </div>

                                <form action={onSignUp} onSubmit={(e) => {
                                    const formData = new FormData(e.target);
                                    e.preventDefault();
                                    onSignUp(formData);
                                }} className="flex flex-col items-center justify-center w-full h-full gap-2">

                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-midnight-text text-md text-left w-full">Username</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signup-username"
                                                name="username" type="text" placeholder="Enter your username" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-midnight text-midnight-text"/>
                                            <p id="signup-error-username" className="text-midnight-red text-sm hidden text-left">Username is not valid</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-midnight-text text-md text-left w-full">Email</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signup-email"
                                                name="email" type="text" placeholder="Enter your email" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-midnight text-midnight-text"/>
                                            <p id="signup-error-email" className="text-midnight-red text-sm hidden text-left">Email is not valid</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-midnight-text text-md text-left w-full">Password</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signup-password"
                                                name="password" type="password" placeholder="Enter your password" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-midnight text-midnight-text"/>
                                            <p id="signup-error-password" className="text-midnight-red text-sm hidden text-left">Password is not valid</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-midnight-text text-md text-left w-full">Confirm Password</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signup-confirm"
                                                name="confirm" type="password" placeholder="Confirm your password" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-midnight text-midnight-text"/>
                                            <p id="signup-error-confirm" className="text-midnight-red text-sm hidden text-left">Passwords does not match</p>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full h-10 p-2 mt-5 rounded-md bg-midnight-purple text-white font-bold" >Sign Up</button>
                                </form>
                            </div>
                        </div>
                }

            </div>
        </div>
    );
};