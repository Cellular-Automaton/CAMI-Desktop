import React, { useState } from "react";

const Chip = ({tagName, onClickCallback}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleHoverChip = (event) => {
        if (!isHovered) {
            event.target.classList.add("text-white");
            event.target.classList.add("bg-midnight-purple");
            event.target.classList.remove("text-midnight-purple");
            setIsHovered(true);
        } else {
            event.target.classList.remove("text-white");
            event.target.classList.remove("bg-midnight-purple");
            event.target.classList.add("text-midnight-purple");
            setIsHovered(false);
        }
    };

    return (
        <button
            className="text-midnight-purple rounded-full border-midnight-purple text-xs border-2 px-2 truncate"
            onClick={onClickCallback}
            onMouseEnter={handleHoverChip}
            onMouseLeave={handleHoverChip}>
                {tagName}
        </button>
    )
};

export default Chip;