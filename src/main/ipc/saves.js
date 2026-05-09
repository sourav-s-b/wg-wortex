import { app, ipcMain } from "electron";
import path from "path";
import fs from "fs-extra";
import AdmZip from "adm-zip";

const PARTIONS_PATH = path.join(app.getPath("userData"), "Partitions");
const SAVES_PATH = path.join(app.getPath("userData"), "Saves");

export function registerSaveIpc() {
  const getSanitized = (name) => name.replace(/\s+/g, "_").toLowerCase();

  ipcMain.handle(
    "manual-save",
    async (event, { gameName, saveName, playthrough = "Default" }) => {
      const tempPath = path.join(
        app.getPath("temp"),
        "wg-vortex",
        `vortex_temp_${Date.now()}`,
      );
      try {
        const sanitized = getSanitized(gameName);

        const folderOptions = [
          sanitized,
          `persist_${sanitized}`,
          `persist:${sanitized}`,
        ];

        let actualFolderName = folderOptions.find((folder) =>
          fs.existsSync(path.join(PARTIONS_PATH, folder)),
        );

        if (!actualFolderName) {
          console.error(`Game data folder not found in ${PARTIONS_PATH}`);
          return {
            success: false,
            error: `Game data folder not found in ${PARTIONS_PATH}`,
          };
        }

        playthrough = playthrough ?? "Default";

        const source = path.join(PARTIONS_PATH, actualFolderName);
        const destZip = path.join(
          SAVES_PATH,
          sanitized,
          playthrough,
          `${saveName}.zip`,
        );

        const zip = new AdmZip();
        //copying to temp with filters
        await fs.copy(source, tempPath, {
          filter: (src) => {
            const isBloat = src.includes("Cache") || src.includes("Network");
            const isLock = src.includes(".lock") || src.includes("LOCK");
            return !isBloat && !isLock;
          },
        });

        //adding to zip
        zip.addLocalFolder(tempPath);

        // writing save zip
        await fs.ensureDir(path.dirname(destZip));
        await zip.writeZipPromise(destZip);

        return {
          success: true,
        };
      } catch (err) {
        console.error("Save Error: ", err);
        return { success: false, error: err.message };
      } finally {
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
        fs.ensureDir(playthoughPath);
        return { success: true };
      } catch (error) {
        console.error("Playthrough Error: ", error);

        return { success: false, error: err.message };
      }
    },
  );

  ipcMain.handle("get-saves", async (_, gameName) => {
    try {
      const sanitized = getSanitized(gameName);
      const gameSavesPath = path.join(SAVES_PATH, sanitized);

      if (!fs.existsSync(gameSavesPath)) {
        fs.ensureDir(gameSavesPath);
        return { success: true, data: [] };
      }

      const playthroughs = await fs.readdir(gameSavesPath);
      const result = [];

      for (const playthrough of playthroughs) {
        const playthroughPath = path.join(gameSavesPath, playthrough);

        const stat = await fs.stat(playthroughPath);
        if (stat.isDirectory()) {
          const files = await fs.readdir(playthroughPath);
          const saves = files
            .filter((file) => file.endsWith(".zip"))
            .map((file) => path.parse(file).name);

          result.push({
            playthrough: playthrough,
            saves: saves,
          });
        }
      }
      return { success: true, data: result };
    } catch (err) {
      console.error("Error in getting the saves", err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle(
    "delete-save",
    async (_, { gameName, playthrough, saveName }) => {
      try {
        const sanitized = getSanitized(gameName);
        const savePath = path.join(
          SAVES_PATH,
          sanitized,
          playthrough,
          `${saveName}.zip`,
        );

        try {
          await fs.access(savePath);
        } catch (e) {
          console.error("No Save file", savePath);
          return { success: false, error: e };
        }

        await fs.unlink(savePath);
        console.log(`Deleted save: ${saveName}`);

        return { success: true };
      } catch (err) {
        console.error("Error in deleting the saves", err);
        return { success: false, error: err.message };
      }
    },
  );
}
