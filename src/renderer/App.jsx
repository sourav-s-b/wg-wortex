import TitleBar from "./components/TitleBar";
import SideMenu from "./components/SideMenu";
import { HashRouter, Route, Routes } from "react-router-dom";
import Library from "./sections/Library";
import Settings from "./sections/Settings";
import GameScreen from "./sections/GameScreen";
import Home from "./sections/Home";

export default function App() {
  return (
    <HashRouter>
      <div className="h-screen w-full flex flex-col bg-background-50 text-text-50 transition-colors duration-300 ">
        <TitleBar />
        <div className="relative flex-1 h-full w-full">
          <SideMenu />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/game/:id" element={<GameScreen />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
