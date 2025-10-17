import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electron', {
  send: (channel, data) => { ipcRenderer.send(channel, data); },
  receive: (channel, func) => { ipcRenderer.on(channel, (event, ...args) => func(...args)); },

  // API related IPC calls
  openDialog: (fileExtension) => ipcRenderer.invoke('open-dialog', fileExtension),
  loadFile: (filePath) => ipcRenderer.invoke('load-file', filePath),
  loadTextFile: (filePath) => ipcRenderer.invoke('load-text-file', filePath),
  saveJson: (data) => ipcRenderer.invoke('save-json', data),


  // Simulation related IPC calls
  callPlugin: (params) => ipcRenderer.invoke('call-plugin', params),
  installPlugin: (url, params) => ipcRenderer.invoke('install-plugin', url, params),
  deletePlugin: (params) => ipcRenderer.invoke('delete-plugin', params),
  getParametersNames: (params) => ipcRenderer.invoke('get-parameters-names', params),
  getParametersTypes: (params) => ipcRenderer.invoke('get-parameters-types', params),
  getParametersTypes: (params) => ipcRenderer.invoke('get-plugin-id-by-name', params),
  getParametersTypes: (params) => ipcRenderer.invoke('get-plugin-names', params),

  // Manager related IPC calls
  isAlgorithmInstalled: (params) => ipcRenderer.invoke('is-algorithm-installed', params),
  getAlgorithmParameters: (params) => ipcRenderer.invoke('get-simulation-parameters', params),

  // Visual manager related IPC calls
  isVisualInstalled: (params) => ipcRenderer.invoke('is-visual-installed', params),

  // External links
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // Get OS
  getOS: () => ipcRenderer.invoke('get-os'),

  // Mini server related
  getServerURL: () => ipcRenderer.invoke('get-server-url'),

  getVisualFolder: () => ipcRenderer.invoke('get-visual-folder'),

  // Store handling
  storeData: (data_name, data) => ipcRenderer.invoke('store-data', data_name, data),
  getData: (data_name) => ipcRenderer.invoke('get-data', data_name),
  deleteData: (data_name) => ipcRenderer.invoke('delete-data', data_name),

  // User session event
  onUserSession: (func) => { ipcRenderer.on('user-session', (event, ...args) => func(...args)); }
});
