/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.jsx';

async function callElectronAPI() {
    try {

        const result = await window.electron.callSimulateLenia();
        console.log('Result from Electron API:', result);
    } catch (error) {
        console.error('Error calling Electron API:', error);
    }
}

//callElectronAPI();

/* var worker = new Worker(new URL('./worker.js', import.meta.url));
worker.onmessage = function(event) {
   //print result on console and h1 tag
   console.log("worker : ", event.data);
   document.querySelector('h1').innerHTML = "native addon add function(3, 4): " + event.data;   //terminate webworker
   worker.terminate();
   //set it to undefined
   worker = undefined;
}
worker.onerror = function (event) {
  console.log(event.message, event);
};
worker.postMessage('start');
*/



console.log('👋 This message is being logged by "renderer.js", included via webpack');
