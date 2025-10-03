import Home from "./pages/Home/Home.jsx";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import { SimulationProvider, useSimulation } from "./contexts/SimulationContext.jsx";
import { ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar/Navbar.jsx";
import Playground from "./pages/Playground/Playground.jsx";
import SimulationInformation from "./pages/SimulationInformation/SimulationInformation.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import Community from "./pages/Community/Community.jsx";
import Connection from "./pages/Connection/Connection.jsx";
import Submission from "./pages/Submission/Submission.jsx";
import AdminPage from "./pages/Admin/AdminPage.jsx";

export default function App() {
    // When the page is charged for the first time, it redirect to /home
    useEffect(() => { // Temporary I think
        window.location.replace("#/Home");
    }, []);

    return (
        <Router>
            <div className="flex flex-row h-full">
                <div className="fixed h-full top-0 left-0 w-16 bg-midnight"></div>
                <Navbar />
                <div className="flex-grow h-full w-full pl-16">
                    <ToastContainer 
                        position="top-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="dark"
                        toastStyle={{ backgroundColor: "#242423", color: "#ffffff" }}
                    />
                    <SimulationProvider>
                        <Routes>
                            <Route path="/Home" element={<Home />} />
                            <Route path="/Playground" 
                                element={
                                        <Playground/>
                                }/>
                            <Route path="/Information" element={<SimulationInformation/>} />
                            <Route path="/Community" element={<Community/>} />
                            <Route path="/Connection" element={<Connection/>} />
                            <Route path="/Submission" element={<Submission/>} />
                            <Route path="/Admin" element={<AdminPage />} />
                            <Route path="/*" element={<NotFound/>}/>
                        </Routes>
                    </SimulationProvider>
                </div>
            </div>
        </Router>
    );
}
