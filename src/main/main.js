import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { registerWindowIpc } from './ipc/window';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 700,
        show: false,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.mjs'),
            sandbox: false
        }
    });


    //ipc's
    registerWindowIpc(mainWindow);

    if (process.env.ELECTRON_RENDERER_URL) {
        mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        // Open DevTools automatically while we are building
        mainWindow.webContents.openDevTools()
    })
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => app.quit());