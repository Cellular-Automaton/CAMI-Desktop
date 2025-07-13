import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Engine,
  UniversalCamera,
  Scene,
  useClick,
  useHover,
  StandardMaterial,
  HemisphericLight,
} from "react-babylonjs";
import { Vector3, Color3 } from "@babylonjs/core";
import * as BABYLON from "babylonjs";

const Cell = (props) => {
  const cellRef = useRef(null);
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);

  useClick(() => setClicked((clicked) => !clicked), cellRef);
  useHover(
    () => setHovered(true),
    () => setHovered(false),
    cellRef,
  );

  function materialColor() {
    if (hovered) {
      return new Color3(0.65, 0.65, 0.65);
    } else if (clicked) {
      return new Color3(0.05, 0.05, 0.05);
    } else {
      return new Color3(0.94, 0.94, 1);
    }
  }

  return (
    <Box
      ref={cellRef}
      name="box"
      position={props.position}
      scaling={new Vector3(0.1, 0.1, 0.01)}
    >
      <StandardMaterial name="mat" diffuseColor={materialColor()} />
    </Box>
  );
};

export default function Playground() {
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const [gridSize, setGridSize] = useState(10);
  const defaultHorizontal = 1;
  const defaultVertical = 0.6;
  const [keysPressed, setKeysPressed] = useState({});
  const [container, setContainer] = useState(null);
  const [cells, setCells] = useState([]);
  const isDrawingRef = useRef(false);

  const onCameraCreated = (camera) => {
    cameraRef.current = camera;
    setupCamera(camera);
  };

  // Center of the grid is (0,0,0)
  const createGrid = (width, height) => {
    const offset = 0.11;
    let newCells = [];
    let ix = 0;
    let iy = 0;

    setCells([]);
    container.removeAllFromScene();
    container.meshes.forEach((mesh) => mesh.dispose());
    for (let x = -width / 2; x < width / 2; x++) {
      for (let y = -height / 2; y < height / 2; y++) {
        let cell = createCell(new Vector3(x * offset, y * offset, 0));
        let cellInformations = { cell: cell, x: ix, y: iy, alive: false };

        configureCell(cellInformations);
        newCells.push(cellInformations);
        container.meshes.push(cell);
        iy += 1;
      }
      ix += 1;
      iy = 0;
    }
    setCells(newCells);
    container.addAllToScene();
  };

  const configureCell = (cell) => {
    cell["cell"].material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    cell["cell"].actionManager = new BABYLON.ActionManager(sceneRef.current);
    cell["cell"].actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        function () {
          cell["cell"].material.diffuseColor = new BABYLON.Color3(
            0.65,
            0.65,
            0.65,
          );
          if (isDrawingRef.current) {
            cell["alive"] = !cell["alive"];
            cell["cell"].material.diffuseColor =
              cell["alive"] === true
                ? new BABYLON.Color3(0, 0, 0)
                : new BABYLON.Color3(1, 1, 1);
          }
        },
      ),
    );
    cell["cell"].actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        function () {
          cell["cell"].material.diffuseColor =
            cell["alive"] === true
              ? new BABYLON.Color3(0, 0, 0)
              : new BABYLON.Color3(1, 1, 1);
        },
      ),
    );
    cell["cell"].actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnLeftPickTrigger,
        function () {
          cell["alive"] = !cell["alive"];
          cell["cell"].material.diffuseColor =
            cell["alive"] === true
              ? new BABYLON.Color3(0, 0, 0)
              : new BABYLON.Color3(1, 1, 1);
          isDrawingRef.current = true;
        },
      ),
    );
    cell["cell"].actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickUpTrigger,
        function () {
          isDrawingRef.current = false;
        },
      ),
    );
  };

  const setupCamera = (camera) => {
    camera.setTarget(Vector3.Zero());
    camera.inputs.clear();
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    camera.orthoRight = defaultHorizontal;
    camera.orthoLeft = -defaultHorizontal;
    camera.orthoTop = defaultVertical;
    camera.orthoBottom = -defaultVertical;
  };

  const zoomCamera = (e) => {
    const camera = cameraRef.current;
    const delta = e.deltaY;
    const zoomFactor = 0.01;
    const zoom = delta * zoomFactor;

    if (delta < 0 && camera.orthoRight > 1) zoomOut(camera, zoom);
    else if (delta > 0 && camera.orthoRight < 10) zoomIn(camera, zoom);
  };

  const zoomIn = (camera, zoom) => {
    camera.orthoRight += zoom * defaultHorizontal;
    camera.orthoLeft -= zoom * defaultHorizontal;
    camera.orthoTop += zoom * defaultVertical;
    camera.orthoBottom -= zoom * defaultVertical;
  };

  const zoomOut = (camera, zoom) => {
    zoomIn(camera, zoom);
  };

  const handleKeyDown = (e) => {
    setKeysPressed((prevKeys) => ({ ...prevKeys, [e.key]: true }));
  };

  const handleKeyUp = (e) => {
    setKeysPressed((prevKeys) => ({ ...prevKeys, [e.key]: false }));
  };

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

  const createCell = (position) => {
    const newCell = BABYLON.MeshBuilder.CreateBox(
      "cell",
      { width: 0.1, height: 0.1, depth: 0.01 },
      sceneRef.current,
    );

    newCell.position = position;
    newCell.material = new BABYLON.StandardMaterial("mat", sceneRef.current);

    return newCell;
  };

  return (
    <div id="playground" className="flex flex-col h-full w-full relative">
      <div className="flex flex-col justify-center absolute right-4 w-1/4 h-full bg-transparent z-50 pointer-events-none">
        <div
          id="configurationPanel"
          className="flex flex-col w-full bg-midnight-opacity p-4 rounded-lg font-mono gap-10 pointer-events-auto"
        >
          <div id="configurations" className="flex flex-col gap-4 ">
            {/* 
                            Ask to the app block all the configuartion elements of the simulation such as : Size, Rules, etc...
                            Currently, the configuration panel is empty so Size as a functionnal placeholder
                            Should be in JSON format like this : {"name": "format"}
                            example : {"size": "number", "rules": "string", etc...}
                        */}
            <div id="size" className="flex flex-col w-full">
              <label className="text-midnight-text">Size</label>
              <input
                className="text-black"
                type="number"
                max={50}
                value={gridSize}
                min={5}
                onChange={(e) => {
                  setGridSize(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key == "Enter") createGrid(gridSize, gridSize);
                }}
              />
            </div>
          </div>
          <div id="start" className="flex justify-center">
            <button className="flex flex-col justify-center items-center w-3/4 h-10 bg-midnight-purple text-midnight-text rounded-lg">
              Start
            </button>
          </div>
        </div>
      </div>
      <div
        id="canvas"
        className="flex flex-col h-full w-full"
        onWheel={zoomCamera}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      >
        <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
          <Scene
            id="scene"
            onCreated={(scene) => {
              sceneRef.current = scene;
              setContainer(new BABYLON.AssetContainer(sceneRef.current));
            }}
          >
            <UniversalCamera
              name="camera1"
              position={new Vector3(0, 0, -5)}
              onCreated={onCameraCreated}
            />
            <HemisphericLight
              name="light1"
              intensity={2}
              direction={Vector3.Up()}
            />
          </Scene>
        </Engine>
      </div>
    </div>
  );
}
