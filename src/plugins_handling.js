export {load_starting_plugin, load_plugins_params, load_manager};
import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';

const extract = require('extract-zip');
const { app, ipcMain, BrowserWindow } = require('electron');

const plugins = []
const plugins_parameters = []
const pluginManager = {
    "plugins": [],
}


async function load_starting_plugin() {
    var pluginsPath = "";
    if (app.isPackaged) {
        pluginsPath = path.join(process.resourcesPath, 'Plugins/');
    } else {
        pluginsPath = path.join(app.getAppPath(), 'Plugins');
    }
    await fs.promises.access(pluginsPath)
    const files = await fs.promises.readdir(pluginsPath)
    for (const file of files) {
        if (!file.endsWith(".node"))
            continue;
        await fs.promises.access(path.join(pluginsPath, file))
        const full_path = path.join(pluginsPath, file);
        const tmp_name = file.slice(0, -5);
        const tmp = __non_webpack_require__(full_path)
        plugins.push([tmp_name, tmp]);
    }
} ;

async function load_manager() {
    var pluginsPath = "";
    if (app.isPackaged) {
        pluginsPath = path.join(process.resourcesPath, 'Plugins/algorithms.json');
    } else {
        pluginsPath = path.join(app.getAppPath(), 'Plugins/algorithms.json');
    }
    // If file does not exist, create an empty algorithms.json
    if (!fs.existsSync(pluginsPath)) {
        await fs.promises.writeFile(pluginsPath, JSON.stringify({ plugins: [] }), { flag: 'w+'});
    }
    await fs.promises.access(pluginsPath)
    const data = await fs.promises.readFile(pluginsPath, 'utf-8');
    const jsonData = JSON.parse(data);
    pluginManager.plugins = jsonData.plugins;

    // Get the module & parameters for each plugin
    pluginManager.plugins = pluginManager.plugins.map(plugin => {
        const pluginPath = app.isPackaged ?
            path.join(process.resourcesPath, plugin.path) : path.join(app.getAppPath(), plugin.path);
        const pluginModule = __non_webpack_require__(pluginPath);
        if (!pluginModule) {
            console.error(`Failed to load plugin: ${plugin.name} at path: ${pluginPath}`);
            return null;
        }
        const pluginParameters = pluginModule.get_params ? pluginModule.get_params() : [];
        return { ...plugin, path: pluginPath, module: pluginModule, parameters: pluginParameters };
    });
};

function load_plugins_params() {
    for (const [_, obj] of plugins) {
        var tmp = obj.get_params();
        plugins_parameters.push(tmp);
    }
};

ipcMain.handle('is-algorithm-installed', async (event, params) => {
    const algorithmName = params[0];
    const installedAlgorithms = pluginManager.plugins.map(plugin => plugin.bdd_id);
    return installedAlgorithms.includes(algorithmName);
});

ipcMain.handle('get-parameters-types', async (event, params) => {
    var result = [];
    for (const obj of plugins_parameters[params[0]])
        result.push(obj.split(':')[1]);
    return result;
});

ipcMain.handle('get-parameters-names', async (event, params) => {
    var result = [];
    for (const obj of plugins_parameters[params[0]])
        result.push(obj.split(':')[0]);
    return result;
});

ipcMain.handle('get-plugin-id-by-name', async(event, params) => {
    var i = 0;
    for (const [name, _] of plugins) {
        if (name == params[0])
            return i;
        i++;
    }
    return -1;
})

ipcMain.handle('get-plugin-names', async(event, params) => {
    var i = [];
    for (const [name, _] of plugins) {
        i.push(name);
    }
    return i;
})


ipcMain.handle('delete-plugin', async (event, param) => {
    if (!app.isPackaged)
        throw new Error("App is not packaged. Cant modify plugins");
    if (!path.include(process.resourcesPath, 'Plugins/'))
        throw new Error("not from the plugin folder");
    await fs.promises.access(param[0]);
    await fs.promises.rm(param[0]);
});

// ipcMain.handle('install-plugin', async (event, param) => {
//     
//     if (!app.isPackaged)
//         throw new Error("App is not packaged. Cant modify plugins");
//     await fs.promises.access(param[0]);
//     var split = path.split('-');
//     var full_path = path.join(process.resourcesPath, 'Plugins/' + split[-1]);
//     await fs.promises.copyFile(path, full_path,fs.constants.COPYFILE_EXCL);
//     const tmp = __non_webpack_require__(full_path);
//     plugins.push(tmp);
// });

// ipcMain.handle('install-plugin', async (event, param) => {
//     const json = param.data;
//     
//     // write my three folders in the plugins folder
//     const pluginsPath = app.isPackaged ? path.join(process.resourcesPath, 'Plugins') : path.join(app.getAppPath(), 'Plugins');
//     json.file.forEach(element => {
//         const buffer = Buffer.from(element.contents, 'base64');
//         fs.writeFileSync(path.join(pluginsPath, json.name + element.name), buffer);
//     });

//     // Add the plugin to the manager
//     const managerPath = app.isPackaged ? path.join(process.resourcesPath, 'Plugins/algorithms.json') : path.join(app.getAppPath(), 'Plugins/algorithms.json');
//     const managerData = JSON.parse(fs.readFileSync(managerPath, 'utf-8'));
//     var managerJson = {
//         name: json.name,
//         bdd_id: json.automaton_id,
//         version: "1.0.0",
//         path: "Plugins/" + json.name + '.node',
//         author: "Unknown",
//         license: "MIT",
//     }
//     managerData.plugins.push(managerJson);
//     fs.writeFileSync(managerPath, JSON.stringify(managerData, null, 2));

//     const newModule = __non_webpack_require__(path.join(pluginsPath, json.name + '.node'));
//     const parameters = newModule.get_params ? newModule.get_params() : [];
//     pluginManager.plugins.push({
//         ...managerJson,
//         module: newModule,
//         parameters: parameters
//     });
// });

ipcMain.handle('install-plugin', async (event, url, param) => {
    // Download ZIP from URL
    // Unzip it in the plugins folder
    // Add the plugin to the manager
    // Load the plugin in memory
    const filePath = app.isPackaged ? path.join(process.resourcesPath, 'Plugins') : path.join(app.getAppPath(), 'Plugins');
    const managerPath = app.isPackaged ? path.join(process.resourcesPath, 'Plugins/algorithms.json') : path.join(app.getAppPath(), 'Plugins/algorithms.json');
    const managerData = JSON.parse(fs.readFileSync(managerPath, 'utf-8'));

    try {
        // Start download
        const response = await axios.get(url, { 
            responseType: 'arraybuffer',
            auth: {}
        });
        const directory = path.join(filePath, param.automaton_id);
        fs.writeFileSync(path.join(filePath, param.automaton_id + '.zip'), response.data);
        fs.mkdirSync(directory, { recursive: true });
        await extract(path.join(filePath, param.automaton_id + '.zip'), { dir: directory });

        // Delete the zip file
        fs.unlinkSync(path.join(filePath, param.automaton_id + '.zip'));

        // get name of .node file
        const nodeFiles = fs.readdirSync(directory).filter(file => file.endsWith('.node'));
        if (nodeFiles.length === 0) {
            throw new Error("No .node file found in the extracted plugin");
        }
        const pluginPath = path.join(directory, nodeFiles[0]);
        const managerJson = {
            name: param.name,
            bdd_id: param.automaton_id,
            version: "1.0.0",
            path: pluginPath.replace(app.isPackaged ? process.resourcesPath : app.getAppPath(), '').replace(/\\/g, '/').replace(/^\/+/g, ''),
            author: "Unknown",
            license: "MIT",
        }
        managerData.plugins.push(managerJson);
        fs.writeFileSync(managerPath, JSON.stringify(managerData, null, 2));

        const pluginModule = __non_webpack_require__(pluginPath);
        const pluginParameters = pluginModule.get_params ? pluginModule.get_params() : [];
        pluginManager.plugins.push({
            ...managerJson,
            module: pluginModule,
            parameters: pluginParameters
        });
        return;
    } catch (error) {
        console.error("Error downloading plugin:", error);
        return;
    };
});

// First parameter is the plugin index, the rest are the parameters
ipcMain.handle('call-plugin', async (event, params) =>{
    const  [, ...rest] = params
    var types = [];
    var converted = []

    const p = pluginManager.plugins.find((plugin) => plugin.bdd_id === params[0]);
    if (!p) {
        console.error("Plugin not found:", params[0]);
        throw new Error("Plugin not found");
    }
    for (const obj of p.parameters)
        types.push(obj.split(':')[1]);

    for (const [i, obj] of types.entries()) {
        if (obj == "Array")
            converted.push(new Array(rest[i]))
        if (obj == "Int16Array")
            converted.push(new Int16Array(rest[i]))
        if (obj == "Uint16Array")
            converted.push(new Uint16Array(rest[i]))
        if (obj == "Int32Array")
            converted.push(new Int32Array(rest[i]))
        if (obj == "Uint32Array")
            converted.push(new Uint32Array(rest[i]))
        if (obj == "Float32Array")
            converted.push(new Float32Array(rest[i]))
        if (obj == "Float64Array")
            converted.push(new Float64Array(rest[i]))
        if (obj == "Number")
            converted.push(new Number(rest[i]).valueOf())
    }
    const plugin = p.module;
    try {
        const results = plugin.simulate(...converted);
        return results;
    } catch (error) {
        console.error("Error calling plugin:", error);
        throw error;
    }
});

ipcMain.handle('get-simulation-parameters', async (event, params) => {
    const p = pluginManager.plugins.find((plugin) => plugin.bdd_id === params[0]);
    if (!p) {
        console.error("Plugin not found:", params[0]);
        throw new Error("Plugin not found");
    }
    return p.parameters;
});
