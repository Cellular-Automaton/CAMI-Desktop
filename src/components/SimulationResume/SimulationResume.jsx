import React from "react";

export default function SimulationResume({ name }) {
    return (
        <div className="bg-amber-500 h-20 w-52 overflow-hidden">
            <div id="image" className="border-l-indigo-600 border-r-4 h-3"></div>
            <div id="name" className="text-right">{name}</div>
        </div>
    );
}