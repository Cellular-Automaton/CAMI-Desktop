import React from "react";
import SimulationPreview from "../SimulationPreview/SimulationPreview.jsx";
import SimulationPreviewPlaceholder from "../SimulationPreviewPlaceholder/SimulationPreviewPlaceholder.jsx";

export default function Swipe({ simulations, last, favorite }) {
  function sortSimulationsByDate(simulations) {
    return simulations.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  const sortedSimulations = sortSimulationsByDate(simulations);
  return (
    <div className="relative">
      <div className="flex flex-row h-52 w-full self-stretch overflow-x-auto gap-20 no-scrollbar">
        {sortedSimulations.map((simulation) => {
          return (
            <div key={simulation.id} className="flex-shrink-0 w-52">
              <SimulationPreview
                last={last}
                favorite={favorite}
                simulation={simulation}
              />
            </div>
          );
        })}
        <div>
          <SimulationPreviewPlaceholder />
        </div>
      </div>
      <div
        id="hider"
        className="absolute right-0 top-0 w-6 h-full pointer-events-none bg-gradient-to-r from-transparent to-midnight"
      ></div>
    </div>
  );
}
