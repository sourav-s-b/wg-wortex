import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("windowAPI", {
  onMaximized: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on("window-maximized", subscription);
    return () => ipcRenderer.removeListener("window-maximized", subscription);
  },
  onUnmaximized: (callback) => {
    const subscription = () => callback();
    ipcRenderer.on("window-unmaximized", subscription);
    return () => ipcRenderer.removeListener("window-unmaximized", subscription);
  },
  onForceAutoSave: (callback) => {
    const subscription = (_event) => callback();
    ipcRenderer.on("request-force-autosave", subscription);
    return () =>
      ipcRenderer.removeListener("request-force-autosave", subscription);
  },
  confirmSaveFinished: () => ipcRenderer.send("force-autosave-finished"),
  maximize: () => ipcRenderer.invoke("window-maximize-request"),
  unmaximize: () => ipcRenderer.invoke("window-unmaximize-request"),
  close: () => ipcRenderer.invoke("window-close-request"),
  minimize: () => ipcRenderer.invoke("window-minimize-request"),
});

contextBridge.exposeInMainWorld("dbAPI", {
  getGames: () => ipcRenderer.invoke("get-games"),
  getGame: (id) => ipcRenderer.invoke("get-game", id),
  addGame: (name, path, type) =>
    ipcRenderer.invoke("add-game", name, path, type),
});

contextBridge.exposeInMainWorld("saveAPI", {
  getSaves: (gameName) => ipcRenderer.invoke("get-saves", gameName),
  saveGame: (gameName, saveName, playthrough = "Default", payload) =>
    ipcRenderer.invoke("manual-save", {
      gameName,
      saveName,
      playthrough,
      payload,
    }),
  deleteSave: (gameName, playthrough, saveName) =>
    ipcRenderer.invoke("delete-save", { gameName, playthrough, saveName }),
  loadSave: (gameName, playthrough, saveName) =>
    ipcRenderer.invoke("load-save", { gameName, playthrough, saveName }),
  addPlaythrough: (gameName, playthroughName) =>
    ipcRenderer.invoke("add-playthrough", { gameName, playthroughName }),
});
