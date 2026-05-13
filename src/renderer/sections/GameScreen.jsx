import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SaveTable from "../components/SaveTable";

export default function GameScreen() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [isReloading, setIsReloading] = useState(false);

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
    };

    webview.addEventListener("dom-ready", handleDomReady);

    return () => {
      webview.removeEventListener("dom-ready", handleDomReady);
    };
  }, [game]);

  const handleNewSave = async (saveName, playthrough) => {
    const data = await window.saveAPI.saveGame(
      game.name,
      saveName,
      playthrough,
    );
    if (data.success === false) {
      alert(data.error);
      return;
    }
  };

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

  const handleLoadSave = async (saveName, playthrough) => {
    const data = await window.saveAPI.loadSave(
      game.name,
      playthrough,
      saveName,
    );
    if (data.success === false) {
      alert(data.error);
      return;
    } else {
      console.log("Saved Successfully");
    }
  };

  if (!game)
    return (
      <div className="text-5xl h-full flex justify-center items-center">
        Loading...
      </div>
    );

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

      {!isReloading && (
        <webview
          src={game.path}
          ref={webviewRef}
          partition={`${game.name.replace(/\s+/g, "_").toLowerCase()}`}
          className="h-[84vh] m-3 border-2"
        />
      )}

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
