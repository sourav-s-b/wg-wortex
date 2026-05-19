import { BadgePlus, RefreshCcw } from "lucide-react";
import AddModal from "../components/AddModal";
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import SideMenu from "../components/SideMenu";

export default function Library() {
  const [isModel, setIsModel] = useState(false);
  const [games, setIsGames] = useState([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const gamesList = await window.dbAPI.getGames();
    setIsGames([...gamesList]);
  };

  return (
    <div className="h-full w-full">
      {isModel && (
        <AddModal
          onClose={() => {
            setIsModel(false);
          }}
          onSuccess={fetchGames}
        />
      )}
      {/* search & options */}
      <div className="flex h-1/13 justify-center items-center">
        <SideMenu />
        <input
          className="bg-secondary border-accent border rounded-xl h-10 pl-2 w-1/4 focus:outline-none focus:border-red-500"
          placeholder="Name..."
        />

        <button
          type="button"
          onClick={() => fetchGames()}
          className="w-1/20 mx-2 py-2  bg-secondary border-2 border-accent flex justify-center items-center hover:bg-primary focus:outline-none"
        >
          <RefreshCcw />
        </button>
        <button
          onClick={() => setIsModel(true)}
          className="w-1/20 mx-2 py-2 bg-secondary border-2 border-accent flex justify-center items-center hover:bg-primary focus:outline-none"
        >
          <BadgePlus />
        </button>

        {/* spacer */}
        <div className="flex-1" />
        <p className="text-5xl">Library</p>
      </div>
      <section className="p-2  h-full flex flex-col gap-2">
        {/* Content*/}
        <div className="bg-background flex-1 border-secondary border-2 rounded-2xl overflow-y-auto min-h-0">
          {games.length == 0 ? (
            <h1 className="flex text-text-100 items-center justify-center h-full">
              No games added yet..
            </h1>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 p-4">
              {games.map((game) => (
                <GameCard key={game.id} id={game.id} name={game.name} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
