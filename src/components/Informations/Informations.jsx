import React, { useState, useEffect, useContext, useRef } from "react";
import close from "../../../assets/images/close.svg";
import like from "../../../assets/images/like.svg";
import dislike from "../../../assets/images/dislike.svg";
import view from "../../../assets/images/view.svg";
import download from "../../../assets/images/download.svg";
import Comment from "../Comment/Comment.jsx";
import spinner from "../../../assets/images/spinner.svg";
import { UserContext } from "../../contexts/UserContext.jsx";
import { APIContext } from "../../contexts/APIContext.jsx";
import { SimulationContext } from "../../contexts/SimulationContext.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Chip, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Button, Tooltip, TextField, Menu, MenuItem } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import AddCommentIcon from '@mui/icons-material/AddComment';
import SortIcon from '@mui/icons-material/Sort';


const Informations = ({algorithm, onCloseCallback}) => {
    const [isAlgorithmPresent, setIsAlgorithmPresent] = useState(false);
    const [isCommentFetchComplete, setIsCommentFetchComplete] = useState(false);
    const [comments, setComments] = useState([]);
    const [isAlgorithmInstalled, setIsAlgorithmInstalled] = useState(false);
    const [image, setImage] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortOrder, setSortOrder] = useState('newest');

    const { userData, loggedIn } = useContext(UserContext);
    const { addAlgorithmComment, getAlgorithmComments, downloadAlgorithm, deleteComment } = useContext(APIContext);
    const { setSelectedAlgorithm } = useContext(SimulationContext);

    const algorithmContainerRef = useRef(null);

    const navigate = useNavigate();
    const isMenuOpen = Boolean(anchorEl);

    const sortedComments = [...comments].sort((a, b) => {
        if (sortOrder === 'newest') {
            return new Date(b.inserted_at) - new Date(a.inserted_at);
        } else {
            return new Date(a.inserted_at) - new Date(b.inserted_at);
        }
    });

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

        window.addEventListener('navigate-back', handleNavigateBack);

        return () => {
            window.removeEventListener('navigate-back', handleNavigateBack);
        }
    }, [algorithm]);

    useEffect(() => {
        return () => {
            resetScroll();
            window.dispatchEvent(new CustomEvent('remove-return-button'));
        };
    }, []);

    const handleNavigateBack = () => {
        resetScroll();
        onCloseCallback();
    };

    const resetScroll = () => {
        if (algorithmContainerRef.current) {
            setTimeout(() => {
                algorithmContainerRef.current.scrollTop = 0;
            }, 500);
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
                fetchComments();
            })
            .catch((error) => {
                console.error("Error adding comment:", error);
            });

    }

    const handleLaunchAlgorithm = () => {
        setSelectedAlgorithm(algorithm);
        navigate('/Playground', { state: { algorithm } });
    };

    const handleDownloadAlgorithm = async () => {
        try {
            const response = await downloadAlgorithm(algorithm.assets_link);
            toast.success("Algorithm downloaded successfully!");
            setIsAlgorithmInstalled(true);

            await window.electron.installPlugin(response, algorithm);
            window.electron.isAlgorithmInstalled([algorithm.automaton_id]).then((isInstalled) => {
            if (isInstalled) {
                setIsAlgorithmInstalled(true);
            } else {
                setIsAlgorithmInstalled(false);
            }
        })
        } catch (error) {
            console.error("Error downloading algorithm:", error);
            toast.error("An error occurred while downloading the algorithm.");
        }
    }

    const onTryDeleteComment = async (commentId) => {
        setOpenDialog(true);
        setCommentIdToDelete(commentId);
    }

    const onDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
            toast.error("Failed to delete comment.");
        }
    }

    const handleSortClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleSortClose = () => {
        setAnchorEl(null);
    }

    const handleSortSelect = (order) => {
        setSortOrder(order);
        setAnchorEl(null);
    }

    return (
        <div id="container" ref={algorithmContainerRef} className="flex flex-col overflow-y-auto w-full h-fit relative bg-background pt-10 z-10">

            <div className="px-32">

                <div id="algorithm-information">
                    <div id="algorithm-image" className="relative overflow-hidden rounded-md">
                        <img src={image} alt="Algorithm" className="w-full h-96 object-cover rounded-md"/>
                        <div className="absolute top-0 left-0 z-10 w-full h-96 backdrop-blur-sm bg-gradient-to-t from-background to-transparent"></div>
                    </div>

                    <div id="algorithm-text" className="flex flex-col justify-between items-center mt-5 mb-10">
                        <h1 className="text-4xl w-full text-left mb-5 font-bold text-text">
                            {isAlgorithmPresent ? algorithm.name : "Algorithm Not Found"}
                        </h1>

                        <div className="flex flex-col w-full justify-start">
                            <h2 className="text-lg font-bold mb-2 text-textAlt">Tags:</h2>

                            <div id="tags" className="flex flex-row mb-2 justify-start w-full font-bold text- gap-2 pb-2">
                                {
                                    isAlgorithmPresent && algorithm.tags.map((tag) => (
                                        <Tooltip key={tag.tag_id} title={tag.tag_description} placement="bottom" arrow>
                                            <Chip 
                                                label={tag.tag_name} size="small" variant="filled"
                                                sx={
                                                    {backgroundColor: "var(--color-primary)", color: "var(--color-text-primary)", fontFamily: "'JetBrains Mono', monospace", fontWeight: "bold"}
                                                }
                                            />
                                        </Tooltip>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="flex flex-col w-full justify-start mt-5">
                            <h2 className="text-xl w-full text-left font-bold mb-2 text-textAlt">Description:</h2>
                            <h3 className="text-lg w-full text-left text-textAlt">{isAlgorithmPresent ? algorithm.description : ""}</h3>
                        </div>

                        <div className="flex flex-col w-full justify-start mt-5">
                            <h2 className="text-xl w-full text-left font-bold mb-2 text-textAlt">Parameters:</h2>
                            <h3 className="text-lg w-full text-left text-textAlt">{isAlgorithmPresent ? algorithm.contents : ""}</h3>
                        </div>

                    </div>

                    <div id="algorithm-button" className="flex flex-row gap-5 w-full h-10 mb-10">
                        <Button
                            variant="contained"
                            className="w-1/2"
                            sx={{
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-text-primary)",
                                '&.Mui-disabled': {
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-text-primary)',
                                    opacity: 0.5,
                                },
                            }}
                            disabled={isAlgorithmInstalled}
                            onClick={handleDownloadAlgorithm}
                        >
                            <DownloadIcon sx={{ mr: 1 }} />
                            Download {algorithm.name}
                        </Button>

                        <Button 
                            variant="contained"
                            className="w-1/2"
                            sx={{
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-text-primary)",
                                '&.Mui-disabled': {
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'var(--color-text-primary)',
                                    opacity: 0.5,
                                },
                            }}
                            disabled={!isAlgorithmInstalled}
                            onClick={handleLaunchAlgorithm}
                        >
                            <PlayArrowIcon sx={{ mr: 1 }} />
                            Start {algorithm.name}
                        </Button>
                    </div>
                </div>

                <div id="divider" className="w-full h-px bg-accent mb-5"></div>

                <div id="algorithm-comments" className="flex flex-col w-full h-fit mt-5">
                    <div className="flex flex-row justify-start items-center w-full mb-10 gap-5">
                        <h1 className="flex flex-col text-3xl w-fit items-center text-left font-bold text-text">{comments.length} Comments</h1>

                        <Button
                            variant="text"
                            className="w-48"
                            sx={{ 
                                color: "var(--color-text)",
                                '&:hover': {
                                    backgroundColor: 'var(--color-background-alt)',
                                    color: 'var(--color-primary)',
                                },
                                '&:active': {
                                    backgroundColor: 'var(--color-background-alt)',
                                },
                                '& .MuiTouchRipple-root': {
                                    color: 'var(--color-primary)',
                                }
                            }}
                            onClick={handleSortClick}
                        >
                            <SortIcon sx={{ mr: 1 }} />
                            Sort By: {sortOrder === 'newest' ? ' Newest' : ' Oldest'}
                        </Button>
                        
                        <Menu
                            anchorEl={anchorEl}
                            open={isMenuOpen}
                            onClose={() => handleSortClose()}
                            slotProps={{
                                paper: {
                                    sx: {
                                        width: anchorEl?.offsetWidth || "auto"
                                    }
                                }
                            }}
                            sx={{
                                '& .MuiPaper-root': {
                                    backgroundColor: 'var(--color-background)',
                                    color: 'var(--color-text)',
                                }
                            }}
                        >
                            <MenuItem 
                                onClick={() => handleSortSelect('newest')}
                                selected={sortOrder === 'newest'}
                                sx={{
                                    "&:hover": { 
                                        backgroundColor: 'var(--color-secondary) !important',
                                        color: 'var(--color-text-primary) !important'
                                    },
                                    "&.Mui-selected": { 
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'var(--color-text-primary)'
                                    },
                                    "&.Mui-selected:hover": { 
                                        backgroundColor: 'var(--color-secondary)',
                                        color: 'var(--color-text-primary)'
                                    }
                                }}
                            >
                                Newest
                            </MenuItem>
                            <MenuItem 
                                onClick={() => handleSortSelect('oldest')}
                                selected={sortOrder === 'oldest'}
                                sx={{
                                    "&:hover": { 
                                        backgroundColor: 'var(--color-secondary) !important',
                                        color: 'var(--color-text-primary) !important'
                                    },
                                    "&.Mui-selected": { 
                                        backgroundColor: 'var(--color-primary)',
                                        color: 'var(--color-text-primary)'
                                    },
                                    "&.Mui-selected:hover": { 
                                        backgroundColor: 'var(--color-secondary)',
                                        color: 'var(--color-text-primary)'
                                    }
                                }}
                            >
                                Oldest
                            </MenuItem>
                        </Menu>
                    </div>

                    <div id="comment-posting" className="flex flex-col w-full mb-5">
                        <form 
                            className="w-full"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                e.target.reset();
                                onSubmitComment(formData);
                            }}
                        >
                            <div className="w-full mb-2">
                                <TextField
                                    variant="standard"
                                    name="comment"
                                    placeholder="Add a comment..."
                                    className="w-full"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            color: 'var(--color-text)',
                                            '&::placeholder': {
                                                color: 'var(--color-text-alt)',
                                                opacity: 0.7,
                                            }
                                        },
                                        '& .MuiInput-underline:before': {
                                            borderBottomColor: 'var(--color-text-alt)',
                                        },
                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                            borderBottomColor: 'var(--color-primary)',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottomColor: 'var(--color-primary)',
                                        },
                                    }}
                                />
                            </div>

                            <div className="flex flex-row w-full mb-2 justify-end">
                                <Button
                                    sx={{
                                        backgroundColor: "var(--color-primary)",
                                        color: "var(--color-text-primary)",
                                        '&.Mui-disabled': {
                                            backgroundColor: 'var(--color-primary)',
                                            color: 'var(--color-text-primary)',
                                            opacity: 0.5,
                                        },
                                    }}
                                    variant="contained"
                                    type="submit"
                                >
                                    <AddCommentIcon sx={{ mr: 1 }} />
                                    Post Comment
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div id="all-comments" className="flex flex-col w-full gap-5 mb-10">
                        {
                            !isCommentFetchComplete ? 
                                <div id="loading-spinner" className="flex h-full w-full justify-center items-center">
                                    <img src={spinner} alt="Loading..." className="animate-spin size-10" />
                                </div>
                            :
                                <div id="results" className="flex flex-row flex-wrap gap-10 h-fit w-full p-5 font-mono justify-center">
                                    {sortedComments.map((comment) => {
                                        return (
                                            <Comment key={comment.id} comment={comment} onDelete={onTryDeleteComment} />
                                        )
                                    })}
                                </div>
                        }
                    </div>
                </div>
            </div>

            {/* Diakog for confirm if user want to delete a comment */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                slotProps={{
                    paper: {
                        className: "!bg-background !text-text",
                    }
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle className="!text-text">Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText className="!text-textAlt">
                        Are you sure you want to delete this comment?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        variant="text"
                        sx={{
                            color: "var(--color-text)",
                            '&:hover': {
                                backgroundColor: 'var(--color-background-alt)',
                                color: 'var(--color-primary)',
                            },
                            '&:active': {
                                backgroundColor: 'var(--color-background-alt)',
                            },
                            '& .MuiTouchRipple-root': {
                                color: 'var(--color-primary)',
                            }
                        }}
                        onClick={() => setOpenDialog(false)} color="primary">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={() => {
                        setOpenDialog(false);
                        onDeleteComment(commentIdToDelete);
                    }} color="warning">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Informations;