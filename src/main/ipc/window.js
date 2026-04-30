import { ipcMain } from "electron";

export function registerWindowIpc(mainWindow) {
    ipcMain.handle('window-maximize-request', () => {
        if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
            return false
        } else {
            mainWindow.maximize();
        }
    });

    ipcMain.handle('window-unmaximize-request', () => {
        mainWindow.unmaximize();
        return false
    });

    ipcMain.handle('window-close-request', () => {
        mainWindow.close();
    })

    ipcMain.handle('window-minimize-request', () => {
        mainWindow.minimize();
    })


    mainWindow.on('maximize', () => mainWindow.webContents.send('window-maximized'));
    mainWindow.on('unmaximize', () => mainWindow.webContents.send('window-unmaximized'));
}