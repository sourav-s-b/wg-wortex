import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import TitleBar from "./components/TitleBar";
import Home from "./sections/Home";
import SideMenu from "./components/SideMenu";
import { HashRouter, Route, Routes } from "react-router-dom";
import Library from "./sections/Library";

export default function App() {
    const { isDark, toggle } = useTheme();


    return (
        <HashRouter>
            <div className="h-screen w-full flex flex-col bg-background-50 text-text-50 transition-colors duration-300 ">
                <TitleBar />
                <div className="relative flex-1 h-full w-full">
                    <SideMenu />
                    <Routes>
                        <Route path="/" element={<Library />} />
                        <Route path="/library" element={<Library />} />
                    </Routes>
                </div>
            </div>
        </HashRouter>
    );
}


