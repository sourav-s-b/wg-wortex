import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function GameScreen() {
  const { id } = useParams();
  const [game, setGame] = useState(null);

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

  if (!game)
    return (
      <div className="text-5xl h-full flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="h-full flex flex-col">
      {/* Title And Button*/}
      <div className="flex h-1/10 items-center mx-15 ">
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
        partition={`persist:${game.name.replace(/\s+/g, "_").toLowerCase()}`}
        className="w-full h-full border-2"
      />
    </div>
  );
}
