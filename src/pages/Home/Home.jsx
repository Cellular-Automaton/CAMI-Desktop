import React from "react";
import { useEffect, useState} from "react";
import HorizontalScroll from "../../components/HorizontalScroll/HorizontalScroll.jsx";
import Informations from "../../components/Informations/Informations.jsx";
import {fakeData, favoriteFakeData} from "../../../assets/data/fakeData.jsx";
import gol from "../../../assets/images/gol.gif";

const welcomeSentences = [
    "Hello [User]! Hope you're having a fantastic day! 🌞",
    "Hi [User]! Hope you're having a great day so far. 😊",
    "Hi [User]! Ready to bring some cells to life? 🧬",
    "Welcome, [User]! Ready to explore the magic of cellular algorithms? ✨",
    "Hello [User]! Let's make some digital life happen! 🌱"
]

export default function Home() {
    const [isInformationPanelOpen, setIsInformationPanelOpen] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState({});
    const [sentence, setSentence] = useState(welcomeSentences[Math.floor(Math.random() * welcomeSentences.length)]);

    useEffect(() => {
        setSentence(welcomeSentences[Math.floor(Math.random() * welcomeSentences.length)]);

        async function fetchData() {
            await getAlgorithms();
        }
        fetchData();
    }, []);

    const openInformationPanel = (algorithm) => {
        const informationPanel = document.getElementById("information-panel");
        const homeContainer = document.getElementById("home-container");

        informationPanel.style.display = "flex";
        // Animation to open the information panel
        const animation = informationPanel.animate([
            { top: "-100%", opacity: 0 },
            { top: "0%", opacity: 1 }
        ], {
            duration: 500,
            easing: "ease-in-out",
            fill: "forwards"
        });

        animation.onfinish = () => {     
            homeContainer.classList.remove("min-h-full");
            homeContainer.classList.add("h-screen");
            homeContainer.classList.add("overflow-hidden");
        };

        setSelectedAlgorithm(algorithm);
        setIsInformationPanelOpen(true);
    };

    const closeInformationPanel = () => {
        const informationPanel = document.getElementById("information-panel");
        const homeContainer = document.getElementById("home-container");

        // Animation to open the information panel
        const animation = informationPanel.animate([
            { top: "0%", opacity: 1 },
            { top: "-100%", opacity: 0 }
        ], {
            duration: 500,
            easing: "ease-in-out",
            fill: "forwards"
        });

        animation.onfinish = () => {
            informationPanel.style.display = "none";
        };
        homeContainer.classList.add("min-h-full");
        homeContainer.classList.remove("h-screen");
        homeContainer.classList.remove("overflow-hidden");
        setIsInformationPanelOpen(false);
    };

    const getAlgorithms = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/automaton', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': 'localhost:4000'
                }
            });
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error fetching algorithms:", error);
        }
    };

    return (
        <div id="home-container" className="flex flex-col relative gap-2 bg-midnight min-h-full w-full font-mono">
            <section id="welcome" className="relative my-5 max-h-72 min-h-72 flex flex-row justify-center items-center bg-midnight-opacity rounded-lg overflow-hidden">
                <img src={gol} alt="gol" className="absolute blur-sm rounded-lg h-full w-full object-cover opacity-40 z-0"/>
                <h1 className="absolute text-white text-4xl text-left ml-2 z-0">{sentence}</h1>
            </section>
            <section id="last_simulations" className="flex flex-col gap-2 my-3">
                <h2 className="text-midnight-text text-3xl text-left">Last Simulations</h2>
                <HorizontalScroll algorithms={fakeData} onClickCallback={openInformationPanel} />
            </section>
            <section id="new_algorithms" className="flex flex-col gap-2 my-3">
                <h2 className="text-midnight-text text-3xl text-left">New Algorithms</h2>
                <HorizontalScroll algorithms={fakeData} onClickCallback={openInformationPanel} />
            </section>
            <section id="favorites" className="flex flex-col gap-2 my-3">
                <h2 className="text-midnight-text text-3xl text-left">Favorites</h2>
                <HorizontalScroll algorithms={favoriteFakeData} onClickCallback={openInformationPanel} favorite={true}/>
            </section>

            {/* INFORMATION PANEL :) */}
            <div id="information-panel"
                className="hidden flex-col w-full h-full bg-midnight-opacity absolute left-0 -top-full">
                <Informations onCloseCallback={closeInformationPanel} algorithm={selectedAlgorithm} />
            </div>
        </div>
    );
}