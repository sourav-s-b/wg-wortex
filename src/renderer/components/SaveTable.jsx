import { Trash } from "lucide-react";
import { useEffect, useState } from "react";

export default function SaveTable({
  gameName,
  onSave,
  onNewPlaythrough,
  onSaveDelete,
  onLoad,
}) {
  const [saveData, setSaveData] = useState([]);
  const [saveName, setSaveName] = useState(null);
  const [newPlayName, setNewPlayName] = useState(null);
  const [selectedPlaythrough, setSelectedPlaythrough] = useState(undefined);

  useEffect(() => {
    fetchSaves();
    setSelectedPlaythrough("Default");
  }, []);

  const fetchSaves = async () => {
    const data = await window.saveAPI.getSaves(gameName);
    if (data.success === false) {
      console.error(data.error);
      alert(data.error);
    } else {
      console.log(data.data);
      setSaveData(data.data);
    }
  };

  const handleSave = async (e, saveName) => {
    e.preventDefault();
    if (!saveName) {
      alert("Please Type Save Name");
      return;
    }
    await onSave(saveName, playthrough);
    setSelectedPlaythrough(selectedPlaythrough ?? "Default");
    await fetchSaves();
  };

  const handleNewPlay = async (e, playthroughName) => {
    e.preventDefault();
    if (!playthroughName) {
      alert("Please Type playthrough Name");
      return;
    }
    await onNewPlaythrough(playthrough);
    await fetchSaves();
  };

  const handleSaveDelete = async (saveName) => {
    await onSaveDelete(saveName, activePlaythrough.playthrough);
    await fetchSaves();
  };

  const handleLoad = async (saveName) => {
    await onLoad(saveName, activePlaythrough.playthrough);
  };

  const SaveTab = ({ saveName }) => {
    return (
      <div className="h-full flex m-2 border-2 rounded-sm p-2 items-center">
        <p className="block flex-1 text-center text-2xl font-semibold">
          {saveName}
        </p>
        <button
          className=" hover:bg-primary-500 p-2 m-2 border-2 rounded-xl"
          onClick={() => handleLoad(saveName)}
        >
          Load
        </button>
        <button
          className="bg-red-500 hover:bg-red-900 p-2 m-2 border-2 rounded-xl"
          onClick={() => {
            handleSaveDelete(saveName);
          }}
        >
          <Trash />
        </button>
      </div>
    );
  };

  const activePlaythrough = saveData.find(
    (p) => p.playthrough === selectedPlaythrough,
  );
  return (
    <div className=" h-[50vh] m-2 bg-primary-500/50 border-2 rounded-2xl flex flex-row ">
      {/* Playthrough coloumn*/}
      <div className=" bg-primary-700/50 w-[25vw]  border-r-2 rounded-l-2xl">
        <h2 className="text-text-50 opacity-100 text-xl m-2 text-center border-b-2">
          PLAYTHROUGHS
        </h2>
        <div>
          {saveData.length === 0 ? (
            <p className="text-center opacity-50 wrap-break-word mt-40">
              No Saved Playthroughs
            </p>
          ) : (
            <div className="h-full flex flex-col">
              {saveData.map((playthrough, index) => (
                <button
                  key={index}
                  className="hover:bg-primary-700"
                  onClick={() => {
                    setSelectedPlaythrough(playthrough.playthrough);
                  }}
                >
                  {playthrough.playthrough}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Saves Column*/}
      <div className="h-full w-full flex-col overflow-y-auto">
        {/* heading */}
        <h2 className="text-text-50 opacity-100 text-xl m-2 text-center border-b-2 ">
          SAVES
        </h2>

        <div>
          {activePlaythrough && activePlaythrough.saves.length != 0 ? (
            <div className="h-full flex flex-col">
              {activePlaythrough.saves.map((saveName, index) => (
                <SaveTab key={index} saveName={saveName} />
              ))}
            </div>
          ) : (
            <p className="text-center opacity-50 wrap-break-word mt-40">
              No Saves
            </p>
          )}
        </div>
      </div>

      {/* Utility Column*/}
      <div className="h-full w-[25vw] border-l-2  flex flex-col items-center justify-center overflow-y-auto">
        <form className="flex flex-col items-center justify-center">
          <input
            className="w-[15vw] h-[6vh] bg-text-50 m-1 p-1 rounded-2xl border-2 focus:outline-none text-background-50 "
            placeholder="Type Save Name"
            onChange={(e) => setSaveName(e.target.value)}
          />
          <button
            className="bg-green-600 rounded-xl h-10 w-25 border-2 hover:bg-green-800"
            onClick={(e) => {
              handleSave(e, saveName);
            }}
          >
            Save
          </button>
        </form>

        <form className="flex flex-col items-center justify-center">
          <input
            className="w-[15vw] h-[6vh] bg-text-50 m-1 p-1 rounded-2xl border-2 focus:outline-none text-background-50 "
            placeholder="Type Playthrough Name"
            onChange={(e) => setNewPlayName(e.target.value)}
          />
          <button
            className="bg-slate-600 rounded-xl h-20 w-45 border-2 hover:bg-slate-800 text-white"
            onClick={(e) => {
              handleNewPlay(e, newPlayName);
            }}
          >
            Add Playthrough
          </button>
        </form>
      </div>
    </div>
  );
}
