import { useTheme } from "../ThemeContext";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { isDark, toggle } = useTheme();

    return (
        <div
            onClick={toggle}
            className={`relative w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ring-1 `}
        >
            {/* Knob */}
            <div
                className={`z-10 flex items-center justify-center w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out
                    ${isDark ? "translate-x-8" : "translate-x-0"}`}
            >
                {!isDark ? (
                    <Sun size={14} className="text-text-500" />
                ) : (
                    <Moon size={14} className="text-text-700" />
                )}
            </div>
        </div>
    );
}