const { contextBridge, ipcRenderer } = require("electron");

console.log("Webview preload script loaded", contextBridge, ipcRenderer);

contextBridge.exposeInMainWorld("electronAPI", {
  sendToHost: (msg) => ipcRenderer.sendToHost("from-webview", msg)
});