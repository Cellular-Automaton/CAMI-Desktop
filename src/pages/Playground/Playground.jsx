import React, { useState, useEffect, useRef } from "react";
import { Engine, UniversalCamera, Scene, HemisphericLight } from "react-babylonjs";
import { Vector3 } from "@babylonjs/core";
import * as BABYLON from "babylonjs";
import Cell from "../../classes/Cell.jsx";

export default function Playground() {
    const cameraRef = useRef(null);
    const sceneRef = useRef(null);
    const [gridSize, setGridSize] = useState(10);
    const defaultHorizontal = 1;
    const defaultVertical = 0.6;
    const [keysPressed, setKeysPressed] = useState({});
    const [container, setContainer] = useState(null);
    const [cells, setCells] = useState([]);
    const [isEditable, setIsEditable] = useState(true);
    const [intervalId, setIntervalId] = useState(null);
    const isDrawingRef = useRef(false);

    const onCameraCreated = (camera) => {
        cameraRef.current = camera;
        setupCamera(camera);
    };

    // Center of the grid is (0,0,0)
    const createGrid = (width, height) => {
        const offset = 0.11;
        let newCells = [];

        setCells([]);
        container.removeAllFromScene();
        container.meshes.forEach((mesh) => mesh.dispose());
        let id = 0;
        for (let y = height / 2; y > -height / 2; y -= 1) {
            for (let x = width / 2; x > -width / 2; x -= 1) {
                let cell = new Cell(x * offset, y * offset, id, "creation", sceneRef, isDrawingRef);

                cell.setStates({"dead": ["0xFFFFFF", 0], "alive": ["0x000000", 1]});
                cell.registerActionManager(new BABYLON.ActionManager(sceneRef.current));
                cell.setUpAction();
                newCells.push(cell);
                container.meshes.push(cell.cell);
                id += 1
            }
        }
        setCells(newCells);
        container.addAllToScene();
    }

    const setupCamera = (camera) => {
        camera.setTarget(Vector3.Zero());
        camera.inputs.clear();
        camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
        camera.orthoRight = defaultHorizontal;
        camera.orthoLeft = -defaultHorizontal;
        camera.orthoTop = defaultVertical;
        camera.orthoBottom = -defaultVertical;
    }

    const zoomCamera = (e) => {
        const camera = cameraRef.current;
        const delta = e.deltaY;
        const zoomFactor = 0.01;
        const zoom = delta * zoomFactor;

        if (delta < 0 && camera.orthoRight > 1)
            zoomOut(camera, zoom);
        else if (delta > 0 && camera.orthoRight < 10)
            zoomIn(camera, zoom);
    }

    const zoomIn = (camera, zoom) => {
        camera.orthoRight += zoom * defaultHorizontal;
        camera.orthoLeft -= zoom * defaultHorizontal;
        camera.orthoTop += zoom * defaultVertical;
        camera.orthoBottom -= zoom * defaultVertical;
    }

    const zoomOut = (camera, zoom) => {
        zoomIn(camera, zoom);
    }

    const handleKeyDown = (e) => {
        setKeysPressed((prevKeys) => ({ ...prevKeys, [e.key]: true }));
    }

    const handleKeyUp = (e) => {
        setKeysPressed((prevKeys) => ({ ...prevKeys, [e.key]: false }));
    }

    const onStartSimulation = async () => {
        // Call the native function
        //setIsEditable(false);
        //cells.map((cell) => cell.setDownAction());
        await callSimulation();
        setIntervalId(setInterval(callSimulation, 150));
    }

    const onStopSimulation = () => {
        clearInterval(intervalId);
        setIntervalId(null);
    }

    useEffect(() => {
        const speed = 0.1;
        const camera = cameraRef.current;

        if (keysPressed["ArrowUp"] || keysPressed["z"]) {
            camera.position.y += speed;
        }
        if (keysPressed["ArrowDown"] || keysPressed["s"]) {
            camera.position.y -= speed;
        }
        if (keysPressed["ArrowLeft"] || keysPressed["q"]) {
            camera.position.x -= speed;
        }
        if (keysPressed["ArrowRight"] || keysPressed["d"]) {
            camera.position.x += speed;
        }
    }, [keysPressed]);

    const callSimulation = async () => {
        try {
            const table = new Uint32Array(createSimulationTable());
            const parameters = [table, new Number(gridSize), new Number(gridSize)];
            const response = await window.electron.callSimulateGol(parameters);

            updateCells(response);
            console.log("response ipc Playground.jsx:", response);
        } catch (error) {
            console.error("IPC Call error :", error);
        }
    }

    const createSimulationTable = () => {
        let table = [];

        cells.forEach(cell => {
            table.push(cell.getCurrentState());
        });
        return table;
    }

    const updateCells = (newTable) => {
        cells.forEach((cell, index) => {
            cell.setCurrentState(newTable[index]);
        });
    };

    return (
        <div id="playground" className='flex flex-col h-full w-full relative'>
            <div className="flex flex-col justify-center absolute right-4 w-1/4 h-full bg-transparent z-50 pointer-events-none">
                <div id="configurationPanel" className="flex flex-col w-full bg-midnight-opacity p-4 rounded-lg font-mono gap-10 pointer-events-auto">
                    <div id="configurations" className="flex flex-col gap-4 ">
                        {/* 
                            Ask to the app all the configuartion elements of the simulation such as : Size, Rules, etc...
                            Currently, the configuration panel is empty so Size as a functionnal placeholder
                            Should be in JSON format like this : {"name": "format"}
                            example : {"size": "number", "rules": "string", etc...}
                        */}
                        <div id="size" className="flex flex-col w-full">
                            <label className="text-midnight-text">Size</label>
                            <input className="text-black" type="number" max={50} value={gridSize} min={5} onChange={(e) => {setGridSize(e.target.value)}} onKeyDown={(e) => {if (e.key == "Enter") createGrid(gridSize, gridSize)}} disabled={!isEditable}/>
                        </div>
                    </div>
                    <div id="start" className="flex justify-center">
                        <button className="flex flex-col justify-center items-center w-3/4 h-10 bg-midnight-purple text-midnight-text rounded-lg"
                            onClick={onStartSimulation} disabled={!isEditable}>
                            Start
                        </button>
                    </div>
                </div>
            </div>
            <div id="Player" className={`${isEditable ? 'flex flex-col absolute' : 'hidden'} justify-center items-center w-full bg-black bg-opacity-50 min-h-32 max-h-44 bottom-4 px-4 rounded-lg`}>
                <button className="flex flex-col justify-center items-center w-3/4 h-10 bg-midnight-purple text-midnight-text rounded-lg"
                    onClick={onStopSimulation} disabled={!isEditable}>
                    Stop
                </button>
            </div>
            <div id="canvas" className='flex flex-col h-full w-full' onWheel={zoomCamera} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
                    <Scene id="scene" onCreated={(scene) => { sceneRef.current = scene; setContainer(new BABYLON.AssetContainer(sceneRef.current)) }}>
                        <UniversalCamera name="camera1" position={new Vector3(0, 0, -5)} onCreated={onCameraCreated} />
                        <HemisphericLight name="light1" intensity={2} direction={Vector3.Up()} />
                    </Scene>
                </Engine>
            </div>
        </div>
    )
}