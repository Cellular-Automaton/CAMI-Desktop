import React, { useState, useEffect, useContext } from "react";
import { Avatar, Card, CardActionArea, CardContent, Dialog, Divider, TextField } from "@mui/material";
import { APIContext } from "../../contexts/APIContext.jsx";
import { formatDistance } from "date-fns";

export default function AdminUser({ closeCallback }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const { getAllAccounts, updateUser, deleteUser } = useContext(APIContext);
    const [isValidationOpen, setIsValidationOpen] = useState(false);

    useEffect(() => {
        
        setFilteredUsers(users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, users]);

    const getAllUsers = () => {
        getAllAccounts().then(fetchedUsers => {
            setUsers(fetchedUsers);
        }).catch(err => {
            console.error("Failed to fetch users:", err);
        });
    }

    const updatedUserRole = (role) => {
        selectedUser.user_role = role;
        
        updateUser(selectedUser).then(() => {
            getAllUsers();
            setSelectedUser(null);
        }).catch(err => {
            console.error("Failed to update user:", err);
        });
    }

    const handleDeleteUser = () => {
        deleteUser(selectedUser.user_id).then(() => {
            getAllUsers();
            setSelectedUser(null);
            setIsValidationOpen(false);
        }).catch(err => {
            console.error("Failed to delete user:", err);
        });
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div className="bg-background w-full h-full pt-10 px-10 flex flex-col">
            <div className="px-5">
                <h2 className="text-2xl font-bold text-text mb-4">User Management</h2>
                <p className="text-text">Here you can manage the users of the application.</p>
            </div>
            <Divider sx={{ my: 2, backgroundColor: 'var(--color-text-alt)', height: '1px' }} flexItem />

            <div className="w-full flex flex-row justify-center">
                <TextField label="Search Users" variant="outlined" className="!w-1/5 !rounded-sm"
                    sx={{ 
                        input: { color: 'var(--color-text)', backgroundColor: 'var(--color-background-alt)' },
                        label: { color: 'var(--color-text)' },
                        fieldset: { borderColor: 'var(--color-text-alt)' } }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-row flex-wrap mt-5 overflow-y-auto h-full w-full py-5 gap-5 items-center justify-center flex-grow">

                {
                    filteredUsers.length === 0 ? (
                        <p className="text-white">No users found.</p>
                    ) : (
                    filteredUsers.map((user) => (
                        <Card key={user.user_id} className="
                            !h-fit !bg-backgroundAlt !text-text !w-1/3 overflow-y-hidden text-ellipsis
                            hover:scale-105 hover:ring-4 hover:ring-primary !transition-all duration-200
                            focus-within:scale-105 focus-within:ring-4 focus-within:ring-primary
                        ">
                            <CardActionArea className="!h-fit" onClick={() => setSelectedUser(user)}>
                                <CardContent className="!h-fit">
                                    <div className="h-fit w-full flex flex-col">
                                        <h3 className="text-lg font-bold mb-2">{user.username}</h3>
                                        <p className="text-sm opacity-70">ID: {user.user_id}</p>
                                        <Divider sx={{ my: 1, backgroundColor: 'white', height: '1px' }} flexItem />
                                        <p>{user.email}</p>
                                        <p>{user.user_role}</p>
                                        <p className="text-sm opacity-70">Joined {formatDistance(new Date(user.created_at), new Date(), { addSuffix: true })}</p>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    )))
                }
            </div>

            <Dialog open={selectedUser !== null} onClose={() => setSelectedUser(null)} maxWidth="sm" fullWidth className="font-mono">
                {
                    selectedUser === null ?
                        null
                        :
                    <div className="bg-backgroundAlt p-5 flex flex-col">
                        <div className="p-5 flex flex-row">
                            <div className="flex flex-col items-center mr-10">
                                <Avatar className="!w-32 !h-32 !mb-5 !self-center" />
                            </div>
                            <div className="flex flex-col items-left w-full text-left justify-start">
                                <h3 className=" text-text text-left text-lg font-bold">{selectedUser.username}</h3>
                                <p className="text-textAlt mb-4 text-sm">ID: {selectedUser.user_id}</p>
                                <p className=" text-text text-left">{selectedUser.email}</p>
                                <p className=" text-text text-left">{selectedUser.user_role}</p>
                                <p className="text-textAlt text-sm">
                                    Joined {formatDistance(new Date(selectedUser?.created_at), new Date(), { addSuffix: true })}
                                    <span className="ml-1">({new Date(selectedUser?.created_at).toLocaleDateString()})</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-row-reverse gap-5">
                            {/* More user details and management options would go here */}
                            {
                                selectedUser !== null && selectedUser.user_role === "user" ?
                                <button className="mt-5 p-2 bg-midnight-blue text-white rounded-lg w-32 self-end"
                                    onClick={() => updatedUserRole("admin")}>
                                    Promote
                                </button>
                                :
                                <button className="mt-5 p-2 bg-midnight-blue text-white rounded-lg w-32 self-end"
                                    onClick={() => updatedUserRole("user")}>
                                    Demote
                                </button>
                            }
                            <button className="mt-5 p-2 bg-primary text-textPrimary rounded-lg w-32 self-end"
                                onClick={() => setSelectedUser(null)}>
                                Mute
                            </button>
                            <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end"
                                onClick={() => setIsValidationOpen(true)}>
                                Delete
                            </button>
                        </div>
                    </div>
                }
            </Dialog>
            
            <Dialog open={isValidationOpen} onClose={() => setIsValidationOpen(false)} className="flex flex-col p-5">
                <div className="bg-background p-5 flex flex-col text-text font-mono">
                    <h2 className="text-lg font-bold pb-5">Are you sure to delete this comment?</h2>
                    <div className="flex flex-row-reverse gap-5 mt-5">
                        <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end hover:opacity-50 transition ease-in-out duration-200"
                            onClick={() => handleDeleteUser(selectedUser?.id)}>
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
