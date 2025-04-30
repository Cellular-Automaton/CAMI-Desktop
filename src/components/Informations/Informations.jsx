import React, { useState, useEffect } from "react";
import close from "../../../assets/images/close.svg";
import like from "../../../assets/images/like.svg";
import dislike from "../../../assets/images/dislike.svg";
import Chip from "../Tags/Chip.jsx";
import view from "../../../assets/images/view.svg";
import download from "../../../assets/images/download.svg";
import Comment from "../Comment/Comment.jsx";

const Informations = ({algorithm, onCloseCallback}) => {
    const [isAlgorithmPresent, setIsAlgorithmPresent] = useState(false);
    
    useEffect(() => {
        if (algorithm !== null && algorithm !== undefined && Object.keys(algorithm).length !== 0) {
            setIsAlgorithmPresent(true);
        } else {
            setIsAlgorithmPresent(false);
        }
    }, [algorithm]);

    const resetScroll = () => {
        const algorithmContainer = document.getElementById("algorithm");
        if (algorithmContainer) {
            setTimeout(() => {
                algorithmContainer.scrollTo(0, 0);
            }, 200);
        }
    };

    return (
        <div id="container" className="flex flex-col h-full w-full relative bg-midnight p-5">

            {/* CLOSE BUTTON */}
            <button 
                className="absolute flex bg-midnight rounded-full grow-0
                    shrink-0 shadow-md shadow-midnight-purple-shadow h-10 w-10 items-center p-1
                    top-5 left-5 hover:bg-midnight-purple
                    transition ease-in-out duration-300"
                     onClick={() => {onCloseCallback(), resetScroll()}}>
                <img src={close} alt="Close" className="h-10 w-10"/>
            </button>

            <div id="information-container" className="flex flex-row justify-center w-full h-full gap-5 p-4 scroll-smooth">
                <div id="algorithm" className="h-full w-fit px-5 gap-5 overflow-y-scroll">

                    <div id="algorithm-infos" className="flex flex-col justify-center items-center w-full h-3/4 gap-2 p-4 rounded-md overflow-hidden bg-midnight-opacity shadow-md shadow-midnight-purple-shadow mb-5">

                        <div id={"image-container"} className="flex flex-col justify-center items-center w-full h-3/5 gap-3 transition ease-in-out duration-150 overflow-hidden">
                            <img src={algorithm.image} alt="Algorithm" className="h-full w-full object-cover"/>
                        </div>

                        <div id="title" className="flex flex-row w-full text-4xl font-bold text-midnight-text">
                            <p className="w-full">
                                {algorithm.title}
                            </p>

                            <div id="algorithm-like" className="flex flex-row w-full justify-end gap-2 text-sm font-bold text-midnight-text">
                                <button id="algorithm-dislike" className="flex flex-row items-center rounded-md hover:bg-midnight transition ease-in-out duration-300 h-10 p-2 gap-2">
                                    <img src={like} alt="Like" className="h-7 w-7"/>
                                    <p>1k</p>
                                </button>
                                <button id="algorithm-dislike" className="flex flex-row items-center rounded-md hover:bg-midnight transition ease-in-out duration-300 h-10 p-2 gap-2">
                                    <img src={dislike} alt="Dislike" className="h-7 w-7"/>
                                    <p>3</p>
                                </button>
                            </div>

                        </div>

                        <div id="statistics" className="flex flex-row justify-start w-full text-sm font-bold text-midnight-text gap-4">
                            <div id="view" className="flex flex-row justify-center items-center gap-1">
                                <img src={view} alt="View" className="h-7 w-7"/>
                                <p>2k{algorithm.view}</p>
                            </div>
                            <div id="download" className="flex flex-row justify-center items-center gap-1">
                                <img src={download} alt="Download" className="h-7 w-7"/>
                                <p>898{algorithm.download}</p>
                            </div>
                        </div>

                        <div id="tags" className="flex flex-row justify-start w-full font-bold text-midnight-text gap-2 pb-2">
                            {
                                isAlgorithmPresent ? 
                                    algorithm.tags.map((tag) => (
                                        <Chip key={tag} tagName={tag}/>
                                    )) :
                                    null
                            }
                        </div>
                        
                        <div id="description" className="flex flex-row justify-start w-full h-fit text-sm font-bold text-midnight-text text-justify pb-5">
                            {/* {algorithm.description} */}
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas purus metus, scelerisque ut facilisis accumsan, dictum vitae ligula. Duis placerat malesuada vehicula. Proin lobortis ornare metus eu tempus. Aliquam dolor purus, auctor sit amet varius id, rutrum ac eros. Donec eu vulputate odio. Ut posuere venenatis convallis. Aenean at metus arcu. Ut molestie, mi ac mollis cursus, nisi est fringilla est, eget fringilla leo justo non mi. Donec vulputate aliquet arcu, eget cursus nulla lobortis ac.
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas purus metus, scelerisque ut facilisis accumsan, dictum vitae ligula. Duis placerat malesuada vehicula. Proin lobortis ornare metus eu tempus. Aliquam dolor purus, auctor sit amet varius id, rutrum ac eros. Donec eu vulputate odio. Ut posuere venenatis convallis. Aenean at metus arcu. Ut molestie, mi ac mollis cursus, nisi est fringilla est, eget fringilla leo justo non mi. Donec vulputate aliquet arcu, eget cursus nulla lobortis ac.
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas purus metus, scelerisque ut facilisis accumsan, dictum vitae ligula. Duis placerat malesuada vehicula. Proin lobortis ornare metus eu tempus. Aliquam dolor purus, auctor sit amet varius id, rutrum ac eros. Donec eu vulputate odio. Ut posuere venenatis convallis. Aenean at metus arcu. Ut molestie, mi ac mollis cursus, nisi est fringilla est, eget fringilla leo justo non mi. Donec vulputate aliquet arcu, eget cursus nulla lobortis ac.
                        </div>

                    </div>

                    <div id="comments" className="flex flex-col justify-center items-center w-full gap-2 p-4 rounded-md overflow-hidden bg-midnight-opacity shadow-md shadow-midnight-purple-shadow mb-5">
                        <div id="comment-title" className="flex flex-row justify-start w-full text-2xl font-bold text-midnight-text">
                            {/*{algorithm.comments.lenght}*/}96 comments
                        </div>

                        <div id="own-comment" className="flex flex-col w-full pb-5 gap-2">
                            <input 
                            type="text" placeholder="Write a comment..."
                            className="w-full h-full text-sm bg-midnight-opacity rounded-sm p-2 text-midnight-text placeholder:text-midnight-text border-t-0 border-l-0 border-r-0"/>

                            <div id="button" className="flex flex-row justify-end w-full gap-2 text-midnight-text">
                                <button className="flex justify-center items-center rounded-md px-5 hover:bg-midnight-opacity
                                    transition ease-in-out duration-300">
                                        Cancel
                                </button>
                                <button className="flex justify-center text-white bg-midnight-purple-shadow items-center rounded-md px-5 py-2
                                    transition ease-in-out duration-300">
                                        Post a comment
                                </button>
                            </div>
                        </div>

                        {/* Comment list */}
                        <div id="comment-list" className="flex flex-col justify-start items-start w-full gap-2">
                            {
                                Array.from({ length: 10 }, (_, index) => (
                                    <Comment key={index} comment={
                                        {
                                            image: "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84527d8f19d83899b2e76a33aa",
                                            body : "Amazing implementation! The way the patterns evolve is truly fascinating. Great job on optimizing the performance as well."
                                        }
                                    }/>
                                ))
                            }
                        </div>
                    </div>

                </div>

                <div id="parameters" className="flex flex-col h-full w-1/5 gap-5">
                    
                    <div id="parameters-container" className="flex flex-col w-full h-full gap-2 p-4 rounded-md overflow-hidden bg-midnight-opacity shadow-md shadow-midnight-purple-shadow">
                        <div id="title" className="flex flex-row justify-start w-full text-xl font-bold text-midnight-text">
                            Parameters
                        </div>
                        <div id="parameters-list" className="flex flex-col justify-start items-start w-full gap-2 text-sm font-bold text-midnight-text">
                            {

                            }
                        </div>
                    </div>

                    <button id="download" className="flex justify-center items-center text-white bg-midnight-purple-shadow rounded-md px-5 py-2
                        transition ease-in-out duration-300 hover:bg-midnight-purple">
                        Download
                    </button>

                </div>
            </div>

        </div>
    );
};

export default Informations;