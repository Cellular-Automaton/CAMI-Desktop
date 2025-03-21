import React from "react";
import Home from "./pages/Home/Home.jsx";
import { HashRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Playground from "./pages/Playground/Playground.jsx";
import SimulationInformation from "./pages/SimulationInformation/SimulationInformation.jsx";

export default function App() {
    return (
        <HashRouter>
            <div className="flex flex-row h-full">
                <div className="fixed h-full top-0 left-0 w-16 bg-midnight"></div>
                <Navbar />
                <div className="flex-grow h-full w-full pl-16">
                    <Routes>
                        <Route path="/main_window" element={<Home />} />
                        <Route path="/playground" element={<Playground/>} />
                        <Route path="/test" element={<SimulationInformation/>} />
                    </Routes>
                </div>
            </div>
        </HashRouter>
    );
}