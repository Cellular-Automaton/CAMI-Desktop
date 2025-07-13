import React, {useState} from "react";
import like from "../../../assets/images/like.svg";
import dislike from "../../../assets/images/dislike.svg";
import { formatDistance } from "date-fns";

const Comment = ({ comment, reply }) => {
    const [isResponsesLoaded, setIsResponsesLoaded] = useState(false);

    const test = () => {
        console.log("Commentaire", comment);
    }
    return (
        <div className="flex flex-col w-full gap-2 p-2">
            <div id="author" className="flex flex-row justify-start items-baseline w-full gap-2 text-sm font-bold text-midnight-text">
                {
                    comment.image ?
                    <img src={comment.image} alt="Author" className="h-10 w-10 rounded-full"/>
                    : <div className="h-10 w-10 rounded-full bg-midnight-purple"></div>
                }
                <p>{comment.posted_by.username}</p>
                <p className="text-xs opacity-80">{formatDistance(new Date(comment.inserted_at), new Date(), { addSuffix: true })}</p>
            </div>

            <div id="text" className="flex flex-row justify-start items-start w-full text-sm font-bold text-midnight-text overflow-hidden text-justify">
                {comment.contents}
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
                    <div id="responses" className="flex flex-col w-full gap-2 text-sm font-bold text-midnight-purple">
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