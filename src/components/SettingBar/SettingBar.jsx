import React from "react";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded';
import MinimizeRoundedIcon from '@mui/icons-material/MinimizeRounded';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

const SettingBar = () => {

    function handleClose() {
        window.electron.onCloseApp();
    }

    function handleMinimize() {
        window.electron.onMinimizeApp();
    }

    function handleMaximize() {
        window.electron.onMaximizeApp();
    }

    return (
        <div className="flex fixed -top-1 w-full ml-16 pr-16 h-10 z-20 justify-end items-center drag">
            <div className="flex flex-row justify-center items-center no-drag">
                <button className="text-white hover:bg-white/20 h-full w-12 p-1 no-drag" onClick={handleMinimize}>
                    <MinimizeRoundedIcon sx={{ color: "var(--color-text)", fontSize: 16 }} />
                </button>

                <button className="text-white hover:bg-white/20 h-full w-12 p-1 no-drag" onClick={handleMaximize}>
                    <CropSquareRoundedIcon sx={{ color: "var(--color-text)", fontSize: 16 }} />
                </button>

                <button className="text-white hover:bg-red-600/80 h-full w-12 p-1 no-drag" onClick={handleClose}>
                    <CloseRoundedIcon sx={{ color: "var(--color-text)", fontSize: 16 }} />
                </button>
            </div>
        </div>
    );
}

export default SettingBar;