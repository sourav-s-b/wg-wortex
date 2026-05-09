import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import SaveTable from "../components/SaveTable";

export default function GameScreen() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

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
      <webview
        src={game.path}
        ref={webviewRef}
        partition={`persist:${game.name.replace(/\s+/g, "_").toLowerCase()}`}
        className="h-[84vh] m-3 border-2"
      />
      <SaveTable gameName={game.name}/>
      <div className="h-[6vh]" />
    </div>
  );
}
