import React, {useState} from "react";
import { Divider } from "@mui/material";
import { Skeleton } from "@mui/material";

import AdminUser from "./AdminUser.jsx";
import AdminAlgorithm from "./AdminAlgorithm.jsx";
import AdminComment from "./AdminComment.jsx";

export default function AdminPage() {
    const [type, setType] = useState("");
    const [content, setContent] = useState([]);

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

        popup.classList.remove("bottom-0");
        popup.classList.add("bottom-full");
        setContent([]);
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

    const skeletonFactory = () => {
        const skeletons = [];

        for (let i = 0; i < 5; i++) {
            skeletons.push(
                <div key={i} className="flex flex-row gap-2 mt-2 w-full items-center justify-center">
                    <Skeleton variant="circular" animation="wave" width={90} height={80} />
                    <div className="flex flex-col gap-1 w-full">
                        <Skeleton variant="text" animation="wave"/>
                        <Skeleton variant="text" animation="wave"/>
                    </div>
                </div>
            );
        }
        return skeletons;
    }

    return (
        <div className="bg-midnight h-full w-full overflow-hidden font-mono py-10 px-5 justify-center items-center flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-4">Admin Page</h1>
            <p className="text-white">Welcome to the admin page. Here you can manage the application settings and user accounts.</p>

            <div id="admin-select-controls" className="mt-10 flex flex-row gap-4 w-full h-full">
                <button className="flex flex-col p-5 w-full h-full shadow-sm shadow-midnight-purple-shadow text-white rounded-lg"
                    onClick={() => openAdminPopup("user")}>
                    <h2>User Management</h2>
                    <span className="text-sm">Manage user accounts and permissions</span>
                    <Divider sx={{ my: 1, backgroundColor: 'white', height: '1px' }} flexItem />
                    <span className="text-sm">Last users :</span>

                    <div className="flex flex-col overflow-y-auto h-full w-full px-5 mt-5 gap-5">
                        {
                            skeletonFactory()
                        }
                    </div>
                </button>
                <button className="flex flex-col p-5 w-full h-full shadow-sm shadow-midnight-purple-shadow text-white rounded-lg"
                    onClick={() => openAdminPopup("algorithm")}>
                    <h2>Algorithm Management</h2>
                    <span className="text-sm">Add, edit, or remove algorithms</span>
                    <Divider sx={{ my: 1, backgroundColor: 'white', height: '1px' }} flexItem />
                    <span className="text-sm">Last algorithms :</span>

                    <div className="flex flex-col overflow-y-auto h-full w-full px-5 mt-5 gap-5">
                        {
                            skeletonFactory()
                        }
                    </div>

                </button>
                <button className="flex flex-col p-5 w-full h-full shadow-sm shadow-midnight-purple-shadow text-white rounded-lg"
                    onClick={() => openAdminPopup("comment")}>
                    <h2>Comment Management</h2>
                    <span className="text-sm">Moderate user comments and feedback</span>
                    <Divider sx={{ my: 1, backgroundColor: 'white', height: '1px' }} flexItem />
                    <span className="text-sm">Last comments :</span>

                    <div className="flex flex-col overflow-y-auto h-full w-full px-5 mt-5 gap-5">
                        {
                            skeletonFactory()
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