import { ipcMain } from "electron/main";
import { dbManager } from "../data/db";

export const registerDatabaseIpc = () => {
  dbManager.init();

  ipcMain.handle("get-games", async () => {
    return dbManager.getGames();
  });

  ipcMain.handle("add-game", async (event, name, path) => {
    return dbManager.addGame(name, path);
  });

  ipcMain.handle("get-game", async (_, id) => {
    return dbManager.getGame(id);
  });
};
