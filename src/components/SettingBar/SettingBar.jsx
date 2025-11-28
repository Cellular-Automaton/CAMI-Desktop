import React from "react";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded';
import MinimizeRoundedIcon from '@mui/icons-material/MinimizeRounded';

const SettingBar = () => {
    return (
        <div className="flex fixed top-0 right-0 w-full h-6 z-10 justify-end items-center drag">
            <div className="flex flex-row justify-center items-center no-drag">
                <button className="text-white hover:bg-white/60 h-full w-12 p-1 no-drag">
                    <MinimizeRoundedIcon sx={{ fontSize: 16 }} />
                </button>

                <button className="text-white hover:bg-white/60 h-full w-12 p-1 no-drag">
                    <CropSquareRoundedIcon sx={{ fontSize: 16 }} />
                </button>

                <button className="text-white hover:bg-red-600 h-full w-12 p-1 no-drag">
                    <CloseRoundedIcon sx={{ fontSize: 16 }} />
                </button>
            </div>
        </div>
    );
}

export default SettingBar;