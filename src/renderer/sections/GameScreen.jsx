import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SaveTable from "../components/SaveTable";

export default function GameScreen() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [isGameVisible, setIsGameVisible] = useState(false);
  const webviewRef = useRef(null);

  useEffect(() => {
    window.dbAPI
      .getGame(id)
      .then((data) => {
        setGame(data);
      })
      .catch((error) => {
        return alert(error);
      });
  }, [id]);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleDomReady = () => {
      webview.insertCSS(`
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          ::-webkit-scrollbar-thumb {
            background: #1e1e1e;
            border-radius: 10px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #4a4a4a;
          }
        `);

      setIsGameVisible(true);
    };

    webview.addEventListener("dom-ready", handleDomReady);

    return () => {
      webview.removeEventListener("dom-ready", handleDomReady);
    };
  }, [game]);

  const handleNewPlaythrough = async (playthrough) => {
    const data = await window.saveAPI.addPlaythrough(game.name, playthrough);
    if (data.success === false) {
      alert(data.error);
      return;
    }
  };

  const handleSaveDelete = async (saveName, playthrough) => {
    const data = await window.saveAPI.deleteSave(
      game.name,
      playthrough,
      saveName,
    );
    if (data.success === false) {
      alert(data.error);
      return;
    }
  };

  const handleNewSave = async (saveName, playthrough) => {
    if (!webviewRef.current) return alert("Game is not running!");

    const extractorScript = `
      (async function() {
        try {
          const exportData = { localStorage: { ...localStorage }, indexedDB: {} };
          const dbs = await indexedDB.databases();

          for (const dbInfo of dbs) {
            const dbData = await new Promise((resolve, reject) => {
              const openReq = indexedDB.open(dbInfo.name);
              openReq.onerror = () => reject('Failed to open DB ');

              openReq.onsuccess = async () => {
                const db = openReq.result;
                const currentDbData = { version: db.version, stores: {} };
                const storeNames = Array.from(db.objectStoreNames);

                // PRO TIP: Read all stores at once to keep the transaction alive
                const storePromises = storeNames.map(name => {
                  return new Promise((res) => {
                    const tx = db.transaction(name, "readonly");
                    const store = tx.objectStore(name);
                    const config = { keyPath: store.keyPath, autoIncrement: store.autoIncrement };
                    const getReq = store.getAll();
                    getReq.onsuccess = () => res({ name, config, data: getReq.result });
                  });
                });

                const results = await Promise.all(storePromises);
                results.forEach(r => {
                  currentDbData.stores[r.name] = { config: r.config, data: r.data };
                });

                db.close();
                resolve(currentDbData);
              };
            });
            exportData.indexedDB[dbInfo.name] = dbData;
          }
          // Just return the object—Electron handles the rest!
          return exportData;
        } catch (e) {
          return { error: e.message };
        }
      })();
    `;

    try {
      const payloadData =
        await webviewRef.current.executeJavaScript(extractorScript);

      console.log(payloadData);

      const data = await window.saveAPI.saveGame(
        game.name,
        saveName,
        playthrough,
        payloadData,
      );
      if (data.success === false) {
        alert(data.error);
        return;
      }
    } catch (err) {
      console.error(err.message);
      alert("Error in extracting info from DB", err.message);
    }
  };

  const handleLoadSave = async (saveName, playthrough) => {
    if (!webviewRef.current) return alert("Game is not running");

    const data = await window.saveAPI.loadSave(
      game.name,
      playthrough,
      saveName,
    );

    if (data.success === false) return alert(data.error);

    setIsGameVisible(false);

    // FIX: Access the underlying webContents
    const webview = webviewRef.current;

    try {
      // Check if the method exists before calling it
      if (typeof webview.executeJavaScript === "function") {
        await webview.executeJavaScript(`
          localStorage.clear();
              (async () => {
                const dbs = await indexedDB.databases();
                await Promise.all(dbs.map(db => new Promise(resolve => {
                  const req = indexedDB.deleteDatabase(db.name);
                  req.onsuccess = resolve;
                  req.onerror = resolve;
                })));
              })();
        `);
      }
    } catch (err) {
      console.warn("Manual clear failed, proceeding to injection:", err);
    }

    const loaderScript = `
      (async function() {
        try {
          const backup = ${JSON.stringify(data.data)}; // Directly stringify the object into the script

          // 1. Restore LocalStorage
          localStorage.clear();
          Object.keys(backup.localStorage).forEach(k => {
            localStorage.setItem(k, backup.localStorage[k]);
          });

          // 2. Restore IndexedDB
          const dbPromises = Object.entries(backup.indexedDB).map(([dbName, dbContent]) => {
            return new Promise((resolve, reject) => {
              // Delete old DB first to ensure a clean slate for the version change
              const delReq = indexedDB.deleteDatabase(dbName);

              delReq.onsuccess = () => {
                const req = indexedDB.open(dbName, dbContent.version);

                req.onupgradeneeded = (e) => {
                  const db = e.target.result;
                  for (const [storeName, storeContent] of Object.entries(dbContent.stores)) {
                    db.createObjectStore(storeName, storeContent.config);
                  }
                };

                req.onsuccess = (e) => {
                  const db = e.target.result;
                  const storeNames = Object.keys(dbContent.stores);
                  if (storeNames.length === 0) return resolve();

                  const tx = db.transaction(storeNames, "readwrite");
                  tx.oncomplete = () => {
                    db.close();
                    resolve();
                  };
                  tx.onerror = (err) => reject(err);

                  for (const [storeName, storeContent] of Object.entries(dbContent.stores)) {
                    const store = tx.objectStore(storeName);
                    storeContent.data.forEach(item => store.put(item));
                  }
                };
                req.onerror = (err) => reject(err);
              };
            });
          });

          await Promise.all(dbPromises);
          return true;
        } catch (e) {
          return { error: e.message };
        }
      })();
    `;

    try {
      const result = await webview.executeJavaScript(loaderScript);
      if (result?.error) throw new Error(result.error);

      webview.reload();
      // Use a small timeout or wait for 'dom-ready' to show the game again
      setTimeout(() => setIsGameVisible(true), 500);
    } catch (err) {
      alert("Failed to load save data: " + err.message);
      setIsGameVisible(true);
    }
  };

  if (!game) {
    return <></>;
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Title And Button*/}
      <div className="sticky top-0 flex h-[8.25vh] items-center px-15 bg-background-50 border-b-2 border-text-50 ">
        <NavLink to="/library">
          <ArrowLeft />
        </NavLink>
        <h1 className="text-7xl font-semibold flex-1 text-center">
          {game.name}
        </h1>
      </div>
      {/* WebView */}

      <div className="relative h-[84vh] m-3 border-2">
        {/* LOCALIZED LOADING OVERLAY */}
        {!isGameVisible && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background-50">
            <div className="text-2xl font-bold animate-pulse text-center">
              Loading Save Data...
            </div>
          </div>
        )}

        {/* WebView - Full height/width of the parent container */}
        <webview
          src={game.path}
          ref={webviewRef}
          partition={`${game.name.replace(/\s+/g, "_").toLowerCase()}`}
          className="w-full h-full"
        />
      </div>

      <SaveTable
        gameName={game.name}
        onSave={handleNewSave}
        onNewPlaythrough={handleNewPlaythrough}
        onSaveDelete={handleSaveDelete}
        onLoad={handleLoadSave}
      />
      <div className="h-[6vh]" />
    </div>
  );
}
