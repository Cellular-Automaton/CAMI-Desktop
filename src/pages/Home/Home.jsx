import React, { useContext } from "react";
import { useEffect, useState} from "react";
import HorizontalScroll from "../../components/HorizontalScroll/HorizontalScroll.jsx";
import Informations from "../../components/Informations/Informations.jsx";
import {fakeData, favoriteFakeData} from "../../../assets/data/fakeData.jsx";
import gol from "../../../assets/images/gol.gif";
import spinner from "../../../assets/images/spinner.svg";

import { UserContext } from "../../contexts/UserContext.jsx";
import { APIContext } from "../../contexts/APIContext.jsx";

const welcomeSentences = [
        `Hello$USER! Hope you're having a fantastic day! 🌞`,
        `Hi$USER! Hope you're having a great day so far. 😊`,
        `Hi$USER! Ready to bring some cells to life? 🧬`,
        `Welcome$USER! Ready to explore the magic of cellular algorithms? ✨`,
        `Hello$USER! Let's make some digital life happen! 🌱`
    ];

export default function Home() {
    const { userData, loggedIn } = useContext(UserContext);
    const { getAlgorithms } = useContext(APIContext);
    const [isInformationPanelOpen, setIsInformationPanelOpen] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState({});
    const [sentence, setSentence] = useState(welcomeSentences[Math.floor(Math.random() * welcomeSentences.length)]);

    const [recentAlgorithms, setRecentAlgorithms] = useState([]);
    const [newAlgorithms, setNewAlgorithms] = useState([]);
    const [favoriteAlgorithms, setFavoriteAlgorithms] = useState([]);

    // Replace $USER with the username
    const replaceUserInSentence = (sentence) => {
        if (loggedIn) {
            console.log(userData);
            return sentence.replace("$USER",  " " + userData.username);
        }
        return sentence.replace("$USER",  "");
    }

    useEffect(() => {
        setSentence(replaceUserInSentence(welcomeSentences[Math.floor(Math.random() * welcomeSentences.length)]));

        // Get algorithms from the API
        getAlgorithms().then((algorithms) => {
            console.log("Fetched algorithms:", algorithms);
            setRecentAlgorithms(algorithms.slice(0, 5));
        }).catch((error) => {
            document.getElementById("loading-recent-algorithms").style.display = "none";
            document.getElementById("loading-new-algorithms").style.display = "none";
            if (loggedIn)
                document.getElementById("loading-favorite-algorithms").style.display = "none";

            console.error("Error fetching algorithms:", error);
        });
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

    return (
        <div id="home-container" className="flex flex-col relative gap-2 bg-midnight min-h-full w-full font-mono">
            <section id="welcome" className="relative my-5 max-h-72 min-h-72 flex flex-row justify-center items-center bg-midnight-opacity rounded-lg overflow-hidden">
                <img src={gol} alt="gol" className="absolute blur-sm rounded-lg h-full w-full object-cover opacity-40 z-0"/>
                <h1 className="absolute text-white text-4xl text-left ml-2 z-0">{sentence}</h1>
            </section>
            <section id="last_simulations" className="flex flex-col gap-2 my-3">
                <h2 className="text-midnight-text text-3xl text-left">Last Simulations</h2>

                {
                    recentAlgorithms.length === 0 ?
                        <div id="loading-recent-algorithms" className="flex justify-center items-center h-10 w-full">
                            <img src={spinner} alt="Loading..." className="animate-spin h-10 w-10" />
                        </div>
                        :
                        <HorizontalScroll algorithms={recentAlgorithms} onClickCallback={openInformationPanel} />
                }

            </section>
            <section id="new_algorithms" className="flex flex-col gap-2 my-3">
                <h2 className="text-midnight-text text-3xl text-left">New Algorithms</h2>

                {
                    recentAlgorithms.length === 0 ?
                        <div id="loading-new-algorithms" className="flex justify-center items-center h-10 w-full">
                            <img src={spinner} alt="Loading..." className="animate-spin h-10 w-10" />
                        </div>
                        :
                        <HorizontalScroll algorithms={newAlgorithms} onClickCallback={openInformationPanel} />
                }
            </section>

            {
                loggedIn ?

                <section id="favorites" className="flex flex-col gap-2 my-3">
                    <h2 className="text-midnight-text text-3xl text-left">Favorites</h2>
                    {
                        favoriteAlgorithms.length === 0 ?
                            <div id="loading-favorite-algorithms" className="flex justify-center items-center h-10 w-full">
                                <img src={spinner} alt="Loading..." className="animate-spin h-10 w-10" />
                            </div>
                            :
                            <HorizontalScroll algorithms={favoriteAlgorithms} onClickCallback={openInformationPanel} favorite={true}/>
                    }
                </section>
                :
                null
            }

            {/* INFORMATION PANEL :) */}
            <div id="information-panel"
                className="hidden flex-col w-full h-full bg-midnight-opacity absolute left-0 -top-full">
                <Informations onCloseCallback={closeInformationPanel} algorithm={selectedAlgorithm} />
            </div>
        </div>
    );
}