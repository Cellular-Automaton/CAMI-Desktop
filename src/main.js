import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import Store from "electron-store"
import {load_manager} from './plugins_handling.js';

let mainWindow;

const store = new Store();

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
      contextIsolation: true
    },
    autoHideMenuBar: true,
    //frame: false // Pour être frameless
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow();

  // Load plugins
  await load_manager();

  // Handle user session

  if (user) {
    mainWindow.webContents.on('did-finish-load', () => {
      const user = store.get('user');
      if (user) {
        mainWindow.webContents.send('user-session', user);
      }
    });
  }

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

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

ipcMain.handle('save-json', (event, data) => {
  const filePath = dialog.showSaveDialogSync(mainWindow, {
    title: 'Save Simulation',
    defaultPath: path.join(app.getPath('documents'), 'simulation.json'),
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });

  if (!filePath) {
    return;
  }

  const dataToText = JSON.stringify(data, null, 2);
  fs.writeFile(filePath, dataToText, (err) => {
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

ipcMain.handle('store-data', (event, data_name, data) => {
    try {
        store.set(data_name, data);
        return;
    } catch (error) {
        throw new Error("Error storing data: " + error.message);
    }
});

ipcMain.handle('get-data', (event, data_name) => {
    try {
        const data = store.get(data_name);
        return data;
    } catch (error) {
        throw new Error("Error retrieving data: " + error.message);
    }
});

ipcMain.handle('delete-data', (event, data_name) => {
  try {
      store.delete(data_name);
      return;
  } catch (error) {
      throw new Error("Error deleting data: " + error.message);
  }
});