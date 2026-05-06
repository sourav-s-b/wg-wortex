import { BadgePlus, RefreshCcw } from "lucide-react";
import AddModal from "../components/AddModal";
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";

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
    <div className="h-full">
      {isModel && (
        <AddModal
          onClose={() => {
            setIsModel(false);
          }}
          onSuccess={fetchGames}
        />
      )}
      <section className="p-2 h-full flex flex-col gap-2">
        {/* title */}
        <h1 className="font-extrabold text-7xl w-full text-center p-2 ">
          Library
        </h1>

        {/* search & options */}
        <div className="w-full bg-background-100 p-5 border-2 border-primary-200 rounded-2xl flex">
          <input
            className="bg-secondary-200 border rounded p-2 w-1/4 focus:outline-none focus:border-primary-500"
            placeholder="Name..."
          />
          {/* spacer */}
          <div className="flex-1" />

          <button
            onClick={() => fetchGames()}
            className="w-1/20 h-full mx-2 bg-primary-300 border-2 border-secondary-400 flex justify-center items-center hover:bg-primary-200 focus:outline-none"
          >
            <RefreshCcw />
          </button>
          <button
            onClick={() => setIsModel(true)}
            className="w-1/20 h-full mx-2 bg-primary-300 border-2 border-secondary-400 flex justify-center items-center hover:bg-primary-200 focus:outline-none"
          >
            <BadgePlus />
          </button>
        </div>

        {/* Content*/}
        <div className="bg-background-200 flex-1 border-primary-600 border-2 rounded-2xl overflow-y-auto min-h-0">
          {games.length == 0 ? (
            <h1 className="text-text-100 text-center">No games added yet..</h1>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 p-4">
              {games.map((game, index) => (
                <GameCard key={index} name={game.name} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
