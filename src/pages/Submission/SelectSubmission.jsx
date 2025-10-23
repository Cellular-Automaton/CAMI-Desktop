import React from "react";
import { useNavigate } from "react-router-dom";
import gol from "../../../assets/images/gol2.gif";
import AddImage from "../../../assets/images/add.svg";
import viewImage from "../../../assets/images/view.svg";

export default function SelectSubmission() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-midnight font-mono text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-midnight-opacity">
                <img src={gol} alt="Background" className="object-cover w-full h-full blur-sm opacity-30" />
            </div>

            <div className="z-10 w-3/5 bg-midnight shadow-lg shadow-midnight-purple-shadow rounded-lg p-8 flex flex-col gap-6 items-center">
                <h1 className="text-4xl">Submit a new resource</h1>
                <p className="text-sm opacity-80">Choose whether you want to submit an algorithm or a visual (plugin/visualization).</p>

                <div className="w-full grid grid-cols-2 gap-6 mt-4">
                    <button onClick={() => navigate('/Submission/Algorithm')}
                        className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-midnight-purple hover:bg-midnight-purple-dark transition-colors">
                        <img src={AddImage} alt="Algorithm" className="h-16 w-16" />
                        <span className="text-xl font-bold">Submit Algorithm</span>
                        <span className="text-sm opacity-80 max-w-xs">Upload a new cellular automaton algorithm (parameters, release link)</span>
                    </button>

                    <button onClick={() => navigate('/Submission/Visual')}
                        className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-midnight-purple hover:bg-midnight-purple-dark transition-colors">
                        <img src={viewImage} alt="Visual" className="h-16 w-16" />
                        <span className="text-xl font-bold">Submit Visual</span>
                        <span className="text-sm opacity-80 max-w-xs">Submit a visualization or plugin (name, description, release link)</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
