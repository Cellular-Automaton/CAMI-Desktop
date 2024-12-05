import React from "react";
import Sad from "../../../assets/images/sad.svg";

export default function SimulationResume() {
    return (
        <div className="flex flex-col h-full w-64 overflow-hidden gap-1">
            <div className=" w-full h-40 rounded-lg border-midnight-text border-4 border-dashed flex flex-col justify-center items-center gap-2">
                <div>
                    <img src={Sad} alt="placeholder" className="size-10" />
                </div>
                <div className="text-white text-sm">Nothing to see here...</div>
            </div>
            <div>
                <div className="flex flex-row w-full justify-between text-sm"></div>
                <div></div>
            </div>
        </div>
    );
}