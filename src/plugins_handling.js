export {plugins, load_starting_plugin};
import fs from 'node:fs';
import path from 'node:path';
const { app } = require('electron');

const plugins = []

async function load_starting_plugin() {

    const pluginsPath = "";
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

async function load_plugin(path) {
//    const new_plugin = await require(path);
//    plugins.push(new_plugin)
}
