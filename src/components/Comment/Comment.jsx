import React, { useContext, useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { UserContext } from "../../contexts/UserContext.jsx";
import { formatDistance } from "date-fns";
import MoreVertIcon from '@mui/icons-material/MoreVert';

const Comment = ({ comment, reply, onDelete }) => {
    const [isResponsesLoaded, setIsResponsesLoaded] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { userData } = useContext(UserContext);
    
    return (
        <div className="relative flex flex-col w-full gap-2 p-2 rounded-md">
            <div id="author" className="flex flex-row justify-start w-full gap-2 text-sm font-bold text-textAlt">
                {
                    comment.image ?
                        <img src={comment.image} alt="Author" className="h-10 w-10 rounded-full"/>
                        :
                        <div className="h-10 w-10 rounded-full bg-primary"></div>
                }

                <div className="flex flex-row pt-4 gap-3">
                    <h1 className="text-md text-text">{comment.posted_by.username}</h1>
                    <p className="text-sm text-textAlt">{formatDistance(new Date(comment.inserted_at), new Date(), { addSuffix: true })}</p>
                </div>
            </div>

            <div id="text" className="flex flex-row justify-start items-start w-fit text-sm font-bold text-text overflow-hidden text-justify ml-12">
                {comment.contents}
            </div>

            <div className="absolute left-7 -translate-x-0.5 w-1 h-full bg-secondary rounded-sm -z-10"></div>

            {/* Icon button for comment options */}
            <div className="absolute flex h-full right-0 -top-0.5 justify-center items-center">
                <IconButton 
                    size="large"
                    onClick={(e) => {   
                        setIsMenuOpen(true)
                        setAnchorEl(e.currentTarget)
                    }}
                    disabled={comment.posted_by.user_id !== userData.user_id}
                >
                    <MoreVertIcon 
                        sx={{
                            color: comment.posted_by.user_id === userData.user_id ? "var(--color-primary)" : "var(--color-text-alt)",
                        }}                        
                    />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={isMenuOpen}
                    onClose={() => setIsMenuOpen(false)}
                    slotProps={{
                        list: {
                            className: "bg-background text-text",
                        }
                    }}
                >
                    <MenuItem onClick={() => {
                        setIsMenuOpen(false);
                        onDelete(comment.id);
                    }}>
                        Delete Comment
                    </MenuItem>
                </Menu>
            </div>

            {/* <div id="reaction" className="w-full flex flex-row justify-start items-center gap-2 text-sm font-bold text-midnight-text">
                <button id="comment-like" className="flex flex-row items-center rounded-md hover:bg-midnight transition ease-in-out duration-300 h-10 p-2 gap-2">
                    <img src={like} alt="Like" className="h-7 w-7"/>
                    <p>80</p>
                </button>
                <button id="comment-dislike" className="flex flex-row items-center rounded-md hover:bg-midnight transition ease-in-out duration-300 h-10 p-2 gap-2">
                    <img src={dislike} alt="Dislike" className="h-7 w-7"/>
                    <p>40</p>
                </button>
                {
                    reply === true ? null :
                        <button id="reply" className="flex flex-row items-center rounded-md hover:bg-midnight transition ease-in-out duration-300 h-10 p-2 gap-2">
                            <p>Reply</p>
                        </button>
                }
            </div> */}
            
            {/* {
                reply === true ? null :
                    <div id="responses" className="flex flex-col w-full gap-2 text-sm font-bold text-primary">
                        <button className="flex items-center w-fit rounded-md hover:bg-midnight transition ease-in-out duration-300 h-10 p-2"
                            onClick={() => setIsResponsesLoaded(!isResponsesLoaded)}>
                            <p>{isResponsesLoaded ? "Hide" : "Show"} responses</p>
                        </button>

                        {
                            isResponsesLoaded ? 
                                <div className="flex flex-col justify-start items-start w-full gap-1 pl-10">
                                    {
                                        Array.from({ length: 2 }, (_, index) => (
                                            <Comment key={index} comment={{
                                                image: "https://pm1.aminoapps.com/6345/3d8435d54fd004428acc744f3f18d8427b22c790_00.jpg",
                                                body: "While the implementation is decent, I've seen better. The pattern evolution is somewhat interesting, but it's nothing groundbreaking. As for performance, it's okay, but there's definitely room for improvement, especially with larger datasets. It's a good start, but don't get too excited."
                                            }} 
                                            reply={true}/>
                                        ))
                                    }
                                </div> : null
                        } 
                    </div>
            } */}
        </div>
    );
};

export default Comment;