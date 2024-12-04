import React from "react";
import Swipe from "../../components/Swipe/Swipe.jsx";
import fake from "../../../assets/data/fakeSimulation.jsx";

export default function Home() {
    return (
        <div className="flex flex-col gap-8 bg-midnight h-full w-full p-5">
            <section id="welcome" className="my-5">
                <h1 className="text-white text-4xl text-left">Welcome Guest !</h1>
            </section>
            <section id="last_simulations" className="flex flex-col gap-2 my-3">
                <h2 className="text-midnight-text text-3xl text-left">Last Simulations</h2>
                <Swipe simulations={fake} />
            </section>
            <section id="new_algorithms" className="flex flex-col gap-2 my-3">
                <h2 className="text-midnight-text text-3xl text-left">New Algorithms</h2>
                {/* <Swipe /> */}
            </section>
            <section id="favorites" className="flex flex-col gap-2 my-3">
                <h2 className="text-midnight-text text-3xl text-left">Favorites</h2>
                {/* <Swipe /> */}
            </section>
        </div>
    );
}