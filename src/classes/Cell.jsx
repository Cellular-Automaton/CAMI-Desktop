import React from "react";
import {Graphics} from "pixi.js";
import { useEffect, useRef } from "react";

export default class Cell {
    constructor(x, y, id, type, sceneRef, isDrawingRef) {
        this.x = x;
        this.y = y;
        this.gap = 10;
        this.size = 100;
        this.shape = new Graphics();
        this.id = id;
        this.type = type;
        this.sceneRef = sceneRef;
        this.isDrawingRef = isDrawingRef;
        this.color = 0xFFFFFF;
        this.shape.interactive = true;
        this.shape.buttonMode = true;
        this.state = 0; // 0: dead, 1: alive

        this.setInterations();
    }

    draw() {
        this.shape.clear();
        this.shape.rect((this.x * (this.size + this.gap)) , (this.y * (this.size + this.gap)) + 10, this.size, this.size);
        this.shape.fill(this.color);
    }

    setUpAction() {
        // Set up actions for the cell
    }

    updateCell() {
        // Update the cell's visual representation
    }

    setState(state) {
        this.state = state;
        this.color = state == 0 ? 0xFFFFFF : 0x000000 ; // Black for dead, white for alive
        this.draw();
    }

    getCurrentState() {
        return this.state;
    }

    setInterations() {
        this.shape.on("pointerdown", (event) => {
            this.color = this.color === 0x000000 ? 0xFFFFFF : 0x000000;
            this.draw();
            this.state = this.state == 0 ? 1 : 0; // Toggle state between dead (0) and alive (1)
        });

        this.shape.on("pointerover", (event) => {
            this.shape.alpha = 0.5;
            this.shape.tint = 0xFF0000; // Change color on hover
            this.draw();
        });

        this.shape.on("pointerout", (event) => {
            this.shape.alpha = 1;
            this.shape.tint = 0xFFFFFF;
            this.draw();
        });
    }
}