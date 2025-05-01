import React, { useState, useEffect } from "react";
import search from "../../../assets/images/search.svg";
import filter from "../../../assets/images/filter.svg";
import AlgorithmCard from "../../components/AlgorithmCard/AlgorithmCard.jsx";
import Informations from "../../components/Informations/Informations.jsx";

var tags = [
    "2D",
    "3D",
    "Endless",
    "1D",
    "Deterministic",
    "Chaotic"
];

var fakeData = [
    {
        "image": "https://m.media-amazon.com/images/S/pv-target-images/cc1a5f842ea4e49fadc4db30a374fd23586fdfbd8f921cfdbb7ddcc51afdc064.jpg",
        "id": 0,
        "title": "Algorithm " + 0,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://m.media-amazon.com/images/S/pv-target-images/e80c79cf97651235c5f9c21672ce6d4fc6c714d75c1190366c867bf04c06d6fc.jpg",
        "id": 1,
        "title": "Algorithm " + 1,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=1200,height=675/catalog/crunchyroll/b609c6cb94879aa31f772c042004138d.jpg",
        "id": 2,
        "title": "Algorithm " + 2,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://m.media-amazon.com/images/S/pv-target-images/e80c79cf97651235c5f9c21672ce6d4fc6c714d75c1190366c867bf04c06d6fc.jpg",
        "id": 3,
        "title": "Algorithm " + 3,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://m.media-amazon.com/images/S/pv-target-images/cc1a5f842ea4e49fadc4db30a374fd23586fdfbd8f921cfdbb7ddcc51afdc064.jpg",
        "id": 4,
        "title": "Algorithm " + 4,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://m.media-amazon.com/images/S/pv-target-images/cc1a5f842ea4e49fadc4db30a374fd23586fdfbd8f921cfdbb7ddcc51afdc064.jpg",
        "id": 5,
        "title": "Algorithm " + 5,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=1200,height=675/catalog/crunchyroll/b609c6cb94879aa31f772c042004138d.jpg",
        "id": 6,
        "title": "Algorithm " + 6,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://m.media-amazon.com/images/S/pv-target-images/cc1a5f842ea4e49fadc4db30a374fd23586fdfbd8f921cfdbb7ddcc51afdc064.jpg",
        "id": 7,
        "title": "Algorithm " + 7,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://m.media-amazon.com/images/S/pv-target-images/cc1a5f842ea4e49fadc4db30a374fd23586fdfbd8f921cfdbb7ddcc51afdc064.jpg",
        "id": 8,
        "title": "Algorithm " + 8,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=1200,height=675/catalog/crunchyroll/b609c6cb94879aa31f772c042004138d.jpg",
        "id": 9,
        "title": "Algorithm " + 9,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://m.media-amazon.com/images/S/pv-target-images/cc1a5f842ea4e49fadc4db30a374fd23586fdfbd8f921cfdbb7ddcc51afdc064.jpg",
        "id": 10,
        "title": "Algorithm " + 10,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://imgsrv.crunchyroll.com/cdn-cgi/image/fit=contain,format=auto,quality=85,width=1200,height=675/catalog/crunchyroll/b609c6cb94879aa31f772c042004138d.jpg",
        "id": 11,
        "title": "Algorithm " + 11,
        "tags": ["2D", "Deterministic"],
    },
    {
        "image": "https://m.media-amazon.com/images/S/pv-target-images/e80c79cf97651235c5f9c21672ce6d4fc6c714d75c1190366c867bf04c06d6fc.jpg",
        "id": 12,
        "title": "Algorithm " + 12,
        "tags": ["2D", "Deterministic"],
    },
]

export default function Community() {
    const [filters, setFilters] = useState([]);
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
    const [isInformationPanelOpen, setIsInformationPanelOpen] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState({});

    useEffect(() => {
        window.addEventListener("resize", configureFilterPopup);

        tags = tags.sort((a, b) => {
            a.length > b.length ? 1 : -1;
        });

        return () => {
            window.removeEventListener("resize", configureFilterPopup);
        };
    }, []);

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

    const handleFilterChip = (event) => {
        // Get the filter
        const filterId = event.target;

        if (filterId.classList.contains("text-midnight-purple")) {
            filterId.classList.add("bg-midnight-purple");
            filterId.classList.remove("text-midnight-purple");
            filterId.classList.add("text-white");
            setFilters(filters.filter((filter) => filter !== filterId.id));
        } else {
            filterId.classList.remove("text-white");
            filterId.classList.add("text-midnight-purple");
            filterId.classList.remove("bg-midnight-purple");
            setFilters([...filters, filterId.id]);
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
                                                <button key={tag} id={tag} className="text-midnight-purple rounded-full border-midnight-purple border-2 py-1 px-4" onClick={handleFilterChip}>{tag}</button>
                                            )
                                        }))
                                    }
                                </div>
                            </div>
                        </button>
                    </div>

                </div>
            </div>

            <div id="results" className="flex flex-row flex-wrap gap-x-8 gap-y-4 h-full w-full p-5 max-w-full font-mono justify-center overflow-y-auto">
                {
                    fakeData.map((algorithm) => (
                        <AlgorithmCard key={algorithm.id} algorithm={algorithm} onClickCallback={openInformationPanel} />
                    ))
                }
            </div>

            {/* INFORMATION PANEL :) */}
            <div id="information-panel"
                className="hidden flex-col w-full h-full bg-midnight-opacity absolute left-0 -top-full">
                <Informations onCloseCallback={closeInformationPanel} algorithm={selectedAlgorithm} />
            </div>
        </div>
    );
}