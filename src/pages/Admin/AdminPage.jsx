import React, {useEffect, useState, useContext} from "react";
import { Card, CardContent, Divider } from "@mui/material";
import { Skeleton } from "@mui/material";

import AdminUser from "./AdminUser.jsx";
import AdminAlgorithm from "./AdminAlgorithm.jsx";
import AdminComment from "./AdminComment.jsx";
import { APIContext } from "../../contexts/APIContext.jsx";
import { formatDistance } from "date-fns";

export default function AdminPage() {
    const [type, setType] = useState("");
    const [fiveLastUsers, setFiveLastUsers] = useState([]);
    const [fiveLastAlgorithms, setFiveLastAlgorithms] = useState([]);
    const [fiveLastComments, setFiveLastComments] = useState([]);
    const { getLastestUsers, getLastestAlgorithms, getLastestComments } = useContext(APIContext);

    useEffect(() => {
        getLatest();
    }, []);

    const getLatest = () => {
        getLastestUsers().then(fetchedUsers => {
            console.log("Fetched last 5 users from API:", fetchedUsers);
            setFiveLastUsers(fetchedUsers);
        }).catch(err => {
            console.error("Failed to fetch last 5 users:", err);
        });

        getLastestAlgorithms().then(fetchedAlgorithms => {
            console.log("Fetched last 5 algorithms from API:", fetchedAlgorithms);
            setFiveLastAlgorithms(fetchedAlgorithms);
            console.log("Set last 5 algorithms state to:", fetchedAlgorithms);
        }).catch(err => {
            console.error("Failed to fetch last 5 algorithms:", err);
        });

        getLastestComments().then(fetchedComments => {
            console.log("Fetched last 5 comments from API:", fetchedComments);
            setFiveLastComments(fetchedComments);
        }).catch(err => {
            console.error("Failed to fetch last 5 comments:", err);
        });
    }

    const openAdminPopup = (type) => {
        const popup = document.getElementById("admin-popup");

        console.log("Before");
        setType(type);
        popup.classList.add("bottom-0");
        popup.classList.remove("bottom-full");
        console.log("After");
    }

    const closeAdminPopup = () => {
        const popup = document.getElementById("admin-popup");
        getLatest();

        popup.classList.remove("bottom-0");
        popup.classList.add("bottom-full");
    }

    const renderPopupContent = (type) => {
        switch (type) {
            case "user":
                return <AdminUser closeCallback={closeAdminPopup} />;
            case "algorithm":
                return <AdminAlgorithm closeCallback={closeAdminPopup} />;
            case "comment":
                return <AdminComment closeCallback={closeAdminPopup} />;
            default:
                return null;
        }
    }

    return (
        <div className="bg-midnight h-full w-full overflow-hidden font-mono py-10 px-5 justify-center items-center flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-4">Admin Page</h1>
            <p className="text-white">Welcome to the admin page. Here you can manage the application settings and user accounts.</p>

            <div id="admin-select-controls" className="mt-10 flex flex-row gap-4 w-full h-full">
                <button className="flex flex-col p-5 w-full h-full shadow-sm shadow-midnight-purple-shadow text-white rounded-lg"
                    onClick={() => openAdminPopup("user")}>
                    <h2 className="text-lg mb-2 font-bold">User Management</h2>
                    <span className="text-sm opacity-70">Manage user accounts and permissions</span>
                    <Divider sx={{ my: 1, backgroundColor: 'white', height: '1px' }} flexItem className="!my-5" />
                    <span className="text-sm opacity-70">Last users :</span>

                    <div className="flex flex-col overflow-y-auto h-full w-full px-5 mt-5 gap-5">
                        {
                            fiveLastUsers === undefined || fiveLastUsers.length === 0 ? (
                                <p className="flex flex-col justify-center text-white h-full items-center">No users found.</p>
                            ) : (
                                fiveLastUsers.map((user) => (
                                    <Card key={user.user_id} sx={{ height: '100px' }} className="flex flex-row justify-between items-center !bg-midnight-opacity !text-white">
                                        <CardContent className="flex flex-col items-start text-left">
                                            <p className="text-lg font-bold w-full">{user.username}</p>
                                            <p className="text-sm opacity-70 w-full">{user.user_id}</p>
                                        </CardContent>
                                    </Card>
                                ))
                            )
                        }
                    </div>
                </button>
                <button className="flex flex-col p-5 w-full h-full shadow-sm shadow-midnight-purple-shadow text-white rounded-lg"
                    onClick={() => openAdminPopup("algorithm")}>
                    <h2 className="text-lg mb-2 font-bold">Algorithm Management</h2>
                    <span className="text-sm opacity-70">Manage algorithms and their configurations</span>
                    <Divider sx={{ my: 1, backgroundColor: 'white', height: '1px' }} flexItem className="!my-5" />
                    <span className="text-sm opacity-70">Last algorithms :</span>

                    <div className="flex flex-col overflow-y-auto h-full w-full px-5 mt-5 gap-5">
                        {
                            fiveLastAlgorithms === undefined || fiveLastAlgorithms.length === 0 ? (
                                <p className="flex flex-col justify-center text-white h-full items-center">No algorithms found.</p>
                            ) : (
                                fiveLastAlgorithms.map((algorithm) => (
                                    <Card key={algorithm.automaton_id} sx={{ height: '100px' }} className="flex flex-row justify-between items-center !bg-midnight-opacity !text-white">
                                        <CardContent className="flex flex-col items-start text-left">
                                            <p className="text-lg font-bold w-full">{algorithm.name}</p>
                                            <p className="text-sm opacity-70 w-full">{algorithm.automaton_id}</p>
                                        </CardContent>
                                    </Card>
                                ))
                            )
                        }
                    </div>

                </button>
                <button className="flex flex-col p-5 w-full h-full shadow-sm shadow-midnight-purple-shadow text-white rounded-lg"
                    onClick={() => openAdminPopup("comment")}>
                    <h2 className="text-lg mb-2 font-bold">Comment Management</h2>
                    <span className="text-sm opacity-70">Manage user comments and feedback</span>
                    <Divider sx={{ my: 1, backgroundColor: 'white', height: '1px' }} flexItem className="!my-5" />
                    <span className="text-sm opacity-70">Last comments :</span>

                    <div className="flex flex-col overflow-y-auto h-full w-full px-5 mt-5 gap-5">
                        {
                            fiveLastComments === undefined || fiveLastComments.length === 0 ? (
                                <p className="flex flex-col justify-center text-white h-full items-center">No comments found.</p>
                            ) : (
                                fiveLastComments.map((comment) => (
                                    <Card key={comment.id} sx={{ height: '100px' }} className="flex flex-row justify-between items-center !bg-midnight-opacity !text-white">
                                        <CardContent className="flex flex-col items-start text-left">
                                            <p className="text-lg font-bold w-full overflow-hidden text-ellipsis truncate">{comment.contents}</p>
                                            <p className="text-sm opacity-70 w-full">{comment.id}</p>
                                        </CardContent>
                                    </Card>
                                ))
                            )
                        }
                    </div>
                </button>
            </div>

            {/* ADMIN PAGE POPUP */}
            <div id="admin-popup" className="fixed bottom-full w-full h-full bg-black bg-opacity-50 justify-center items-center flex transition-all duration-300">
                { renderPopupContent(type) }
            </div>
        </div>
    );
}