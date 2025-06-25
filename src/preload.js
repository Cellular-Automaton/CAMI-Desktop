import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  callSimulateGol: (params) => ipcRenderer.invoke('call-simulate-gol', params),

  send: (channel, data) => { ipcRenderer.send(channel, data); },
  receive: (channel, func) => { ipcRenderer.on(channel, (event, ...args) => func(...args)); },

  openDialog: (fileExtension) => ipcRenderer.invoke('open-dialog', fileExtension),
  loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
  loadTextFile: (filePath) => ipcRenderer.invoke('load-text-file', filePath)
});
