import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Import Lucide icons
import ThemeToggle from "./ThemeToggle";

export default function SideMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouse = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleMouse);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleMouse);
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="absolute top-0">
      {/* Toggle Button */}
      <button
        className="absolute top-5.25 left-5 z-40 rounded-sm bg-transparent text-text-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-10 w-[30vh] h-[calc(100vh-40px)] bg-primary-100 border-r-2 border-secondary-200 transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full pt-20 pb-5 mx-5 gap-5 items-start text-[25px]">
          <NavLink
            to="/"
            className="hover:scale-[1.2] transition-transform duration-200"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/library"
            className="hover:scale-[1.1] transition-transform duration-200"
            onClick={() => setIsOpen(false)}
          >
            Library
          </NavLink>
          <NavLink
            to="/settings"
            className="hover:scale-[1.1] transition-transform duration-200"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </NavLink>
          
          <div className="flex-1" />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}