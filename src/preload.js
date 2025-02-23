const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  callSimulateGol: (params) => ipcRenderer.invoke('call-simulate-gol', params),
});