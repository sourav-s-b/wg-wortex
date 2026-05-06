import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { NavLink } from "react-router-dom";

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
      if (event.key == "Escape") {
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
      <button
        className="absolute top-5 left-5 z-40 rounded-sm bg-transparent"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-50"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-50"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      <div
        className={`fixed top-10 w-[30vh] h-[calc(100vh-40px)] bg-primary-100 border border-secondary-200 border-2 transition-transform duration-300
                ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Content area */}
        <div className="flex flex-col h-full pt-20 pb-5 mx-5 gap-5 items-start text-[25px]">
          <NavLink
            to="/"
            className="hover:scale-[1.2] transition-transform duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <p>Home</p>
          </NavLink>
          <NavLink
            to="/library"
            className="hover:scale-[1.2] transition-transform duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <p>Library</p>
          </NavLink>
          <NavLink
            to="/settings"
            className="hover:scale-[1.2] transition-transform duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            <p>Settings</p>
          </NavLink>
          <div className="flex-1" />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
