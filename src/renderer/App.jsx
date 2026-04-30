import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";
import TitleBar from "./components/TitleBar";
import Hero from "./sections/Hero";

export default function App() {
    const { isDark, toggle } = useTheme();


    return (
        <div className="h-screen w-full bg-background-300 text-text-50 transition-colors duration-300 ">
            <TitleBar />
            <Hero />
        </div>
    );
}


