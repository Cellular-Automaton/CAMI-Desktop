import React from "react";
import { useEffect, useState, useContext } from "react";
import  Lenia from "../../../assets/images/lenia.gif";
import close from "../../../assets/images/close.svg";

import { useNavigate } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext.jsx";
import { useNavigateBack } from "../../contexts/NavigateBackContext.jsx";

import bcrypt from "bcryptjs";
import { toast } from "react-toastify";
import { APIContext } from "../../contexts/APIContext.jsx";
import { set } from "date-fns";

export default function Connection() {
    const { setUser, setToken } = useContext(UserContext);
    const { login, signUp } = useContext(APIContext);
    const { setReturnCallback, showReturnButton } = useNavigateBack();

    const [isSignIn, setIsSignIn] = useState(true);
    const navigate = useNavigate();

    const onSignUp = async (formData) => {
        var data = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password")
        }

        // TODO : Find solution about password checking
        // var hashedPassword = "";
        // await bcrypt.hash(data.password, 10).then(hash => {
        //     hashedPassword = hash;
        // }).catch(err => {
        //     console.error("Error hashing password:", err);
        //     return;
        // });

        const body = {
            user: {
                ...data,
                verified: false,
                user_role: "user"
            }
        };
        
        signUp(body).then((response) => {
            const data = response.data;
            setUser(data);
            setToken(data.token);
            window.electron.storeData("user", data);
            navigate("/Home");
        }).catch((error) => {
            console.error("Error signing up:", error);
            return;
        });
    }

    const onSignIn = (formData) => {
        const data = {
            email: formData.get("email"),
            password: formData.get("password")
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(data.email)) {
            toast.error("Email is not valid, please enter a valid email.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            return;
        }

        login(data).then((response) => {
            const user = response.user;
            const token = response.token;
            const userInfo = {
                email: user.mail,
                user_id: user.id,
                username: user.username,
                img: user.img || null,
                token: token,
                role: user.role
            };
            window.electron.storeData("user", userInfo);
            setUser(userInfo);
            setToken(token);
            navigate("/Home");
        }).catch((error) => {
            console.error("Error signing in:", error)
        });
    }

    return (
        <div id="container" className="flex flex-col items-center justify-center h-screen bg-background font-mono">

            <div id="login-container" className=" relative flex flex-row rounded-md h-4/5 w-5/6 
                items-center justify-center p-8 m-5">

                <div id="image-container" className="relative flex flex-row items-center justify-center w-1/2 h-full">
                    <img src={Lenia} alt="Logo" className="absolute rounded-md h-screen w-full object-cover opacity-70 z-0 blur-sm"/>
                    <h1 className="text-6xl font-bold text-left w-full text-text z-10 m-10">{isSignIn ? "Login" : "Sign Up"}</h1>
                </div>

                {/* Add Fade In Animation */}

                {
                    isSignIn ?
                        // SIGN IN
                        <div id="form-container" className="flex flex-col items-center justify-center w-1/2 h-full">

                            <div className="flex flex-col items-center justify-center w-full h-1/2 px-24">

                                <div className="flex flex-col items-center justify-center w-full h-1/2 mb-5 gap-5">
                                    <h1 className="text-6xl font-bold w-full text-text text-center">Welcome back</h1>
                                    <p className="text-textAlt text-center text-lg">Enter your credentials to access your account</p>
                                </div>

                                <form onSubmit={ (e) => {
                                    const formData = new FormData(e.target);

                                    e.preventDefault();
                                    onSignIn(formData);
                                }} className="flex flex-col items-center justify-center w-full h-full gap-2">

                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-text text-md text-left w-full">Email</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signin-email" required
                                                name="email" type="text" placeholder="Enter your email" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-backgroundAlt text-text"/>
                                            <p id="signin-error-email" className="text-midnight-red text-sm hidden text-left">Email is not valid</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-text text-md text-left w-full">Password</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signin-password" required
                                                name="password" type="password" placeholder="Enter your password" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-backgroundAlt text-text"/>
                                            <p id="signin-error-password" className="text-midnight-red text-sm hidden text-left">Password is not valid</p>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full h-10 p-2 mt-5 rounded-md bg-primary text-textPrimary font-bold">Sign In</button>
                                    <div className="flex flex-col items-center justify-end w-full h-full mt-5 gap-2">
                                        <p className="text-text text-center">Don't have an account? 
                                            <a href="#/Connection" className="text-primary font-bold"
                                                onClick={() => {
                                                    setIsSignIn(false);

                                                    showReturnButton();
                                                    setReturnCallback(() => {
                                                        setIsSignIn(true);
                                                    });
                                                }}> Sign Up</a>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    :
                        // SIGN UP
                        <div id="form-container" className="flex flex-col items-center justify-center w-1/2 h-full">

                            <div className="flex flex-col items-center justify-center w-full h-1/2 px-24">

                                <div className="flex flex-col items-center justify-center w-full h-1/2 mb-5 gap-5">
                                    <h1 className="text-6xl font-bold w-full text-text text-center">Create an account</h1>
                                    <p className="text-textAlt text-center text-lg">Enter your credentials to create an account</p>
                                </div>

                                <form onSubmit={(e) => {
                                    const formData = new FormData(e.target);
                                    e.preventDefault();
                                    onSignUp(formData);
                                }} className="flex flex-col items-center justify-center w-full h-full gap-2">

                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-text text-md text-left w-full">Username</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signup-username"
                                                name="username" type="text" placeholder="Enter your username" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-backgroundAlt text-text"/>
                                            <p id="signup-error-username" className="text-midnight-red text-sm hidden text-left">Username is not valid</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-text text-md text-left w-full">Email</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signup-email"
                                                name="email" type="text" placeholder="Enter your email" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-backgroundAlt text-text"/>
                                            <p id="signup-error-email" className="text-midnight-red text-sm hidden text-left">Email is not valid</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-text text-md text-left w-full">Password</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signup-password"
                                                name="password" type="password" placeholder="Enter your password" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-backgroundAlt text-text"/>
                                            <p id="signup-error-password" className="text-midnight-red text-sm hidden text-left">Password is not valid</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-full gap-2">
                                        <h2 className="text-text text-md text-left w-full">Confirm Password</h2>
                                        <div className="flex flex-col items-center justify-center w-full">
                                            <input id="signup-confirm"
                                                name="confirm" type="password" placeholder="Confirm your password" 
                                                className="w-full border-none h-10 p-2 rounded-md bg-backgroundAlt text-text"/>
                                            <p id="signup-error-confirm" className="text-midnight-red text-sm hidden text-left">Passwords does not match</p>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full h-10 p-2 mt-5 rounded-md bg-primary text-textPrimary font-bold" >Sign Up</button>
                                </form>
                            </div>
                        </div>
                }

            </div>
        </div>
    );
};