import TitleBar from "./components/TitleBar";
import SideMenu from "./components/SideMenu";
import { HashRouter, Route, Routes } from "react-router-dom";
import Library from "./sections/Library";
import Settings from "./sections/Settings";
import GameScreen from "./sections/GameScreen";
import Home from "./sections/Home";
import { useState, useEffect } from "react";

export default function App() {
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        setIsFullScreen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <HashRouter>
      <div className="h-screen w-full flex flex-col bg-background text-text transition-colors duration-300 ">
        {!isFullScreen && <TitleBar />}
        <div className="relative flex-1 h-full w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/settings" element={<Settings />} />
            <Route
              path="/game/:id"
              element={
                <GameScreen
                  isFullScreen={isFullScreen}
                  setIsFullScreen={setIsFullScreen}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
