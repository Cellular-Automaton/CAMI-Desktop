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

ipcMain.handle('get-visual-by-id', async (event, visual_id) => {
    try {
        const visual = visualManager.visuals.find(v => v.bdd_id === visual_id);
        return visual !== undefined ? visual : null;
    } catch (error) {
        console.error("Error fetching visual:", error);
        return null;
    }
});

ipcMain.handle('install-visual', async (event, url, visual) => {
    try {
        console.log("Visual download response:", url);
        const response = await axios.get(url, { headers: { Authorization: undefined }, responseType: 'arraybuffer'});
        const visualData = response.data;
        console.log("Visual data length:", visualData);
        const dirPath = get_path() + `/${visual.id}`;
        await fs.promises.mkdir(dirPath, { recursive: true });
        const visualPath = get_path() + `/${visual.id}/${visual.name}.js`;
        await fs.promises.writeFile(visualPath, visualData);
        visualManager.visuals.push({
            bdd_id: visual.id,
            name: visual.name,
            version: "1.0.0",
            path: `Visuals/${visual.id}/${visual.name}.js`,
            author: visual.author || "Unknown",
        });
        await save_visual_manager();
        console.log(response);
    } catch (error) {
        console.error("Error installing visual:", error);
        throw error;
    }
});

ipcMain.handle('install-try-visual', async (event, visual_file) => {
    // visual_file is a js file
    // Do not use eval for security reasons
    try {
        const visualData = Buffer.from(visual_file, 'utf-8');
        const installPath = get_path() + `/try.js`;
        await fs.promises.writeFile(installPath, visualData);
        return installPath;
    } catch (error) {
        console.error("Error installing try visual:", error);
        throw error;
    }
})

ipcMain.handle('remove-try-visual', async (event) => {
    try {
        const installPath = get_path() + `/try.js`;
        await fs.promises.unlink(installPath);
    } catch (error) {
        console.error("Error removing try visual:", error);
        throw error;
    }
});
