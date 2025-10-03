import { app, BrowserWindow, dialog, ipcMain, protocol, WebContentsView } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import {load_manager} from './plugins_handling.js';
import express from 'express';

let mainWindow;
let visualServer;
let serverPort;

const createWindow = () => {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false,
      contextIsolation: true,
      webviewTag: true
    },
    autoHideMenuBar: true,
    //frame: false // Pour être frameless
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow();
  createMiniServer();
  await load_manager();
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

const createMiniServer = () => {
  visualServer = express();
  const serverPath = app.isPackaged ? path.join(process.resourcesPath, "Visuals") : path.join(app.getAppPath(), "Visuals")
  console.log(serverPath);
  visualServer.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // autorise toutes les origines
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
  visualServer.use(express.static(serverPath));

  const server = visualServer.listen(0, () => {
    serverPort = server.address().port;
    console.log(`Visual server running at http://localhost:${serverPort}`);
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.on('save-json', (event, data) => {
  const filePath = dialog.showSaveDialogSync(mainWindow, {
    title: 'Save Simulation',
    defaultPath: path.join(app.getPath('documents'), 'simulation.json'),
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });

  if (!filePath) {
    return;
  }

  if (filePath) {

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        dialog.showErrorBox('Error', 'Failed to save the file.');
      } else {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Success',
          message: 'Simulation saved successfully!'
        });
      }
    });
  }
});

ipcMain.handle('open-dialog', async (e, fileExtension) => {
  const {canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Files', extensions: fileExtension.split(" ") }]
  });

  if (canceled) {
    return null;
  }
  return filePaths[0];
});

ipcMain.handle('load-text-file', async (event, filePath) => {
  return fs.promises.readFile(filePath, 'utf-8');
});

ipcMain.handle('load-file', async (event, filePath) => {
  return fs.promises.readFile(filePath);
});

ipcMain.handle('open-external', async (event, url) => {
  const { shell } = require('electron');
  await shell.openExternal(url);
});

ipcMain.handle('get-os', async () => {
  return process.platform;
});

ipcMain.handle('get-server-url', async () => {
  if (visualServer) {
    return `http://localhost:${serverPort}/`;
  }
});

ipcMain.handle('get-visual-folder', async () => {
  const visualFolderPath = app.isPackaged ? path.join(process.resourcesPath, "Visuals") : path.join(app.getAppPath(), "Visuals")
  return visualFolderPath;
});