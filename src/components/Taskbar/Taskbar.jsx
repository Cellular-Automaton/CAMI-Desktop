import React from "react";

export default function Taskbar() {
    const [isHover, setIsHover] = React.useState(false);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const handleMinimize = () => {
        console.log("Minimize");
        window.electron.ipcRenderer.send('minimize-app');
    };

    const handleFullscreen = () => {
        if (isFullscreen) {
            window.electron.ipcRenderer.send('exit-fullscreen');
            setIsFullscreen(false);
        } else {
            window.electron.ipcRenderer.send('enter-fullscreen');
            setIsFullscreen(true);
        }
    };

    const handleQuit = () => {
        window.electron.ipcRenderer.send('quit-app');
    };

    return (
        <div
            className="flex flex-row fixed top-0 right-0 justify-evenly bg-gray-800 p-2 w-32 h-6"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
        >
            <button 
                onClick={handleMinimize} 
                className={`text-white mx-2`}>-</button>
            <button
                onClick={handleFullscreen} 
                className="text-white mx-2">[]</button>
            <button 
                onClick={handleQuit} 
                className="text-white mx-2">X</button>
        </div>
    );
}