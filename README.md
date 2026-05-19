# wg-wortex

A cross-platform desktop application for cataloging your web games and managing game save data — all stored locally on your machine.

---

## What It Does

wg-wortex (Web Game Vortex) is a personal game library manager built for web games. It lets you organize and browse your favorite browser-based games in one place, and extends them with a native save-state system so you never lose progress.
This is mainly built in mind with SugarCube games to add Extra saves, so it has option to use sugarcube's inbuilt save mechanism. It has Autosaves for leaving and closing the application.
## Features

- 📚 **Game Catalog** — Add, organize, and browse your web game library
- 💾 **Extended Save System** — Native save/load functionality layered on top of web games
- 🗄️ **Local-First Storage** — Game Library data is stored locally using SQLite via `better-sqlite3` , while saves are downloaded to each games folder in .json files

## Tech Stack

| Layer | Technology |
|---|---|
| Shell | [Electron](https://www.electronjs.org/) v41 |
| Frontend | [React](https://react.dev/) v19 + [React Router](https://reactrouter.com/) v7 |
| Build Tool | [electron-vite](https://electron-vite.github.io/) + Vite |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v4 |
| Database | [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) |
| Packaging | [electron-builder](https://www.electron.build/) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/sourav-s-b/wg-wortex.git

# Navigate into the project
cd wg-wortex

# Install dependencies
npm install
```

### Development

```bash
# Run in development mode with hot reload
npm run dev

```

### Building

```bash
# Build the app
npm run build

# Build and package into a distributable
npm run dist
```

Output installers will be placed in the `dist/` folder.

