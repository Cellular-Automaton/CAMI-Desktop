import React from "react";
import {Graphics} from "pixi.js";
import { useEffect, useRef } from "react";
import chroma from "chroma-js";

export default class RangeCell {
    constructor(x, y, id, type, sceneRef, isDrawingRef, colorScale) {
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
        this.state = 0;
        this.colorScale = colorScale || chroma.scale(['#c31432', '#240b36']).domain([0, 1]);

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
        this.color = this.colorScale(state).hex();
        this.draw();
    }

    getCurrentState() {
        return this.state;
    }

    setInterations() {
        this.shape.on("pointerdown", (event) => {
            this.color = this.state == 0 ? this.colorScale(1).hex() : this.colorScale(0).hex();
            this.draw();
            this.state = this.state == 0 ? 1 : 0; // Toggle state between dead (0) and alive (1)
        });

        this.shape.on("pointerover", (event) => {
            this.shape.alpha = 0.5;
            this.draw();
        });

        this.shape.on("pointerout", (event) => {
            this.shape.alpha = 1;
            this.draw();
        });
    }
}