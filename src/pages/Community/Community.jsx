import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { APIContext } from "../../contexts/APIContext.jsx";
import { useNavigate } from "react-router-dom";
import { IconButton, Menu, TextField, MenuItem, Chip } from "@mui/material";

import SearchIcon from '@mui/icons-material/Search';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import spinner from "../../../assets/images/spinner.svg";

import AlgorithmCard from "../../components/AlgorithmCard/AlgorithmCard.jsx";
import Informations from "../../components/Informations/Informations.jsx";

export default function Community() {
    const [filters, setFilters] = useState([]);
    const [tags, setTags] = useState([]);
    const [isInformationPanelOpen, setIsInformationPanelOpen] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState({});
    const [algorithms, setAlgorithms] = useState([]);
    const [notFilteredAlgorithms, setNotFilteredAlgorithms] = useState([]);
    const [isFetchComplete, setIsFetchComplete] = useState(false);
    const { getAlgorithms, getTags } = useContext(APIContext);
    const [search, setSearch] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate();
    const filteredAlgorithms = [...algorithms].filter((algorithm) => {
        // Check if the algorithm matches the search query and filters
        const nameMatch = algorithm.name.toLowerCase().includes(search.toLowerCase());
        const filterMatch = filters.length === 0 || algorithm.tags.some((tag) => filters.includes(tag.tag_id));
        return nameMatch && filterMatch;
    });

    useEffect(() => {
        // Fetch algorithms from the API
        getAlgorithms().then((algos) => {
            setAlgorithms(algos);
            setNotFilteredAlgorithms(algos);
        }).catch((error) => {
            navigate("/Home");
        });

        getTags().then((fetchedTags) => {
            setTags(fetchedTags);
        }).catch((error) => {
            console.error("Error fetching tags:", error);
        });
    }, []);

    useEffect(() => {
        if (search.trim() === "" && filters.length === 0) {
            setAlgorithms(notFilteredAlgorithms);
            return;
        }
        const filteredAlgorithms = notFilteredAlgorithms.filter((algorithm) => {
            const nameMatch = algorithm.name.toLowerCase().includes(search.toLowerCase());
            return nameMatch;
        });

        // filter algorithms with tags
        const filteredAlgorithms2 = filteredAlgorithms.filter((algorithm) => {
            if (filters.length === 0)
                return true;
            return algorithm.tags.some((tag) => filters.includes(tag.tag_id));
        });

        setAlgorithms(filteredAlgorithms2);
    }, [search]);

    useEffect(() => {
        

        if (algorithms === undefined || algorithms.length === 0) return;
        
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



    const handleFilterChip = (event, tag) => {
        // Get the filter
        const tagHTML = event.target;

        if (tagHTML.classList.contains("text-primary")) {
            tagHTML.classList.add("bg-primary");
            tagHTML.classList.remove("text-primary");
            tagHTML.classList.add("text-text-primary");
            setFilters([...filters, tag.id]);
        } else {
            tagHTML.classList.remove("text-text-primary");
            tagHTML.classList.add("text-primary");
            tagHTML.classList.remove("bg-primary");
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
        <div id="community" className="flex flex-col relative gap-2 bg-background h-full pt-5 w-full font-mono">
            <div id="search-bar" className="flex flex-row bg-transparent h-20 w-full p-1 justify-center items-center">
                <div className="flex flex-row w-full h-full p-2 justify-center items-center gap-6">

                    <div id="search" className="flex flex-row justify-center items-center h-full w-full p-2 gap-2">
                        <TextField
                            variant="standard"
                            className="h-full w-1/3 min-w-80 bg-background text-text border-2 border-primary rounded-full p-2"
                            placeholder="Search for a simulation..." value={search} onChange={(e) => setSearch(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <SearchIcon
                                            sx={{ mr: 1 }}
                                            fontSize="large"
                                            className="text-primary"
                                        />
                                    )
                                }
                            }}
                            sx={{
                                '& .MuiInputBase-input': {
                                    color: 'var(--color-text)',
                                    '&::placeholder': {
                                        color: 'var(--color-text-alt)',
                                        opacity: 0.7,
                                    }
                                },
                                '& .MuiInput-underline:before': {
                                    borderBottomColor: 'var(--color-text-alt)',
                                },
                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                    borderBottomColor: 'var(--color-primary)',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: 'var(--color-primary)',
                                },
                            }}
                        />

                        <IconButton
                            id="Filter"
                            className="text-text"
                            onClick={(e) => {
                                setAnchorEl(e.currentTarget);
                            }}
                            size="large"
                        >
                            <FilterListRoundedIcon
                                className="text-primary"
                                fontSize="large"
                            />
                        </IconButton>

                        {/* Filter popup with Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={anchorEl !== null}
                            onClose={() => setAnchorEl(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            slotProps={{
                                paper: {
                                    sx: {
                                        width: 'fit-content',
                                        maxWidth: '25%',
                                        padding: '1rem',
                                        backgroundColor: 'var(--color-background)',
                                        borderRadius: '0.5rem',
                                        marginTop: '0.5rem',
                                    }
                                }
                            }}
                        >
                            <div className="flex flex-row flex-wrap gap-x-2 gap-y-1 text-xs justify-between">
                                {
                                    tags.map((tag) => (
                                        <button 
                                            key={tag.id}
                                            id={tag.name}
                                            obj={tag}
                                            className="text-primary rounded-full border-primary border-2 py-1 px-4 font-mono hover:scale-105 transition-all duration-200"
                                            onClick={(e) => handleFilterChip(e, tag)}
                                        >
                                            {tag.name}
                                        </button>
                                    ))
                                }
                            </div>
                        </Menu>
                    </div>

                </div>
            </div>

            
            <div className="px-20 h-full w-full overflow-y-auto">
                {
                    !isFetchComplete ? 
                        <div id="loading-spinner" className="flex h-full w-full justify-center items-center">
                            <img src={spinner} alt="Loading..." className="animate-spin h-20 w-20" />
                        </div>
                        :
                        <div id="results" className="grid grid-cols-2 h-full w-full p-5 gap-x-5 gap-y-5 overflow-y-auto overflow-x-hidden">
                            {
                                filteredAlgorithms.map((algorithm) => {
                                    return (
                                        <AlgorithmCard key={algorithm.automaton_id} algorithm={algorithm} onClickCallback={openInformationPanel} />
                                    )
                                })
                            }
                        </div>
                }
            </div>


            {/* INFORMATION PANEL :) */}
            <div id="information-panel"
                className="hidden flex-col w-full h-full bg-midnight-opacity absolute left-0 -top-full z-20">
                <Informations onCloseCallback={closeInformationPanel} algorithm={selectedAlgorithm} />
            </div>
        </div>
    );
}