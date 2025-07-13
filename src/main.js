import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
//import started from 'electron-squirrel-startup';
import {load_starting_plugin, load_plugins_params, load_manager} from './plugins_handling.js';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
/*if (started) {
  app.quit();
}*/

await load_starting_plugin()
await load_manager()
load_plugins_params()
//test_simulate_gol_test()

let mainWindow;

const createWindow = () => {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
      contextIsolation: true
    },
    autoHideMenuBar: true,
    // frame: false Pour être frameless
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  console.log(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

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

ipcMain.on('save-json', (event, data) => {
  const filePath = dialog.showSaveDialogSync(mainWindow, {
    title: 'Save Simulation',
    defaultPath: path.join(app.getPath('documents'), 'simulation.json'),
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });

  if (!filePath) {
    console.log('Save dialog was cancelled', filePath);
    return;
  }

  if (filePath) {
    console.log('Saving file to:', filePath, 'with data:', data);

    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.error('Error saving file:', err);
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
    console.log('Open dialog was cancelled');
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