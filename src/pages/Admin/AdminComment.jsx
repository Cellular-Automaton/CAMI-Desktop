import React, {useState, useEffect} from "react";
import { Avatar, Card, CardActionArea, CardContent, Dialog, Divider, TextField } from "@mui/material";

export default function AdminComment({ closeCallback }) {
    const [comments, setComments] = useState([]);
    const [selectedComment, setSelectedComment] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredComments, setFilteredComments] = useState([]);

    const getComments = () => {
        // Fetch all comments from the backend (not implemented)
        // Temporarily give fake data
        for (let i = 0; i < 29; i++) {
            setComments(prevComments => [...prevComments, { id: i, user: `User ${i + 1}`, content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur malesuada, urna vitae iaculis finibus, enim dolor posuere eros, at pretium nulla urna sed ante. ${i + 1}` }]);
        }
    }

    useEffect(() => {
        getComments();
    }, []);

    useEffect(() => {
        setFilteredComments(comments.filter(comment => comment.content.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, comments]);

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
                    filteredComments.map((comment) => (
                        <Card key={comment.id} className="!bg-midnight-opacity !text-white !h-1/6 !w-1/3">
                            <CardActionArea onClick={() => setSelectedComment(comment)}>
                                <CardContent>
                                    <div className="m-5 h-full w-full flex flex-col">
                                        <h3 className="text-lg font-bold mb-2">{comment.user}</h3>
                                        <p className="text-ellipsis overflow-hidden">{comment.content}</p>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))
                }
            </div>

            <Dialog open={selectedComment !== null} onClose={() => setSelectedComment(null)} maxWidth="sm" fullWidth>
                <div className="bg-midnight p-5 flex flex-col">
                    <div className="bg-midnight p-5 flex flex-row">
                        <div className="flex flex-col items-center mr-10">
                            <Avatar className="!w-20 !h-20 !mb-5 !self-center" />
                            <p className="text-white">ID: {selectedComment === null ? "" : selectedComment.id}</p>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <p className=" text-white mb-4 text-left">{selectedComment === null ? "" : selectedComment.user}</p>
                            <p className=" text-white mb-4 text-left">{selectedComment === null ? "" : selectedComment.content}</p>
                        </div>
                    </div>
                    <div className="flex flex-row-reverse gap-5">
                        {/* More user details and management options would go here */}
                        <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end"
                            onClick={() => setSelectedComment(null)}>
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
