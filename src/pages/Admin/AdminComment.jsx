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

    const { getAllComments, getAlgorithmById, getUserById, deleteComment } = useContext(APIContext);

    const getComments = () => {

        getAllComments().then(fetchedComments => {
            setComments(fetchedComments);
            setFilteredComments(fetchedComments);
            console.log("Fetched comments:", fetchedComments);
        }).catch(err => {
            console.error("Failed to fetch comments:", err);
        });
    }

    const getUserName = (userId) => {
        getUserById(userId).then(user => {
            console.log("Fetched user details:", user);
            setUserName(user.data.username);
        });
    }

    const getAlgorithmName = (algId) => {
        getAlgorithmById(algId).then(alg => {
            console.log("Fetched algorithm details:", alg);
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
        }).catch(err => {
            console.error("Failed to delete comment:", err);
        });
    }

    return (
        <div className="bg-midnight w-full h-full p-5 flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4">Comment Management</h2>
            <p className="text-white">Here you can manage the comments made by users.</p>

            <Divider sx={{ my: 2, backgroundColor: 'white', height: '1px' }} flexItem />

            {/* List of all comments of the application */}

            <div className="w-full flex flex-row justify-center">
                <TextField label="Search Comments" variant="outlined" className="!w-1/5 !rounded-sm"
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, fieldset: { borderColor: 'white' } }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-row flex-wrap mt-5 overflow-y-auto h-full w-full px-5 gap-5 items-center justify-center">

                {
                    filteredComments.length === 0 ? (
                        <p className="text-white">No comments found.</p>
                    ) : (
                        filteredComments.map((comment) => (
                            <Card key={comment.id} className="!bg-midnight-opacity !text-white !h-1/6 !w-1/3">
                                <CardActionArea onClick={() => {
                                    setSelectedComment(comment);
                                    getDetails(comment.posted_by, comment.automaton_id);
                                }}>
                                <CardContent>
                                    <div className="h-full w-full flex flex-col">
                                        <p className="text-sm mb-2 opacity-70">{formatDistance(new Date(comment.inserted_at), new Date(), { addSuffix: true })}</p>
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
                <div className="bg-midnight p-5 flex flex-col">
                    <div className="bg-midnight p-5 flex flex-col">
                        <p className=" text-white text-left opacity-70">User : <span>{selectedComment === null ? "" : userName}</span></p>
                        <p className=" text-white text-left opacity-70">Automaton : <span>{selectedComment === null ? "" : algorithmName}</span></p>
                        <p className="text-white text-left opacity-70">Comment ID: {selectedComment === null ? "" : selectedComment.id}</p>
                        <p className=" text-white my-5 text-left text-xl">{selectedComment === null ? "" : selectedComment.contents}</p>
                    </div>
                    <div className="flex flex-row-reverse gap-5">
                        {/* More user details and management options would go here */}
                        <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end"
                            onClick={() => handleDeleteComment(selectedComment.id)}>
                            Delete
                        </button>
                    </div>
                </div>
            </Dialog>

            <div className="w-full flex justify-center">
                <button className="mt-5 p-2 bg-midnight-purple text-white rounded-lg w-32 transition hover:opacity-50 ease-in-out duration-200"
                    onClick={closeCallback}>
                    Close
                </button>
            </div>
        </div>
    );
}
