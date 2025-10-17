export { load_visual_manager };
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import axios from 'axios';

const { app, ipcMain } = require('electron');

const visualManager = {};

// Function to load visual manager
const load_visual_manager = async () => {
    try {
        const path = get_path() + "/visuals.json";
        if (!fs.existsSync(path)) {
            // Create the file if it doesn't exist
            fs.promises.writeFile(path, JSON.stringify({ visuals: [] }, null, 4), {flag: 'w+'});
        }
        const files = fs.readFileSync(path);
        visualManager.visuals = JSON.parse(files).visuals;
    } catch (error) {
        console.error("Error loading visual manager:", error);
    }
};

const save_visual_manager = async () => {
    try {
        const path = get_path() + "/visuals.json";
        await fs.promises.writeFile(path, JSON.stringify(visualManager, null, 4), {flag: 'w+'});
    } catch (error) {
        console.error("Error saving visual manager:", error);
    }
};

const get_path = () => {
    let vpath;
    if (app.isPackaged) {
        vpath = path.join(process.resourcesPath, 'Visuals/');
    } else {
        vpath = path.join(app.getAppPath(), 'Visuals');
    }
    return vpath;
};

ipcMain.handle('is-visual-installed', async (event, visual_id) => {
    try {
        const visual = visualManager.visuals.find(v => v.bdd_id === visual_id);
        return visual !== undefined;
    } catch (error) {
        console.error("Error checking visual installation:", error);
        return false;
    }
});