import React, { useState, useEffect, useContext } from "react";
import close from "../../../assets/images/close.svg";
import like from "../../../assets/images/like.svg";
import dislike from "../../../assets/images/dislike.svg";
import view from "../../../assets/images/view.svg";
import download from "../../../assets/images/download.svg";
import Comment from "../Comment/Comment.jsx";
import spinner from "../../../assets/images/spinner.svg";
import VisualSelector from "../VisualSelector/VisualSelector.jsx";

import { UserContext } from "../../contexts/UserContext.jsx";
import { APIContext } from "../../contexts/APIContext.jsx";
import { SimulationContext } from "../../contexts/SimulationContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Chip, Tooltip, Dialog } from "@mui/material";
import axios from "axios";


const Informations = ({algorithm, onCloseCallback}) => {
    const [isAlgorithmPresent, setIsAlgorithmPresent] = useState(false);
    const [isCommentFetchComplete, setIsCommentFetchComplete] = useState(false);
    const [comments, setComments] = useState([]);
    const [isAlgorithmInstalled, setIsAlgorithmInstalled] = useState(false);
    const [image, setImage] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { userData, loggedIn } = useContext(UserContext);
    const { addAlgorithmComment, getAlgorithmComments, downloadAlgorithm, downloadVisual } = useContext(APIContext);
    const { setSelectedAlgorithm } = useContext(SimulationContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (algorithm !== null && algorithm !== undefined && Object.keys(algorithm).length !== 0) {
            setIsAlgorithmPresent(true);
            fetchComments();
            if (algorithm.image && algorithm.image.length > 0) {
                setImage(`data:image/png;base64,${algorithm.image[0].contents_binary}`);
            } else {
                setImage("https://asset.gecdesigns.com/img/background-templates/gradient-triangle-abstract-background-template-10032405-1710079376651-cover.webp");
            }  
        } else {
            setIsAlgorithmPresent(false);
        }
        window.electron.isAlgorithmInstalled([algorithm.automaton_id]).then((isInstalled) => {
            if (isInstalled) {
                setIsAlgorithmInstalled(true);
            } else {
                setIsAlgorithmInstalled(false);
            }
        });
    }, [algorithm]);

    const resetScroll = () => {
        const algorithmContainer = document.getElementById("algorithm");
        if (algorithmContainer) {
            setTimeout(() => {
                algorithmContainer.scrollTo(0, 0);
            }, 200);
        }
    };

    const fetchComments = () => {
        getAlgorithmComments(algorithm.automaton_id)
            .then((fetchedComments) => {
                setComments(fetchedComments);
                setIsCommentFetchComplete(true);
            })
            .catch((error) => {
                console.error("Error fetching comments:", error);
                toast.error("Failed to fetch comments.");
            });
    };

    const onSubmitComment = (formData) => {
        const commentData = {
            automaton_comment : {
                posted_by: userData.user_id,
                automaton_id: algorithm.automaton_id,
                contents: formData.get("comment")
            }
        };

        // Call the API to add the comment
        addAlgorithmComment(commentData)
            .then((response) => {
                // Reset the form
                document.getElementById("own-comment").reset();
                fetchComments();

            })
            .catch((error) => {
                console.error("Error adding comment:", error);
            });

    }

    const handleDownloadVisual = async (visual) => {
        toast.info(`Downloading visual "${visual.name}". This may take a while...`);
        try {
            const visualLink = await downloadVisual(visual.visualUrl);
            console.log("Visual download link:", visualLink);
            await window.electron.installVisual(visualLink, visual);
        } catch (error) {
            console.error("Error downloading visual:", error);
        }
    };

    const handleLaunchAlgorithm = async (visual) => {
        setSelectedAlgorithm(algorithm);
        const isInstalled = await window.electron.isVisualInstalled(visual.id);
        console.log("Launching algorithm with visual:", visual);
        if (!isInstalled) {
            console.log("Visual not installed, downloading...");
            await handleDownloadVisual(visual);
        }
        navigate('/Playground', { state: { 
            algorithm: algorithm,
            visual : visual
            }
        });
    };

    const handleVisualization = () => {
        setIsDialogOpen(true);
    };

    const handleDownloadAlgorithm = async () => {
        try {
            const response = await downloadAlgorithm(algorithm.assets_link);
            setIsAlgorithmInstalled(true);

            await window.electron.installPlugin(response, algorithm);
            window.electron.isAlgorithmInstalled([algorithm.automaton_id]).then((isInstalled) => {
            if (isInstalled) {
                setIsAlgorithmInstalled(true);
                toast.success("Algorithm installed successfully!");
            } else {
                setIsAlgorithmInstalled(false);
            }
        })
        } catch (error) {
            console.error("Error downloading algorithm:", error);
            toast.error("An error occurred while downloading the algorithm.");
        }
    }

    return (
        <div id="container" className="flex flex-col max-h-screen min-h-screen w-full relative bg-midnight p-5 z-50">

            {/* CLOSE BUTTON */}
            <button 
                className="fixed flex bg-midnight rounded-full grow-0
                    shrink-0 shadow-md shadow-midnight-purple-shadow h-10 w-10 items-center p-1
                    top-10 left-25 hover:bg-midnight-purple
                    transition ease-in-out duration-300"
                     onClick={() => {onCloseCallback(), resetScroll()}}>
                <img src={close} alt="Close" className="h-10 w-10"/>
            </button>

            <div id="information-container" className="flex flex-row justify-center w-full h-full gap-5 p-4 scroll-smooth">
                <div id="algorithm" className="h-full w-4/5 px-5 gap-5 overflow-y-scroll">

                    <div id="algorithm-infos" className="flex flex-col justify-center items-center w-full gap-10 p-4 rounded-md overflow-hidden bg-midnight-opacity shadow-md shadow-midnight-purple-shadow mb-5">
                        <div id={"image-container"} className="flex flex-col justify-center items-center w-full h-3/5 gap-3 transition ease-in-out duration-150 overflow-hidden">
                            <img src={image} alt="Algorithm" className="h-full w-full object-cover z-50"/>
                        </div>

                        <div id="title" className="flex flex-row w-full text-4xl font-bold text-midnight-text">
                            <p className="w-full">
                                {algorithm.name}
                            </p>

                            {/* <div id="algorithm-like" className="flex flex-row w-full justify-end gap-2 text-sm font-bold text-midnight-text">
                                <button id="algorithm-dislike" className="flex flex-row items-center rounded-md hover:bg-midnight transition ease-in-out duration-300 h-10 p-2 gap-2">
                                    <img src={like} alt="Like" className="h-7 w-7"/>
                                    <p>1k</p>
                                </button>
                                <button id="algorithm-dislike" className="flex flex-row items-center rounded-md hover:bg-midnight transition ease-in-out duration-300 h-10 p-2 gap-2">
                                    <img src={dislike} alt="Dislike" className="h-7 w-7"/>
                                    <p>3</p>
                                </button>
                            </div> */}

                        </div>

                        {/* <div id="statistics" className="flex flex-row justify-start w-full text-sm font-bold text-midnight-text gap-4">
                            <div id="view" className="flex flex-row justify-center items-center gap-1">
                                <img src={view} alt="View" className="h-7 w-7"/>
                                <p>2k{algorithm.view}</p>
                            </div>
                            <div id="download" className="flex flex-row justify-center items-center gap-1">
                                <img src={download} alt="Download" className="h-7 w-7"/>
                                <p>898{algorithm.download}</p>
                            </div>
                        </div> */}

                        <div id="tags" className="flex flex-row justify-start w-full font-bold text-midnight-text gap-2 pb-2">
                            {
                                isAlgorithmPresent && algorithm.tags.map((tag) => (
                                    <Tooltip key={tag.tag_id} title={tag.tag_description} placement="bottom" arrow>
                                        <Chip 
                                            label={tag.tag_name} size="small" variant="filled"
                                            sx={{backgroundColor: "#7F6EEE", color: "white", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold"}}
                                        />
                                    </Tooltip>
                                ))
                            }
                        </div>
                        
                        <div id="description" className="flex flex-row justify-start w-full h-fit text-sm font-bold text-midnight-text text-justify pb-5">
                            {algorithm.description}
                        </div>

                    </div>

                    <div id="comments" className="flex flex-col justify-center items-center w-full gap-2 p-4 rounded-md overflow-hidden bg-midnight-opacity shadow-md shadow-midnight-purple-shadow mb-5">
                        <div id="comment-title" className="flex flex-row justify-start w-full text-2xl font-bold text-midnight-text">
                            {comments.length} Comments
                        </div>

                        {
                            loggedIn ?
                                <form id="own-comment" className="relative flex flex-col w-full pb-5 gap-2" 
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.target);
                                        onSubmitComment(formData);
                                    }}>
                                    <input 
                                    type="text" placeholder="Write a comment..." name="comment"
                                    className="w-full h-full text-sm bg-midnight-opacity rounded-sm p-2 text-midnight-text placeholder:text-midnight-text border-t-0 border-l-0 border-r-0"/>

                                    <div id="button" className="flex flex-row justify-end w-full gap-2 text-midnight-text">
                                        <button className="flex justify-center text-white bg-midnight-purple-shadow items-center rounded-md px-5 py-2
                                            transition ease-in-out duration-300">
                                                Post a comment
                                        </button>
                                    </div>
                                </form>
                            :
                            null
                        }


                        {/* Comment list */}
                        <div id="comment-list" className="flex flex-col justify-start items-start w-full gap-2">
                            {
                                !isCommentFetchComplete ? 
                                    <div id="loading-spinner" className="flex h-full w-full justify-center items-center">
                                        <img src={spinner} alt="Loading..." className="animate-spin size-10" />
                                    </div>
                                    :
                                    <div id="results" className="flex flex-row flex-wrap gap-x-8 gap-y-4 h-full w-full p-5 max-w-full font-mono justify-center overflow-y-auto">
                                        {comments.map((comment) => {
                                            return (
                                                <Comment key={comment.id} comment={comment} />
                                            )
                                        })}
                                    </div>
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
                                algorithm.contents
                            }
                        </div>
                    </div>
                    {
                        isAlgorithmInstalled ?
                            <div className="flex flex-row w-full h-fit gap-2 overflow-hidden">
                                <button onClick={handleVisualization} id="install" className="flex w-full justify-center items-center text-white bg-midnight-purple-shadow rounded-md px-5 py-2
                                    transition ease-in-out duration-300 hover:bg-midnight-purple">
                                    Choose visualization
                                </button>
                                {/* <button onClick={() => {handleUninstallAlgorithm}} id="uninstall" className="flex w-full justify-center items-center text-white bg-midnight-red rounded-md px-5 py-2
                                    transition ease-in-out duration-300 hover:bg-midnight-red hover:opacity-80">
                                    Uninstall
                                </button> */}
                            </div>
                            :
                            <button onClick={handleDownloadAlgorithm} id="download" className="flex justify-center items-center text-white bg-midnight-purple-shadow rounded-md px-5 py-2
                                transition ease-in-out duration-300 hover:bg-midnight-purple">
                                Download
                            </button>
                    }

                </div>
            </div>
        
            <Dialog 
                open={isDialogOpen} onClose={() => setIsDialogOpen(false)}
                maxWidth="md" fullWidth>
                    <VisualSelector onSelect={handleLaunchAlgorithm} />
            </Dialog>

        </div>
    );
};

export default Informations;