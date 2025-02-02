const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  callSimulateLenia: (params) => ipcRenderer.invoke('call-simulate-lenia', params),
});