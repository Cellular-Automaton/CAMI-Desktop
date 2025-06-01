const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  callSimulateGol: (params) => ipcRenderer.invoke('call-simulate-gol', params),
  callPlugin: (params) => ipcRenderer.invoke('call-plugin', params),
  installPlugin: (params) => ipcRenderer.invoke('install-plugin', params),
  deletePlugin: (params) => ipcRenderer.invoke('delete-plugin', params),
  getParametersNames: (params) => ipcRenderer.invoke('get-parameters-names', params),
  getParametersTypes: (params) => ipcRenderer.invoke('get-parameters-types', params),
});
