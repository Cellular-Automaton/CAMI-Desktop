export {load_starting_plugin, load_plugins_params};
import fs from 'node:fs';
import path from 'node:path';
const { app, ipcMain } = require('electron');

const plugins = []
const plugins_parameters = []

async function load_starting_plugin() {
    var pluginsPath = "";
    if (app.isPackaged) {
        pluginsPath = path.join(process.resourcesPath, 'Plugins/');
    } else {
        pluginsPath = path.join(app.getAppPath(), 'Plugins');
    }
    console.log(pluginsPath)
    await fs.promises.access(pluginsPath)
    const files = await fs.promises.readdir(pluginsPath)
    for (const file of files) {
        console.log(file);
        await fs.promises.access(path.join(pluginsPath, file))
        const full_path = path.join(pluginsPath, file);
        console.log(full_path);
        const tmp = __non_webpack_require__(full_path)
        plugins.push(tmp);
    }
} ;

function load_plugins_params() {
    for (const obj of plugins) {
        var tmp = obj.get_params();
        plugins_parameters.push(tmp);
    }
};

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


ipcMain.handle('delete-plugin', async (event, param) => {
    console.log(param)
    if (!app.isPackaged)
        throw new Error("App is not packaged. Cant modify plugins");
    if (!path.include(process.resourcesPath, 'Plugins/'))
        throw new Error("not from the plugin folder");
    await fs.promises.access(param[0]);
    await fs.promises.rm(param[0]);
});

ipcMain.handle('install-plugin', async (event, param) => {
    console.log(param)
    if (!app.isPackaged)
        throw new Error("App is not packaged. Cant modify plugins");
    await fs.promises.access(param[0]);
    var split = path.split('-');
    var full_path = path.join(process.resourcesPath, 'Plugins/' + split[-1]);
    await fs.promises.copyFile(path, full_path,fs.constants.COPYFILE_EXCL);
    const tmp = __non_webpack_require__(full_path);
    plugins.push(tmp);
});

ipcMain.handle('call-plugin', async (event, params) =>{
    const  [, ...rest] = params
    var types = [];
    var converted = []


    for (const obj of plugins_parameters[params[0]])
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
    return plugins[params[0]].simulate(...converted);
});

ipcMain.handle('call-simulate-gol', async (event, params) => {
  console.log(params);
  try {
    console.log('Paramètres reçus:', params);
    var tab = new Uint32Array([0, 0, 0, 0, 0,
                               0, 0, 1, 0, 0,
                               0, 0, 1, 0, 0,
                               0, 0, 1, 0, 0,
                               0, 0, 0, 0, 0])
      const n1 = new Number(5)
      const n2 = new Number(5)

      var result = plugins[0].simulate_gol(tab, n1.valueOf(), n2.valueOf());
      console.log(result);
    return result; //Call the native function
  } catch (error) {
    console.error('Error calling simulate_gol:', error);
    throw error;
  }
});


