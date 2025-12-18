import React, {useEffect, useState, useContext} from "react";
import { Card, CardContent, Divider } from "@mui/material";
import { Skeleton } from "@mui/material";

import AdminUser from "./AdminUser.jsx";
import AdminAlgorithm from "./AdminAlgorithm.jsx";
import AdminComment from "./AdminComment.jsx";
import { APIContext } from "../../contexts/APIContext.jsx";
import { formatDistance } from "date-fns";
import { NavigateBackContext } from "../../contexts/NavigateBackContext.jsx";

export default function AdminPage() {
    const [type, setType] = useState("");
    const [fiveLastUsers, setFiveLastUsers] = useState([]);
    const [fiveLastAlgorithms, setFiveLastAlgorithms] = useState([]);
    const [fiveLastComments, setFiveLastComments] = useState([]);
    const [fiveLastVisuals, setFiveLastVisuals] = useState([]);
    const { getLastestUsers, getLastestAlgorithms, getLastestComments } = useContext(APIContext);
    const { showReturnButton, setReturnCallback } = useContext(NavigateBackContext);

    useEffect(() => {
        getLatest();
    }, []);

    const getLatest = () => {
        getLastestUsers().then(fetchedUsers => {
            
            setFiveLastUsers(fetchedUsers);
        }).catch(err => {
            console.error("Failed to fetch last 5 users:", err);
        });

        getLastestAlgorithms().then(fetchedAlgorithms => {
            setFiveLastAlgorithms(fetchedAlgorithms);
        }).catch(err => {
            console.error("Failed to fetch last 5 algorithms:", err);
        });

        getLastestComments().then(fetchedComments => {
            
            setFiveLastComments(fetchedComments);
        }).catch(err => {
            console.error("Failed to fetch last 5 comments:", err);
        });
    }

    const openAdminPopup = (type) => {
        const popup = document.getElementById("admin-popup");

        setType(type);
        popup.classList.add("bottom-0");
        popup.classList.remove("bottom-full");

        showReturnButton();
        setReturnCallback(() => {
            console.log("Closing admin popup from callback");
            closeAdminPopup();
        });
    }

    const closeAdminPopup = () => {
        const popup = document.getElementById("admin-popup");
        getLatest();

        console.log("Closing admin popup");
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
        <div className="bg-background h-full w-full overflow-hidden font-mono py-10 px-5 justify-center items-center flex flex-col">
            <div>
                <h1 className="text-3xl font-bold text-text mb-4">Admin Page</h1>
                <p className="text-textAlt">Welcome to the admin page. Here you can manage the application settings and user accounts.</p>
            </div>

            <div id="admin-select-container" className="flex flex-col mt-10 py-10 px-10 gap-6 w-full h-full overflow-y-scroll">

                <button className="flex flex-col bg-backgroundAlt p-5 w-full h-fit 
                    text-text rounded-lg hover:scale-105 hover:ring-4 hover:ring-primary
                    focus:scale-105 focus:ring-4 focus:ring-primary transition-all duration-200 cursor-pointer" 
                    onClick={() => openAdminPopup("user")}>
                    <h2 className="text-lg mb-2 font-bold">User Management</h2>
                    <span className="text-sm opacity-70">Manage user accounts and permissions</span>
                    <Divider sx={{ my: 1, backgroundColor: 'white', height: '1px' }} flexItem className="!my-5" />
                    <span className="text-sm opacity-70">Last users :</span>
                    <div id="last-users" className="flex flex-row overflow-hidden">

                        {
                            fiveLastUsers === undefined || fiveLastUsers.length === 0 ? (
                                <p className="flex flex-col justify-center text-text h-full items-center">No users found.</p>
                            ) : (
                                fiveLastUsers.map((user) => (
                                    <Card key={user.user_id} sx={{ height: 'fit-content', minWidth: '200px' }} className="flex flex-col justify-between items-start !bg-background !text-text m-2 p-2">
                                        <CardContent className="flex flex-col items-start text-left w-full">
                                            <p className="text-lg text-text font-bold w-full">{user.username}</p>
                                            <p className="text-textAlt text-sm mb-2">{formatDistance(new Date(user.created_at), new Date(), { addSuffix: true })}</p>
                                            <p className="text-xs text-textAlt w-full">{user.user_id}</p>
                                        </CardContent>
                                    </Card>
                                ))
                            )
                        }

                    </div>
                </button>

                <button className="flex flex-col bg-backgroundAlt p-5 w-full h-fit 
                    text-text rounded-lg hover:scale-105 hover:ring-4 hover:ring-primary
                    focus:scale-105 focus:ring-4 focus:ring-primary transition-all duration-200 cursor-pointer" 
                    onClick={() => openAdminPopup("algorithm")}>
                    <h2 className="text-lg mb-2 font-bold">Algorithm Management</h2>
                    <span className="text-sm opacity-70">Manage algorithms and their configurations</span>
                    <Divider sx={{ my: 1, backgroundColor: 'white', height: '1px' }} flexItem className="!my-5" />
                    <span className="text-sm opacity-70">Last algorithms :</span>
                    <div id="last-algorithms" className="flex flex-row overflow-hidden">
                        {
                            fiveLastAlgorithms === undefined || fiveLastAlgorithms.length === 0 ? (
                                <p className="flex flex-col justify-center text-text h-full items-center">No algorithms found.</p>
                            ) : (
                                fiveLastAlgorithms.map((algorithm) => (
                                    <Card key={algorithm.automaton_id} sx={{ height: 'fit-content', minWidth: '200px' }} className="flex flex-col justify-between items-start !bg-background !text-text m-2 p-2">
                                        <CardContent className="flex flex-col items-start text-left w-full">
                                            <p className="text-lg text-text font-bold w-full">{algorithm.name}</p>
                                            <p className="text-sm text-textAlt mb-2 w-full">{algorithm.automaton_id}</p>
                                        </CardContent>
                                    </Card>
                                ))
                            )
                        }
                    </div>
                </button>

                <button className="flex flex-col bg-backgroundAlt p-5 w-full h-fit 
                    text-text rounded-lg hover:scale-105 hover:ring-4 hover:ring-primary
                    focus:scale-105 focus:ring-4 focus:ring-primary transition-all duration-200 cursor-pointer" 
                    onClick={() => openAdminPopup("visual")}>
                    <h2 className="text-lg mb-2 font-bold">Visual Management</h2>
                    <span className="text-sm opacity-70">Manage visuals</span>
                    <Divider sx={{ my: 1, backgroundColor: 'white', height: '1px' }} flexItem className="!my-5" />
                    <span className="text-sm opacity-70">Last visuals :</span>
                    <div id="last-visuals" className="flex flex-row overflow-hidden">
                        {
                            fiveLastVisuals === undefined || fiveLastVisuals.length === 0 ? (
                                <p className="flex flex-col justify-center text-text h-full items-center">No visuals found.</p>
                            ) : (
                                fiveLastVisuals.map((visual) => (
                                    <Card key={visual.automaton_id} sx={{ height: 'fit-content', minWidth: '200px' }} className="flex flex-col justify-between items-start !bg-background !text-text m-2 p-2">
                                        <CardContent className="flex flex-col items-start text-left w-full">
                                            <p className="text-lg text-text font-bold w-full">{visual.name}</p>
                                            <p className="text-sm text-textAlt mb-2 w-full">{visual.automaton_id}</p>
                                        </CardContent>
                                    </Card>
                                ))
                            )
                        }
                    </div>
                </button>

                <button className="flex flex-col bg-backgroundAlt p-5 w-full h-fit 
                    text-text rounded-lg hover:scale-105 hover:ring-4 hover:ring-primary 
                    focus:scale-105 focus:ring-4 focus:ring-primary transition-all duration-200 cursor-pointer"
                    onClick={() => openAdminPopup("comment")}>
                    <h2 className="text-lg mb-2 font-bold">Comment Management</h2>
                    <span className="text-sm opacity-70">Manage user comments and feedback</span>
                    <Divider sx={{ my: 1, backgroundColor: 'white', height: '1px' }} flexItem className="!my-5" />
                    <span className="text-sm opacity-70">Last comments :</span>
                    <div id="last-comments" className="flex flex-row overflow-hidden">
                        {
                            fiveLastComments === undefined || fiveLastComments.length === 0 ? (
                                <p className="flex flex-col justify-center text-text h-full items-center">No comments found.</p>
                            ) : (
                                fiveLastComments.map((comment) => (
                                    <Card key={comment.id} sx={{ height: 'fit-content', minWidth: '200px' }} className="flex flex-col justify-between items-start !bg-background !text-text m-2 p-2">
                                        <CardContent className="flex flex-col items-start text-left w-full">
                                            <p className="text-lg text-text font-bold w-full overflow-hidden text-ellipsis truncate">{comment.contents}</p>
                                            {/* <p className="text-sm text-textAlt mb-2 w-full">{formatDistance(new Date(comment.created_at), new Date(), { addSuffix: true })}</p> */}
                                            <p className="text-xs text-textAlt w-full">{comment.id}</p>
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