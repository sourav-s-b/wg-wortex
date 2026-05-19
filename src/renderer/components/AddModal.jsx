import { useEffect, useState } from "react";

export default function AddModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [type, setType] = useState("Default");
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key == "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const onAdd = async (name, path, e) => {
    e.preventDefault(); // Prevent page refresh
    if (!name || !path) return alert("Please fill in both fields");

    try {
      const addResult = await window.dbAPI.addGame(name, path, type);
      console.log(addResult);
      await onSuccess();
      onClose();
    } catch {
      return alert("Error in adding");
    }
  };

  return (
    <div className="fixed inset-0 top-9 z-50 flex justify-center items-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-background w-full max-w-lg h-125 rounded-2xl shadow-2xl z-10 p-8">
        <h2 className="text-3xl font-bold text-text-100">Add New Game</h2>
        {/* Your form goes here */}
        <form className="flex flex-col h-[80%] justify-around">
          <MyInput
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <MyInput
            placeholder="Path"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />

          <div className="flex flex-col">
            <h1 className="text-2xl p-2">Game Type</h1>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border-2 border-secondary focus:outline-none rounded-2xl focus:border-accent p-3 bg-white text-black cursor-pointer"
            >
              <option value="Default">Default</option>
              <option value="SugarCube">SugarCube</option>
            </select>
          </div>
          <button
            className="bg-primary text-white rounded-xl p-2 m-2"
            onClick={(e) => {
              onAdd(name, path, e);
            }}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

const MyInput = ({ placeholder, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl p-2">{placeholder}</h1>
      <input
        placeholder={placeholder + "..."}
        values={value}
        onChange={onChange}
        className="border-2 border-secondary focus:outline-none rounded-2xl focus:border-accent p-2"
      />
    </div>
  );
};
