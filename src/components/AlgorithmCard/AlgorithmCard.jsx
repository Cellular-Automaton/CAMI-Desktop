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

        // imageContainer.classList.remove("blur-sm");
    };
    
    const onMouseLeave = (e) => {
        const target = e.currentTarget;
        const imageContainer = target.querySelector("#image-container");

        // imageContainer.classList.add("blur-sm");
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
            className="flex p-2 flex-col-reverse relative bg-backgroundAlt rounded-md shadow-lg w-96 h-64
                transition ease-in-out duration-750 hover:ring-primary hover:ring-4
                cursor-pointer hover:scale-110 hover:z-10"
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

            <div id={"image-container"} className="absolute inset-0 p-2 flex flex-col justify-center rounded-md items-center gap-3 transition ease-in-out duration-150 overflow-hidden">
                <img src={image} alt="Algorithm" className="h-full w-full rounded-md object-cover overflow-hidden"/>
            </div>

            <div id="text-container" 
                className="flex relative flex-col z-10 justify-center items-center  rounded-b-md rounded-t-none w-full h-20 gap-2 p-4 backdrop-blur-md">

                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-backgroundAlt to-transparent backdrop-blur-md"></div>

                <div id="title" className="flex flex-row justify-start w-full h-2/4 text-l font-bold text-text">
                    {algorithm.name}
                </div>

                <div id={"tags-container"} className="flex flex-row justify-start items-center w-full h-2/4 gap-1 pb-2">
                    {  
                        algorithm.tags.map((tag) => (
                            <Tooltip key={tag.tag_id} title={tag.tag_description} placement="bottom" arrow>
                                <Chip 
                                    label={tag.tag_name} size="small" variant="filled"
                                    sx={{
                                        backgroundColor: "var(--color-primary)",
                                        color: "var(--color-text-primary)",
                                        fontFamily: "'JetBrains Mono', monospace", 
                                        fontWeight: "bold"
                                    }}
                                />
                            </Tooltip>
                        ))
                    }
                </div>
            </div>
        </button>
    )
};

export default AlgorithmCard;