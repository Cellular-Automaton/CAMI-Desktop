import React, { useState, useEffect } from "react";
import view from "../../../assets/images/view.svg";
import comment from "../../../assets/images/comment.svg";
import like from "../../../assets/images/like.svg";
import download from "../../../assets/images/download.svg";
import Tag from "../Tags/Chip.jsx";


const AlgorithmCard = ({algorithm, onClickCallback}) => {
    const onMouseEnter = () => {
        const imageContainer = document.getElementById("image-container-" + algorithm.id);

        imageContainer.classList.remove("blur-sm");
    };
    
    const onMouseLeave = () => {
        const imageContainer = document.getElementById("image-container-" + algorithm.id);
        const container = document.getElementById("container-" + algorithm.id);

        imageContainer.classList.add("blur-sm");
        container.style.transform = `rotateX(0deg) rotateY(0deg)`;
    };

    const onMouseMove = (event) => {
        const container = document.getElementById("container-" + algorithm.id);
        const scrollY = container.scrollY;
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        const centerX = container.offsetLeft + container.offsetWidth / 2;
        const centerY = (container.offsetTop + scrollY) + container.offsetHeight / 2;
        const mouseX = event.clientX - centerX;
        const mouseY = event.clientY - centerY;
        const rotateX = (10 * mouseY / (height / 2)).toFixed(2);
        const rotateY = (-1 * 10 * mouseX / (width / 2)).toFixed(2);
        // Scroll must be take into account
        container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleRippleEffect = (event) => {
        const ripple = document.createElement('div');
        const size = Math.max(event.currentTarget.clientWidth, event.currentTarget.clientHeight);
        const rect = event.currentTarget.getBoundingClientRect();

        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
        event.currentTarget.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    };

    return (
        <button
            id={"container-" + algorithm.id} 
            className="flex flex-col relative bg-midnight-opacity rounded-md shadow-lg 
                shadow-midnight-purple-shadow w-80 h-72 overflow-hidden transition 
                ease-in-out duration-750 hover:shadow-xl hover:shadow-midnight-purple-shadow
                cursor-pointer"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            onClick={() => {handleRippleEffect, onClickCallback(algorithm)}}>

            <div id={"image-container-" + algorithm.id} className="flex flex-col blur-sm justify-center items-center w-full h-3/5 gap-3 transition ease-in-out duration-150">
                <img src={algorithm.image} alt="Algorithm" className="h-full w-full object-cover"/>
            </div>

            <div id="text-container" className="flex flex-col justify-center items-center w-full h-2/5 gap-2 p-4">
                <div id="title" className="flex flex-row justify-start w-full h-2/4 text-l font-bold text-midnight-text">
                    {algorithm.title}
                </div>

                <div id={"tags-container-" + algorithm.id} className="flex flex-row justify-start items-center w-full h-1/4 gap-1 pb-2">
                    {algorithm.tags.map((tag) => (
                        <Tag key={tag} tagName={tag}/>
                    ))}
                </div>

                <div id="statistics" className="flex flex-row justify-evenly w-full h-1/4 text-sm font-bold text-midnight-text">
                    <div id="view" className="flex flex-row justify-center items-center gap-1">
                        <p>1.5k{algorithm.view}</p>
                        <img src={view} alt="View" className="h-5 w-5"/>
                    </div>
                    <div id="download" className="flex flex-row justify-center items-center gap-1">
                        <p>1.5k{algorithm.download}</p>
                        <img src={download} alt="Download" className="h-5 w-5"/>
                    </div>
                    <div id="like" className="flex flex-row justify-center items-center gap-1">
                        <p>1.5k{algorithm.likes}</p>
                        <img src={like} alt="Like" className="h-5 w-5"/>
                    </div>
                    <div id="comment" className="flex flex-row justify-center items-center gap-1">
                        <p>1.5k{algorithm.comment}</p>
                        <img src={comment} alt="Comment" className="h-5 w-5"/>
                    </div>
                </div>
            </div>
        </button>
    )
};

export default AlgorithmCard;