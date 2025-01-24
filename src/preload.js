const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  callSimulateLenia: () => ipcRenderer.invoke('call-simulate-lenia'),
});