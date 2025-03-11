import React from "react";
import Play from "../../../assets/images/play.svg";
import Pause from "../../../assets/images/pause.svg";

const SimulationPlayer = ({ onStartSimulation, onStopSimulation, isPlaying }) => {

    return (
        <div id="player-container" className="flex flex-row absolute justify-center items-center bottom-0 w-full h-1/6 pointer-events-none">
            <div 
                id="player" 
                className="flex flex-col justify-center items-center w-4/5 h-2/3 py-4 gap-4
                    bg-midnight-opacity z-10 mx-3 mb-1 rounded-md pointer-events-auto">
                <div id="buttons" className="flex flex-row justify-center items-center w-1/4 h-3/5 gap-3">
                    <div className="flex flex-row h-11 justify-center items-center">
                        <button 
                            className={`h-16 ${isPlaying ? "opacity-50" : ""}`}
                            onClick={onStartSimulation}>
                            <img src={Play} alt="Play" className="h-full "/>
                        </button>
                    </div>
                    <div className="flex flex-row justify-center items-center h-11">
                        <button 
                            className={`h-16 ${!isPlaying ? "opacity-50" : ""}`}
                            onClick={onStopSimulation}>
                            <img src={Pause} alt="Pause" className="h-full"/>
                        </button>
                    </div>
                </div>
                <div id="slider" className="flex flex-row justify-center items-center h-2/5 w-full">
                    <input type="range" min="1" max="100" value="50" className="w-1/2 h-1/2 bg-midnight text-white rounded-md"/>
                </div>
            </div>
        </div>
    )
};

export default SimulationPlayer;