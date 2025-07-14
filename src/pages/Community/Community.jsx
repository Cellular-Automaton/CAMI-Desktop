import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { APIContext } from "../../contexts/APIContext.jsx";
import { useNavigate } from "react-router-dom";

import search from "../../../assets/images/search.svg";
import filter from "../../../assets/images/filter.svg";
import spinner from "../../../assets/images/spinner.svg";

import AlgorithmCard from "../../components/AlgorithmCard/AlgorithmCard.jsx";
import Informations from "../../components/Informations/Informations.jsx";
import { set } from "date-fns";

export default function Community() {
    const [filters, setFilters] = useState([]);
    const [tags, setTags] = useState([]);
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
    const [isInformationPanelOpen, setIsInformationPanelOpen] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState({});
    const [algorithms, setAlgorithms] = useState([]);
    const [notFilteredAlgorithms, setNotFilteredAlgorithms] = useState([]);
    const [isFetchComplete, setIsFetchComplete] = useState(false);
    const { getAlgorithms, getTags } = useContext(APIContext);
    const navigate = useNavigate();

    useEffect(() => {
        window.addEventListener("resize", configureFilterPopup);

        // Fetch algorithms from the API
        getAlgorithms().then((algos) => {
            setAlgorithms(algos);
            setNotFilteredAlgorithms(algos);
            configureFilterPopup();
        }).catch((error) => {
            navigate("/Home");
        });

        getTags().then((fetchedTags) => {
            setTags(fetchedTags);
        }).catch((error) => {
            console.error("Error fetching tags:", error);
        });

        return () => {
            window.removeEventListener("resize", configureFilterPopup);
        };
    }, []);

    useEffect(() => {
        console.log("Algorithms updated:", algorithms);

        if (algorithms === undefined || algorithms.length === 0) return;
        console.log("PASSED")
        setIsFetchComplete(true);
    },  [algorithms]);

    useEffect(() => {
        if (filters.length === 0) {
            setAlgorithms(notFilteredAlgorithms);
            return;
        }
        
        const filteredAlgorithms = notFilteredAlgorithms.filter((algorithm) => {
            return algorithm.tags.some((tag) => filters.includes(tag.tag_id));
        });
        setAlgorithms(filteredAlgorithms);
    }, [filters]);

    const configureFilterPopup = () => {
        // Put just bellow the filter button
        const filterPopup = document.getElementById("filter-popup");
        const filterButton = document.getElementById("Filter");
        const filterButtonRect = filterButton.getBoundingClientRect();
        const filterPopupRect = filterPopup.getBoundingClientRect();

        const filterPopupX = (filterButtonRect.left - (filterButtonRect.right - filterButtonRect.left)) - (filterPopupRect.width / 2); // Centered on the button
        const filterPopupY = filterButtonRect.y + filterButtonRect.height + 10; // 10px below the button

        filterPopup.style.left = `${filterPopupX}px`;
        filterPopup.style.top = `${filterPopupY}px`;
    };

    const disableFilterPopup = () => {
        const filterPopup = document.getElementById("filter-popup");

        filterPopup.style.display = "none";
        setIsFilterPopupOpen(false);
    };

    const enableFilterPopup = () => {
        const filterPopup = document.getElementById("filter-popup");

        filterPopup.style.display = "block";
        configureFilterPopup();
        setIsFilterPopupOpen(true);
    };

    const handleFilterChip = (event, tag) => {
        // Get the filter
        const tagHTML = event.target;

        if (tagHTML.classList.contains("text-midnight-purple")) {
            tagHTML.classList.add("bg-midnight-purple");
            tagHTML.classList.remove("text-midnight-purple");
            tagHTML.classList.add("text-white");
            setFilters([...filters, tag.id]);
        } else {
            tagHTML.classList.remove("text-white");
            tagHTML.classList.add("text-midnight-purple");
            tagHTML.classList.remove("bg-midnight-purple");
            setFilters(filters.filter((filter) => filter !== tag.id));
        }
    };

    const openInformationPanel = (algorithm) => {
        const informationPanel = document.getElementById("information-panel");

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

        setSelectedAlgorithm(algorithm);
        setIsInformationPanelOpen(true);
    };

    const closeInformationPanel = () => {
        const informationPanel = document.getElementById("information-panel");

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
        setIsInformationPanelOpen(false);
    };

    return (
        <div id="community" className="flex flex-col relative gap-2 bg-midnight h-full w-full font-mono">
            <div id="search-bar" className="flex flex-row bg-transparent h-20 w-full p-1 justify-center items-center">
                <div className="flex flex-row w-full h-full p-2 justify-center items-center gap-6">
                    <div id="search" className="flex flex-row items-center h-full w-fit p-2 gap-2">
                        <input type="text" className="h-full max-w-96 min-w-80 bg-midnight text-white border-2 border-midnight-purple rounded-full p-2" placeholder="Search for a simulation..." />
                        
                        <div className="w-2 min-w-2"></div>

                        <button className="flex bg-midnight-opacity rounded-full grow-0 shrink-0 shadow-md shadow-midnight-purple-shadow h-10 w-10 items-center p-1">
                            <img src={search} alt="Search" className="h-10 w-10"/>
                        </button>

                        <div className="w-5 min-w-5"></div>

                        <button id="Filter" className="flex bg-midnight-opacity rounded-full grow-0 shrink-0 shadow-md shadow-midnight-purple-shadow h-10 w-10 items-center p-1 overflow-visible" onClick={enableFilterPopup}>
                            <img src={filter} alt="Filter" className="h-10 w-10"/>
                    
                            {/* POPUP FOR FILTER */}
                            <div id="filter-popup" className="absolute bg-midnight shadow-sm shadow-midnight-purple-shadow max-w-1/4 w-fit h-fit rounded-lg p-4 hidden z-10">
                                {/* Filter options go here which looks like chips */}
                                <div className="flex flex-row flex-wrap gap-x-2 gap-y-1 text-xs justify-between" onMouseLeave={disableFilterPopup}>
                                    {
                                        tags.map((tag => {
                                            return (
                                                <button key={tag.id} id={tag.name} obj={tag} className="text-midnight-purple rounded-full border-midnight-purple border-2 py-1 px-4" onClick={(e) => handleFilterChip(e, tag)}>{tag.name}</button>
                                            )
                                        }))
                                    }
                                </div>
                            </div>
                        </button>
                    </div>

                </div>
            </div>

            {
                !isFetchComplete ? 
                    <div id="loading-spinner" className="flex h-full w-full justify-center items-center">
                        <img src={spinner} alt="Loading..." className="animate-spin h-20 w-20" />
                    </div>
                    :
                    <div id="results" className="flex flex-row flex-wrap gap-x-8 gap-y-4 h-full w-full p-5 max-w-full font-mono justify-center overflow-y-auto">
                        {
                            algorithms.map((algorithm) => {
                                console.log("Algorithm:", algorithm);
                                return (
                                    <AlgorithmCard key={algorithm.automaton_id} algorithm={algorithm} onClickCallback={openInformationPanel} />
                                )
                            })
                        }
                    </div>
            }


            {/* INFORMATION PANEL :) */}
            <div id="information-panel"
                className="hidden flex-col w-full h-full bg-midnight-opacity absolute left-0 -top-full">
                <Informations onCloseCallback={closeInformationPanel} algorithm={selectedAlgorithm} />
            </div>
        </div>
    );
}