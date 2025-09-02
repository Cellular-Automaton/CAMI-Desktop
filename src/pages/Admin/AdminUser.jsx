import React, { useState, useEffect } from "react";
import { Avatar, Card, CardActionArea, CardContent, Dialog, Divider, TextField } from "@mui/material";

export default function AdminUser({ closeCallback }) {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        setFilteredUsers(users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())));
    }, [searchTerm, users]);

    const getAllUsers = () => {
        // Fetch all users from the backend (not implemented)
        // Temporarily give fake data

        for (let i = 0; i < 30; i++) {
            setUsers(prevUsers => [...prevUsers, { id: i, name: `User ${i + 1}`, email: `user${i + 1}@example.com`, role: `Role ${i + 1}` }]);
        }
    }

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div className="bg-midnight w-full h-full p-5 flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4">User Management</h2>
            <p className="text-white">Here you can manage the users of the application.</p>
            <Divider sx={{ my: 2, backgroundColor: 'white', height: '1px' }} flexItem />

            {/* List of all users of the application */}

            <div className="w-full flex flex-row justify-center">
                <TextField label="Search Users" variant="outlined" className="!w-1/5 !rounded-sm"
                    sx={{ input: { color: 'white' }, label: { color: 'white' }, fieldset: { borderColor: 'white' } }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-row flex-wrap mt-5 overflow-y-auto h-full w-full px-5 gap-5 items-center justify-center">

                {
                    filteredUsers.map((user) => (
                        <Card key={user.id} className="!bg-midnight-opacity !text-white !h-1/6 !w-1/6">
                            <CardActionArea onClick={() => setSelectedUser(user)}>
                                <CardContent>
                                    <div className="h-full w-full flex flex-col">
                                        <h3 className="text-lg font-bold mb-2">{user.name}</h3>
                                        <p>Email: {user.email}</p>
                                        <p>Role: {user.role}</p>
                                    </div>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))
                }
            </div>

            <Dialog open={selectedUser !== null} onClose={() => setSelectedUser(null)} maxWidth="sm" fullWidth>
                <div className="bg-midnight p-5 flex flex-col">
                    <div className="bg-midnight p-5 flex flex-row">
                        <div className="flex flex-col items-center mr-10">
                            <Avatar className="!w-20 !h-20 !mb-5 !self-center" />
                            <p className="text-white">ID: {selectedUser === null ? "" : selectedUser.id}</p>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <p className=" text-white mb-4 text-left">{selectedUser === null ? "" : selectedUser.name}</p>
                            <p className=" text-white mb-4 text-left">{selectedUser === null ? "" : selectedUser.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-row-reverse gap-5">
                        {/* More user details and management options would go here */}
                        <button className="mt-5 p-2 bg-midnight-purple text-white rounded-lg w-32 self-end"
                            onClick={() => setSelectedUser(null)}>
                            Mute
                        </button>
                        <button className="mt-5 p-2 bg-midnight-red text-white rounded-lg w-32 self-end"
                            onClick={() => setSelectedUser(null)}>
                            Ban
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
