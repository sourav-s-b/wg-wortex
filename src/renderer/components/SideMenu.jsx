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
    <div ref={menuRef} className="">
      {/* Toggle Button */}
      <button
        className="rounded-sm bg-transparent text-text m-1 p-2"
        onClick={() => setIsOpen(true)}
        aria-label="Toggle Menu"
      >
        <Menu size={24} strokeWidth={2} />
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-10 z-50 w-[30vh] h-[calc(100vh-40px)] bg-secondary border-r-2 border-primary transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="rounded-sm bg-transparent text-text mt-5 ml-5 border-text hover:bg-primary"
          onClick={() => setIsOpen(false)}
          aria-label="Toggle Menu"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <div className="flex flex-col h-full pt-10 pb-5 mx-5 gap-5 items-start text-[25px]">
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
        </div>
      </div>
    </div>
  );
}
