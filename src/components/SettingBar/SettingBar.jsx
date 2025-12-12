import React, { useEffect } from "react";

import { useNavigateBack } from "../../contexts/NavigateBackContext.jsx";

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import CropSquareRoundedIcon from '@mui/icons-material/CropSquareRounded';
import MinimizeRoundedIcon from '@mui/icons-material/MinimizeRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';

const SettingBar = () => {
    const {
        isReturnButtonVisible,
        hideReturnButton,
        handleReturn
    } = useNavigateBack();

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
        <div className="flex fixed -top-1 w-full ml-16 pr-16 h-10 z-40 justify-between items-center drag">
            <div className="flex flex-row justify-center items-center no-drag">
                {
                    isReturnButtonVisible &&
                    <button id="return-button" className="hover:bg-gray-400/70 h-full w-12 p-1 no-drag" onClick={handleReturn}>
                        <ArrowBackIosNewRoundedIcon sx={{ color: "var(--color-text)", fontSize: 16 }} />
                    </button>
                }
            </div>

            <div className="flex flex-row justify-center items-center no-drag">
                <button className="hover:bg-gray-400/70 h-full w-12 p-1 no-drag" onClick={handleMinimize}>
                    <MinimizeRoundedIcon sx={{ color: "var(--color-text)", fontSize: 16 }} />
                </button>

                <button className="hover:bg-gray-400/70 h-full w-12 p-1 no-drag" onClick={handleMaximize}>
                    <CropSquareRoundedIcon sx={{ color: "var(--color-text)", fontSize: 16 }} />
                </button>

                <button className="hover:bg-red-600/80 h-full w-12 p-1 no-drag" onClick={handleClose}>
                    <CloseRoundedIcon sx={{ color: "var(--color-text)", fontSize: 16 }} />
                </button>
            </div>
        </div>
    );
}

export default SettingBar;