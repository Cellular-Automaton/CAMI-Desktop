import React from "react";
import Home from "./pages/Home/Home.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import Taskbar from "./components/Taskbar/Taskbar.jsx";
import Playground from "./pages/Home/Playground.jsx";

export default function App() {
  return (
    <Router>
      <div className="flex flex-row h-full">
        <div className="fixed h-full top-0 left-0 w-16 bg-midnight"></div>
        <Navbar />
        {/* <Taskbar /> */}
        <div className="flex-grow h-full w-full pl-16">
          <Routes>
            {/* <Route path="/main_window" element={<Home />} /> */}
            <Route path="/main_window" element={<Playground />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
