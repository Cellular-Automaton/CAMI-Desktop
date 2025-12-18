import React, {useState, useEffect, useContext} from "react";
import { Avatar, Card, CardActionArea, CardContent, Dialog, Divider, TextField } from "@mui/material";
import { formatDistance } from "date-fns";

import { APIContext } from "../../contexts/APIContext.jsx";

export default function AdminComment({ closeCallback }) {
    const [comments, setComments] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredComments, setFilteredComments] = useState([]);
    const [userName, setUserName] = useState("");
    const [algorithmName, setAlgorithmName] = useState("");
    const [isValidationOpen, setIsValidationOpen] = useState(false);

    const { getAllComments, getAlgorithmById, getUserById, deleteComment } = useContext(APIContext);

    const getComments = () => {

        getAllComments().then(fetchedComments => {
            setComments(fetchedComments);
            setFilteredComments(fetchedComments);
            
        }).catch(err => {
            console.error("Failed to fetch comments:", err);
        });
    }

    const getUserName = (userId) => {
        getUserById(userId).then(user => {
            
            setUserName(user.data.username);
        });
    }

    const getAlgorithmName = (algId) => {
        getAlgorithmById(algId).then(alg => {
            
            if (alg !== undefined) {
                setAlgorithmName(alg.data.name);
            }
        });
    }

    useEffect(() => {
        getComments();
    }, []);

    useEffect(() => {
        setFilteredComments(comments.filter(comment => comment.contents.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, comments]);

    const getDetails = (userId, algId) => {
        getUserName(userId);
        getAlgorithmName(algId);
    }

    const handleDeleteComment = (commentId) => {
        deleteComment(commentId).then(() => {
            setComments(comments.filter(comment => comment.id !== commentId));
            setFilteredComments(filteredComments.filter(comment => comment.id !== commentId));
            setSelectedComment(null);
            setIsValidationOpen(false);
        }).catch(err => {
            console.error("Failed to delete comment:", err);
        });
    }

    return (
        <div className="bg-background w-full h-full pt-10 px-10 flex flex-col">
            <div className="px-5">
                <h2 className="text-2xl font-bold text-text mb-4">Comment Management</h2>
                <p className="text-text">Here you can manage the comments made by users.</p>
            </div>

            <Divider sx={{ my: 2, backgroundColor: 'var(--color-text-alt)', height: '1px' }} flexItem />

            {/* List of all comments of the application */}

            <div className="w-full flex flex-row justify-center">
                <TextField label="Search Comments" variant="outlined" className="!w-1/5 !rounded-sm"
                    sx={{ 
                        input: { color: 'var(--color-text)', backgroundColor: 'var(--color-background-alt)' },
                        label: { color: 'var(--color-text-alt)' },
                        fieldset: { borderColor: 'var(--color-text-alt)' }
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-row flex-wrap mt-5 overflow-y-auto h-full w-full py-10 gap-5 items-center justify-center">

                {
                    filteredComments.length === 0 ? (
                        <p className="text-text">No comments found.</p>
                    ) : (
                        filteredComments.map((comment) => (
                            <Card key={comment.id} className="
                                !bg-backgroundAlt !text-text !h-fit !w-1/3 overflow-y-hidden text-ellipsis
                                hover:scale-105 hover:ring-4 hover:ring-primary !transition-all duration-200
                                focus-within:scale-105 focus-within:ring-4 focus-within:ring-primary
                            ">
                                <CardActionArea className="!h-fit" onClick={() => {
                                    setSelectedComment(comment);
                                    getDetails(comment.posted_by, comment.automaton_id);
                                }}>
                                <CardContent>
                                    <div className="h-fit w-full flex flex-col">
                                        <p className="text-sm">Posted by: {comment.posted_by}</p>
                                        <p className="text-textAlt text-sm mb-2">{formatDistance(new Date(comment.inserted_at), new Date(), { addSuffix: true })}</p>
                                        <p className="text-ellipsis overflow-hidden">{comment.contents}</p>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))
                )
            }
            </div>

            <Dialog open={selectedComment !== null} onClose={() => setSelectedComment(null)} maxWidth="sm" fullWidth>
                <div className="bg-background p-5 flex flex-col">
                    <div className="p-5 flex flex-col">
                        <p className=" text-textAlt text-left">User : <span>{selectedComment === null ? "" : userName}</span></p>
                        <p className=" text-textAlt text-left">Automaton : <span>{selectedComment === null ? "" : algorithmName}</span></p>
                        <p className="text-textAlt text-left">Comment ID: {selectedComment === null ? "" : selectedComment.id}</p>
                        <p className=" text-text my-5 text-left text-xl">{selectedComment === null ? "" : selectedComment.contents}</p>
                    </div>
                    <div className="flex flex-row-reverse gap-5">
                        {/* More user details and management options would go here */}
                        <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end"
                            onClick={() => setIsValidationOpen(true)}>
                            Delete
                        </button>
                    </div>
                </div>
            </Dialog>

            <Dialog open={isValidationOpen} onClose={() => setIsValidationOpen(false)} className="flex flex-col p-5">
                <div className="bg-background p-5 flex flex-col text-white font-mono">
                    <h2 className="text-lg font-bold pb-5">Are you sure to delete this comment?</h2>
                    <div className="flex flex-row-reverse gap-5 mt-5">
                        <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                            onClick={() => handleDeleteComment(selectedComment?.id)}>
                            Yes
                        </button>
                        <button className="mt-5 p-2 bg-primary text-textPrimary rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                            onClick={() => setIsValidationOpen(false)}>
                            No
                        </button>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}
