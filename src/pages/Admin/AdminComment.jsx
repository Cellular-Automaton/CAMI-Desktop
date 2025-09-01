import React from "react";

export default function AdminComment({ closeCallback }) {
    return (
        <div className="bg-midnight w-full h-full p-5 flex flex-col">
            <h2 className="text-2xl font-bold text-white mb-4">Comment Management</h2>
            <p className="text-white">Here you can manage the comments made by users.</p>
            <button className="mt-5 p-2 bg-midnight-purple text-white rounded-lg w-32"
                onClick={closeCallback}>
                Close
            </button>
        </div>
    );
}
