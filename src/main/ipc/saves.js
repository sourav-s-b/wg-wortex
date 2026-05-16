import { app, ipcMain } from "electron";
import path from "path";
import fs from "fs-extra";

const SAVES_PATH = path.join(app.getPath("userData"), "Saves");

export function registerSaveIpc() {
  const getSanitized = (name) => name.replace(/\s+/g, "_").toLowerCase();

  ipcMain.handle("get-saves", async (_, gameName) => {
    try {
      const sanitized = getSanitized(gameName);
      const gameSavesPath = path.join(SAVES_PATH, sanitized);

      if (!fs.existsSync(gameSavesPath)) {
        await fs.ensureDir(path.join(gameSavesPath, "Default"));
        await fs.ensureDir(path.join(gameSavesPath, "AutoSave"));
        return {
          success: true,
          data: [
            { playthrough: "AutoSave", saves: [] },
            { playthrough: "Default", saves: [] },
          ],
        };
      }

      const playthroughs = await fs.readdir(gameSavesPath);
      const result = await Promise.all(
        playthroughs.map(async (playthrough) => {
          const playthroughPath = path.join(gameSavesPath, playthrough);

          const stat = await fs.stat(playthroughPath);
          if (stat.isDirectory()) {
            const files = await fs.readdir(playthroughPath);
            const saves = await Promise.all(
              files
                .filter((file) => file.endsWith(".json"))
                .map(async (file) => {
                  const name = path.parse(file).name;
                  const fileStat = await fs.stat(
                    path.join(playthroughPath, file),
                  );
                  return {
                    name: name,
                    createdAt: fileStat.birthtime,
                  };
                }),
            );
            saves.sort((a, b) => {
              const timeA = a.createdAt ? a.createdAt.getTime() : 0;
              const timeB = b.createdAt ? b.createdAt.getTime() : 0;
              return timeB - timeA;
            });
            return { playthrough, saves };
          }
          return null;
        }),
      );
      return { success: true, data: result.filter((item) => item !== null) };
    } catch (err) {
      console.error("Error in getting the saves", err.message);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle(
    "manual-save",
    async (event, { gameName, saveName, playthrough = "Default", payload }) => {
      try {
        const sanitized = getSanitized(gameName);
        const savePath = path.join(
          SAVES_PATH,
          sanitized,
          playthrough,
          `${saveName}.json`,
        );

        const data =
          typeof payload === "string"
            ? payload
            : JSON.stringify(payload, null, 2);

        await fs.ensureDir(path.dirname(savePath));
        await fs.writeFile(savePath, data, "utf-8");

        return {
          success: true,
          save: saveName,
        };
      } catch (err) {
        console.error("Save Error: ", err.message);
        return { success: false, error: err.message };
      }
    },
  );

  ipcMain.handle(
    "add-playthrough",
    async (_, { gameName, playthroughName }) => {
      try {
        const sanitized = getSanitized(gameName);
        const playthoughPath = path.join(
          SAVES_PATH,
          sanitized,
          playthroughName,
        );
        await fs.ensureDir(playthoughPath);
        return { success: true, playthough: playthroughName };
      } catch (err) {
        console.error("Playthrough Error: ", err.message);

        return { success: false, error: err.message };
      }
    },
  );

  ipcMain.handle(
    "delete-save",
    async (_, { gameName, playthrough, saveName }) => {
      try {
        const sanitized = getSanitized(gameName);
        const savePath = path.join(
          SAVES_PATH,
          sanitized,
          playthrough,
          `${saveName}.json`,
        );

        await fs.remove(savePath);

        return { success: true, save: saveName };
      } catch (err) {
        console.error("Error in deleting the saves", err.message);
        return { success: false, error: err.message };
      }
    },
  );

  ipcMain.handle(
    "load-save",
    async (_, { gameName, playthrough, saveName }) => {
      try {
        const sanitized = getSanitized(gameName);
        const savePath = path.join(
          SAVES_PATH,
          sanitized,
          playthrough,
          `${saveName}.json`,
        );

        if (!(await fs.pathExists(savePath))) {
          return { success: false, error: "Save file not found" };
        }

        const payLoadData = await fs.readJson(savePath);
        return { success: true, data: payLoadData };
      } catch (err) {
        console.error("Load Error ", err.message);
        return { success: false, error: err.message };
      }
    },
  );
}
