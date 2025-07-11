import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {

  send: (channel, data) => { ipcRenderer.send(channel, data); },
  receive: (channel, func) => { ipcRenderer.on(channel, (event, ...args) => func(...args)); },

  // API related IPC calls
  openDialog: (fileExtension) => ipcRenderer.invoke('open-dialog', fileExtension),
  loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
  loadTextFile: (filePath) => ipcRenderer.invoke('load-text-file', filePath),

  // Simulation related IPC calls
  callPlugin: (params) => ipcRenderer.invoke('call-plugin', params),
  installPlugin: (params) => ipcRenderer.invoke('install-plugin', params),
  deletePlugin: (params) => ipcRenderer.invoke('delete-plugin', params),
  getParametersNames: (params) => ipcRenderer.invoke('get-parameters-names', params),
  getParametersTypes: (params) => ipcRenderer.invoke('get-parameters-types', params),
});
