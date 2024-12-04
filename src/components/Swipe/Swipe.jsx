import React from "react";
import SimulationResume from "../SimulationResume/SimulationResume.jsx";

export default function Swipe({simulations}) {
    return (
        <div className="flex flex-row bg-slate-500 h-52 self-stretch overflow-hidden gap-10">
            {
                simulations.map((simulation) => {
                    return (
                        <SimulationResume name={simulation.name} />
                    );
                })
            }
        </div>
    );
}