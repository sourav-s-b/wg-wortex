import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1100,
        height: 700,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, '../preload/preload.mjs'),
            sandbox: false
        }
    });


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