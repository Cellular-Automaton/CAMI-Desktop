import { Vector3 } from "@babylonjs/core";
import * as BABYLON from "babylonjs";
import { hexToBabylonColor3 } from "../utils/ColorConverter.jsx";

export default class Cell {
    constructor(x, y, id, state, currentScene, isDrawingRef) {
        this.x = x;
        this.y = y;
        this.cell = BABYLON.MeshBuilder.CreateBox("cell", {width: 0.1, height: 0.1, depth: 0.01}, currentScene.current);
        this.cell.position = new Vector3(this.x, this.y, 0);
        this.cell.material = new BABYLON.StandardMaterial("mat", currentScene.current);
        this.states = {};

        this._id = id;
        this._oldState = state;
        this._currentState = state;
        this._stateIndex = 0;
        this._configureStates = {"hover": ["0x0000FF", -1], "creation": ["0x88364D", -1]};
        this._isDrawingRef = isDrawingRef;
        this.updateCell();
    }

    /*
     * Allows to set all the states that a cell can have
     * @param {Object} states - The states must be like this {"name": "color"} with the color in hexadecimal
     */
    setStates(states) {
        this.states = states;
        const stateKeys = Object.keys(this.states);
        this._currentState = stateKeys[0];
        this.oldState = this.currentState;
        
        this.updateCell();
    }

    /*
     * Allows to register an action manager to the cell
     * @param {Object}
     */
    registerActionManager(actionManager) {
        this.cell.actionManager = actionManager;
    }

    setUpAction() {
        this.cell.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, () => {
            this.oldState = this.currentState;
            this.currentState = "hover";
            this.updateCell();
        }));
        this.cell.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () => {
            this.currentState = this.oldState;
            this.oldState = "hover";
            this.updateCell();
        }));
        this.cell.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnLeftPickTrigger, () => {
            this.oldState = this.currentState;
            const stateKeys = Object.keys(this.states);
            this._stateIndex = (this._stateIndex + 1) % stateKeys.length;
            this._currentState = stateKeys[this._stateIndex];
            this._isDrawingRef.current = true;
            this.updateCell();
        }));
        this.cell.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
            this._isDrawingRef.current = false;
            this.updateCell();
        }));
    }

    setDownAction() {
        this.cell.actionManager = null;
    }

    /*
     * Allows to update the cell with the current state
     */
    updateCell() {
        const allStates = { ...this.states, ...this._configureStates };

        const color = allStates[this._currentState][0];
        this.cell.material.diffuseColor = hexToBabylonColor3(color);
    }

    /*
     * Allows to get state of a cell with a number
     */
    getCurrentState() {
        return this.states[this._currentState][1];
    }

    /*
     *
     */
    setCurrentState(numberState) {
        const stateKeys = Object.keys(this.states);

        for (let index = 0; index < stateKeys.length; index++) {
            if (this.states[stateKeys[index]][1] === numberState) {
                this._currentState = stateKeys[index];
                break;
            }
        }
        this.updateCell();
    }
}