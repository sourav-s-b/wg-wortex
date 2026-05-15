import path from "path";
import { app } from "electron";
import Database from "better-sqlite3";

const dbPath = path.join(app.getPath("userData"), "library.db");
const db = new Database(dbPath);

export const dbManager = {
  init: () =>
    db.exec(`
      CREATE TABLE IF NOT EXISTS games (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        type TEXT DEFAULT "DEFAULT",
        lastPlayed DATETIME,
        playTime INTEGER DEFAULT 0
      )
    `),
  addGame: (name, path, type) =>
    db
      .prepare("INSERT INTO games (name,path,type) VALUES (? , ? , ?)")
      .run(name, path, type),
  getGames: () => db.prepare("SELECT * FROM games").all(),
  getGame: (id) => db.prepare("SELECT * FROM games WHERE id = ?").get(id),
  updateLastPlayed: (id) =>
    db
      .prepare("UPDATE games SET lastPlayed = CURRENT_TIMESTAMP WHERE id = ?")
      .run(id),
  incrementPlayTime: (id, seconds) =>
    db
      .prepare("UPDATE games SET playTime = playTime + ? WHERE id = ? ")
      .run(id, seconds),
};
