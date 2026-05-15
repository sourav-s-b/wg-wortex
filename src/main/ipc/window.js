import { ipcMain } from "electron";

export function registerWindowIpc(mainWindow) {
  ipcMain.handle("window-maximize-request", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      return false;
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.handle("window-unmaximize-request", () => {
    mainWindow.unmaximize();
    return false;
  });

  let isReadyToClose = false;
  ipcMain.handle("window-close-request", () => {
    if (isReadyToClose) {
      mainWindow.close();
      return;
    }
    mainWindow.webContents.send("request-force-autosave");

    setTimeout(() => {
      isReadyToClose = true;
      mainWindow.close();
    }, 3000);
  });

  ipcMain.on("force-autosave-finished", () => {
    isReadyToClose = true;
    mainWindow.close();
  });

  ipcMain.handle("window-minimize-request", () => {
    mainWindow.minimize();
  });

  mainWindow.on("maximize", () =>
    mainWindow.webContents.send("window-maximized"),
  );
  mainWindow.on("unmaximize", () =>
    mainWindow.webContents.send("window-unmaximized"),
  );
}
