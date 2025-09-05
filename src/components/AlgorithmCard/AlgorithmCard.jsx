import React, { useState, useEffect, useContext } from "react";
import view from "../../../assets/images/view.svg";
import comment from "../../../assets/images/comment.svg";
import like from "../../../assets/images/like.svg";
import download from "../../../assets/images/download.svg";
import Tag from "../Tags/Chip.jsx";
import star from "../../../assets/images/star.svg";
import { APIContext } from "../../contexts/APIContext.jsx";
import { Chip, Tooltip } from "@mui/material";


const AlgorithmCard = ({algorithm, onClickCallback, favorite}) => {
    const [image, setImage] = useState(null);
    const onMouseEnter = (e) => {
        const target = e.currentTarget;
        const imageContainer = target.querySelector("#image-container");

        imageContainer.classList.remove("blur-sm");
    };
    
    const onMouseLeave = (e) => {
        const target = e.currentTarget;
        const imageContainer = target.querySelector("#image-container");

        imageContainer.classList.add("blur-sm");
    };

    useEffect(() => {
        if (algorithm.image[0] !== undefined && algorithm.image[0].contents_binary) {
            // Si algorithm.image est déjà une chaîne base64
            // Adapte le type MIME si besoin (png, jpeg, etc.)
            setImage(`data:image/png;base64,${algorithm.image[0].contents_binary}`);
        } else {
            setImage("https://asset.gecdesigns.com/img/background-templates/gradient-triangle-abstract-background-template-10032405-1710079376651-cover.webp");
        }
    }, [algorithm.image]);
    return (
        <button
            id={"container"} 
            className="flex flex-col relative bg-midnight-opacity rounded-md shadow-lg 
                shadow-midnight-purple-shadow min-w-80 max-w-80 max-h-72 transition 
                ease-in-out duration-750 hover:shadow-xl hover:shadow-midnight-purple-shadow
                cursor-pointer overflow-hidden"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={() => {onClickCallback(algorithm)}}>

            {
                favorite && (
                    <button className="absolute top-2 right-2 z-10">
                        <img src={star} alt="Favorite" className="h-7 w-7"/>
                    </button>
                )
            }

            <div id={"image-container"} className="flex flex-col blur-sm justify-center items-center w-full h-3/5 gap-3 transition ease-in-out duration-150 overflow-hidden">
                <img src={image} alt="Algorithm" className="h-full w-full object-cover overflow-hidden"/>
            </div>

            <div id="text-container" className="flex flex-col justify-center items-center w-full h-2/5 gap-2 p-4">
                <div id="title" className="flex flex-row justify-start w-full h-2/4 text-l font-bold text-midnight-text">
                    {algorithm.name}
                </div>

                <div id={"tags-container"} className="flex flex-row justify-start items-center w-full h-1/4 gap-1 pb-2">
                    {  
                        algorithm.tags.map((tag) => (
                            <Tooltip key={tag.tag_id} title={tag.tag_description} placement="bottom" arrow>
                                <Chip 
                                    label={tag.tag_name} size="small" variant="filled"
                                    sx={{backgroundColor: "#7F6EEE", color: "white", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold"}}
                                />
                            </Tooltip>
                        ))
                    }
                </div>

                {/* <div id="statistics" className="flex flex-row justify-evenly w-full h-1/4 text-sm font-bold text-midnight-text">
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
                </div> */}
            </div>
        </button>
    )
};

export default AlgorithmCard;