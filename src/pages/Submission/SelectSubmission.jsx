import React from "react";
import { useNavigate } from "react-router-dom";
import gol from "../../../assets/images/gol2.gif";
import ruler from "../../../assets/images/ruler.svg";

import AddRoundedIcon from '@mui/icons-material/AddRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import DesignServicesRoundedIcon from '@mui/icons-material/DesignServicesRounded';

export default function SelectSubmission() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-background font-mono text-text relative">
            <div className="absolute top-0 left-0 w-full h-full bg-backgroundAlt">
                <img src={gol} alt="Background" className="object-cover w-full h-full blur-sm opacity-30" />
            </div>

            <div className="z-10 w-3/5 bg-background shadow-lg shadow-midnight-purple-shadow rounded-lg p-8 flex flex-col gap-6 items-center">
                <h1 className="text-4xl">Submit a new resource</h1>
                <p className="text-sm opacity-80">Choose whether you want to submit an algorithm or a visual.</p>

                <div className="w-full grid grid-cols-2 gap-6 mt-4">
                    <button onClick={() => navigate('/Submission/Algorithm')}
                        className="
                            flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-primary
                            hover:scale-105 focus-visible:scale-105 transition-all duration-200
                            text-textPrimary
                        "
                    >
                        <AddRoundedIcon sx={{ fontSize: 64, color: "inherit" }} />
                        <span className="text-inherit text-xl font-bold">Submit Algorithm</span>
                        <span className="text-inherit text-sm max-w-xs">Upload a new cellular automaton algorithm (parameters, release link)</span>
                    </button>

                    <button onClick={() => navigate('/Submission/Visual')}
                        className="
                            flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-primary
                            hover:scale-105 focus-visible:scale-105 transition-all duration-200
                            text-textPrimary
                        "
                    >
                        <VisibilityRoundedIcon sx={{ fontSize: 64, color: "inherit" }} />
                        <span className="text-inherit text-xl font-bold">Submit Visual</span>
                        <span className="text-inherit text-sm max-w-xs">Submit a visualization or plugin (name, description, release link)</span>
                    </button>
                </div>

                <div className="w-full">
                    <button onClick={() => navigate('/Submission/Try')}
                        className="
                            flex flex-row w-full items-center justify-center gap-4 p-8 rounded-lg bg-primary
                            hover:scale-105 focus-visible:scale-105 transition-all duration-200
                            text-textPrimary
                        "
                    >
                        <DesignServicesRoundedIcon sx={{ fontSize: 64, color: "inherit" }} />

                        <div className="flex flex-col text-left gap-4">
                            <span className="text-inherit text-xl font-bold">Try Visual</span>
                            <span className="text-inherit text-sm">Want to try your visual before submitting?</span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
