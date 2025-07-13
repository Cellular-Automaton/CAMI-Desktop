import React, {useEffect, useRef, useState, useContext } from "react";
import {Application, Container} from "pixi.js";
import { Viewport } from "pixi-viewport";
import Cell from "../../classes/Cell.jsx";
import RangedCell from "../../classes/RangeCell.jsx";
import {SimulationContext} from "../../contexts/SimulationContext.jsx";
import chroma from "chroma-js";

export default function TwoDDisplay({gridSize, setGridSize}) {
    const appRef = useRef(null);
    const containerRef = useRef(null);
    const viewportRef = useRef(null);
    const { response, cellInstances, setCellInstances,
        importedData, setImportedData
    } = useContext(SimulationContext);
    const [shouldUpdate, setShouldUpdate] = useState(true);
    const colorScale = chroma.scale(['#FFFFFF','#fdeff9', '#ec38bc', '#7303c0', '#03001e', '#000000']).domain([0, 0.05, 0.4, 0.6, 0.95, 1]);

    useEffect(() => {
        init().then(() => {
            console.log("PixiJS Application initialized");
        }).catch((error) => {
            console.error("Error initializing PixiJS Application:", error);
        });
    }, []);

    useEffect(() => {
        if (importedData && importedData.length > 0) {
            constructImportedData();
            setImportedData(null);
        }
    }, [importedData]);

    useEffect(() => {
        if (response && response.length > 0) {
            updateCells(response);
        }
    }, [response]);

    const init = async () => {
        const app = new Application();
        const container = new Container();

        app.stage.interactive = true;
        appRef.current = app;

        await app.init({
            background: 0xCDD1DE,
            resizeTo: window
        });

        const displayElement = document.getElementById("2d-display");
        displayElement.appendChild(app.canvas);
        app.canvas.style.width = "100%";
        app.canvas.style.height = "100%";

        const viewport = new Viewport({
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            worldWidth: 1000,
            worldHeight: 1000,
            events: app.renderer.events,
        });

        app.stage.addChild(viewport);

        viewport.drag().pinch().wheel().decelerate();

        containerRef.current = container;
        viewportRef.current = viewport;
        viewport.addChild(container);

        viewport.setZoom(0.10);

        window.addEventListener("resize", () => {
            viewport.resize(window.innerWidth, window.innerHeight);
            viewport.moveCenter((gridSize * (100 + 10)) / 2, (gridSize * (100 + 10)) / 2);
        });
        hardUpdate();
    }

    useEffect(() => {
        if (!shouldUpdate) {
            setShouldUpdate(true);
            return;
        }
        if (appRef.current && containerRef.current) {
            hardUpdate();
        }
    }, [gridSize]);

    useEffect(() => {
        if (appRef.current && containerRef.current) {
            softUpdate();
        }
    }, [cellInstances]);

    // Function that only updates the grid without recreate the cells
    const softUpdate = () => {
        drawCells();
    };

    // Function that completely redraws the grid
    const hardUpdate = () => {
        createGrid(gridSize);
        drawCells();
    };

    const createGrid = (gSize) => {
        containerRef.current.removeChildren();
        setCellInstances([]);
        for (let i = 0; i < gSize * gSize; i += 1) {
            const cell = new RangedCell(
                (i % gSize), Math.floor(i / gSize),
                i, "default", appRef, null, colorScale
            );
            containerRef.current.addChild(cell.shape);
            setCellInstances(prev => [...prev, cell]);
        }
    };

    const drawCells = () => {
        cellInstances.forEach(cell => {
            cell.draw();
        });
        centerCamera();
    };

    const centerCamera = () => {
        const centerX = (gridSize * (100 + 10)) / 2;
        const centerY = (gridSize * (100 + 10)) / 2;

        if (viewportRef.current)
            viewportRef.current.moveCenter(centerX, centerY);
    };

    const updateCells = (data) => {
        if (!data || data.length === 0)
            return;

        data.forEach((state, index) => {
            if (cellInstances[index]) {
                cellInstances[index].setState(state);
            }
        });
    };

    const constructImportedData = () => {
        const gSize = Math.sqrt(importedData.length);
        setCellInstances([]);
        containerRef.current.removeChildren();

        setShouldUpdate(false);
        setGridSize(gSize);
        for (let i = 0; i < importedData.length; i += 1) {
            const cell = new RangedCell(
                (i % gSize), Math.floor(i / gSize),
                i, "default", appRef, null, colorScale
            );
            cell.setState(importedData[i]);
            containerRef.current.addChild(cell.shape);
            setCellInstances(prev => [...prev, cell]);
        }
    };

    return (
        <div id="2d-display" className="w-full h-full relative">
        </div>
    );
}