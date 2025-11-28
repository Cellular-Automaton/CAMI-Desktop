import React, { useState } from "react";

const Chip = ({tagName, onClickCallback}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleHoverChip = (event) => {
        if (!isHovered) {
            event.target.classList.add("text-white");
            event.target.classList.add("bg-primary");
            event.target.classList.remove("text-primary");
            setIsHovered(true);
        } else {
            event.target.classList.remove("text-white");
            event.target.classList.remove("bg-primary");
            event.target.classList.add("text-primary");
            setIsHovered(false);
        }
    };

    return (
        <button
            className="text-primary rounded-full border-primary text-xs border-2 px-2 truncate"
            onClick={onClickCallback}
            onMouseEnter={handleHoverChip}
            onMouseLeave={handleHoverChip}>
                {tagName}
        </button>
    )
};

export default Chip;