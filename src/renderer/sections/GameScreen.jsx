import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SaveTable from "../components/SaveTable";

const sugarExtractorScript = `
  (async function() {
    try {
      await new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
          if (typeof SugarCube !== 'undefined' && SugarCube.Save) {
            clearInterval(interval);
            resolve();
          } else if (Date.now() - start > 10000) {
            clearInterval(interval);
            reject(new Error('SugarCube.Save never became available'));
          }
        }, 100);
      });

      const SC = window.SugarCube;

      // Support both new (2.37+) and legacy API
      let base64Save;
      if (SC.Save.base64) {
        base64Save = SC.Save.base64.save();
      } else if (typeof SC.Save.serialize === 'function') {
        base64Save = SC.Save.serialize();
      } else {
        throw new Error('No supported Save API found on this SugarCube version');
      }

      if (!base64Save) throw new Error('Save returned empty — are you on the opening passage?');

      return { sugarCubeSave: base64Save };
    } catch (e) {
      return { error: e.message };
    }
  })();
`;
const genericExtractorScript = `
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
      return exportData;
    } catch (e) {
      return { error: e.message };
    }
  })();
`;
const getSugarLoaderScript = (saveData) => `
  (async function() {
    try {
      const base64Save = ${JSON.stringify(saveData.sugarCubeSave)};

      await new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
          if (typeof SugarCube !== 'undefined' && SugarCube.Save) {
            clearInterval(interval);
            resolve();
          } else if (Date.now() - start > 10000) {
            clearInterval(interval);
            reject(new Error('SugarCube never became available'));
          }
        }, 100);
      });

      const SC = window.SugarCube;
      sessionStorage.clear();

      // Support both new (2.37+) and legacy API
      if (SC.Save.base64) {
        await SC.Save.base64.load(base64Save);
      } else if (typeof SC.Save.deserialize === 'function') {
        SC.Save.deserialize(base64Save);
      } else {
        throw new Error('No supported Load API found on this SugarCube version');
      }

      SC.Engine.show();
      return { success: true };
    } catch (e) {
      return { error: e.message };
    }
  })();
`;
const getGenericLoaderScript = (saveData) => `
  (async function() {
    try {
      const backup = ${JSON.stringify(saveData)};

      // 1. Restore LocalStorage
      localStorage.clear();
      Object.keys(backup.localStorage).forEach(k => {
        localStorage.setItem(k, backup.localStorage[k]);
      });

      // 2. Restore IndexedDB
      const dbPromises = Object.entries(backup.indexedDB).map(([dbName, dbContent]) => {
        return new Promise((resolve, reject) => {
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
      return { success: true };
    } catch (e) {
      return { error: e.message };
    }
  })();
`;

export default function GameScreen() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [isGameVisible, setIsGameVisible] = useState(false);
  const webviewRef = useRef(null);

  const navigate = useNavigate();

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

    const handleDomReady = async () => {
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

    //for loading latest autosave
    webview.addEventListener("dom-ready", handleDomReady);
    const checkAutosave = async () => {
      const savesData = await window.saveAPI.getSaves(game.name);
      const autoSaveEntry = savesData.data.find(
        (i) => i.playthrough === "AutoSave",
      );

      if (autoSaveEntry && autoSaveEntry.length !== 0) {
        const lastSave = autoSaveEntry.saves[0];
        await handleLoadSave(lastSave.name, "AutoSave");
      }
    };
    checkAutosave();

    // for autosave when closing the app
    const handleForceAutoSave = async () => {
      if (webviewRef.current && game) {
        try {
          const savesData = await window.saveAPI.getSaves(game.name);
          const autoSaveEntry = savesData.data.find(
            (i) => i.playthrough === "AutoSave",
          );
          const nextIndex = (autoSaveEntry?.saves.length || 0) + 1;

          await handleNewSave(`AutoSave-${nextIndex}`, "AutoSave");
        } catch (e) {
          console.error("Emergency save failed:", err);
        } finally {
          window.windowAPI.confirmSaveFinished();
        }
      } else {
        window.windowAPI.confirmSaveFinished();
      }
    };

    const unsubscribe = window.windowAPI.onForceAutoSave(handleForceAutoSave);

    return () => {
      webview.removeEventListener("dom-ready", handleDomReady);
      unsubscribe();
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
    let payloadData;

    console.log("Sugar", game.type);

    try {
      if (game.type === "SugarCube") {
        payloadData =
          await webviewRef.current.executeJavaScript(sugarExtractorScript);
        if (payloadData?.error) {
          return alert("SugarCube save failed: " + payloadData.error);
        }
      } else {
        payloadData = await webviewRef.current.executeJavaScript(
          genericExtractorScript,
        );
      }
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

    const webview = webviewRef.current;

    if (game.type === "SugarCube") {
      try {
        const result = await webview.executeJavaScript(
          getSugarLoaderScript(data.data),
        );
        if (result?.error) throw new Error(result.error);
        console.log("SugarCube save injected instantly!");
      } catch (err) {
        alert("Failed to load SugarCube save: " + err.message);
      }
    } else {
      setIsGameVisible(false);

      try {
        // Clear old database
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

        // Inject new data
        const result = await webview.executeJavaScript(
          getGenericLoaderScript(data.data),
        );
        if (result?.error) throw new Error(result.error);

        webview.reload();

        setTimeout(() => setIsGameVisible(true), 500);
      } catch (err) {
        alert("Failed to load Generic save data: " + err.message);
        setIsGameVisible(true);
      }
    }
  };

  const handleBackNavigation = async () => {
    if (webviewRef.current) {
      try {
        const savesData = await window.saveAPI.getSaves(game.name);
        const autoSaveEntry = savesData.data.find(
          (i) => i.playthrough === "AutoSave",
        );
        const nextIndex = (autoSaveEntry?.saves.length || 0) + 1;

        await handleNewSave(`AutoSave-${nextIndex}`, "AutoSave");

        navigate("/library");
      } catch (err) {
        console.error("Autosave failed during exit:", err);
      }
    }
  };

  if (!game) {
    return <></>;
  }

  return (
    <div className="h-full overflow-y-auto">
      {/* Title And Button*/}
      <div className="sticky top-0 flex h-[8.25vh] items-center px-15 bg-background-50 border-b-2 border-text-50 ">
        <button onClick={handleBackNavigation} className="cursor-pointer">
          <ArrowLeft />
        </button>
        <h1 className="text-7xl font-semibold flex-1 text-center">
          {game.name}
        </h1>
      </div>
      {/* WebView */}

      <div className="relative h-[84vh] m-3 border-2">
        {!isGameVisible && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background-50">
            <div className="text-2xl font-bold animate-pulse text-center">
              Loading Save Data...
            </div>
          </div>
        )}

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
