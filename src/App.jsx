import React from "react";
import Home from "./pages/home/Home.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";

export default function App() {
    return (
        <Router>
            <div className="flex flex-row h-full">
                <Navbar />
                <div className="flex-grow h-full pl-16">
                    <Routes>
                        <Route path="/main_window" element={<Home />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}