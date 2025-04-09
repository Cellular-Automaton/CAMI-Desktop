export {plugins, load_starting_plugin};
import fs from 'node:fs';

const plugins = []

async function load_starting_plugin() {
    const gol = await require('./communication/build/Release/addon.node');  // Load the .node file
    plugins.push(gol)
} ;
