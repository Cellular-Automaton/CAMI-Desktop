import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  callSimulateGol: (params) => ipcRenderer.invoke('call-simulate-gol', params),

  send: (channel, data) => { ipcRenderer.send(channel, data); },
  receive: (channel, func) => { ipcRenderer.on(channel, (event, ...args) => func(...args)); },

  openDialog: () => ipcRenderer.invoke('open-dialog'),
  loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
});
