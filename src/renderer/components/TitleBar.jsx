import { useEffect, useState } from "react";

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!window.windowAPI) return;

    const removeMax = window.windowAPI.onMaximized(() => setIsMaximized(true));
    const removeUnmax = window.windowAPI.onUnmaximized(() =>
      setIsMaximized(false),
    );

    return () => {
      removeMax();
      removeUnmax();
    };
  }, []);

  const handleMaximize = async () => {
    if (isMaximized) {
      await window.windowAPI.unmaximize();
    } else {
      await window.windowAPI.maximize();
    }
  };

  const handleClose = () => window.windowAPI.close();
  const handleMinimize = () => window.windowAPI.minimize();

  return (
    <header className="drag-region bg-background flex justify-end p-2 gap-5">
      <p className="text-text flex- w-full">WebGames-Vortex</p>
      {/* Minimize */}
      <button
        onClick={handleMinimize}
        className="hover:bg-slate-500 h-[25px] w-[25px]"
      >
        <GetSvg>
          <path d="M2 8H10" strokeWidth="1.2" strokeLinecap="round" />
        </GetSvg>
      </button>
      {/* Window Button*/}
      <button
        onClick={handleMaximize}
        className="hover:bg-slate-500 h-[25px] w-[25px]"
      >
        <GetSvg>
          {isMaximized ? (
            <rect x="4.5" y="0.5" width="7" height="7" strokeWidth="1.2" />
          ) : (
            <></>
          )}
          <rect
            x="2.5"
            y="2.5"
            width="7"
            height="7"
            strokeWidth="1.2"
            className="fill-background hover:fill-slate-500"
          />
        </GetSvg>
      </button>
      {/* Close Button*/}
      <button
        onClick={handleClose}
        className="hover:bg-slate-500 h-[25px] w-[25px]"
      >
        <GetSvg>
          <path
            d="M3 3L9 9M9 3L3 9"
            strokeWidth="1.2"
            strokeLinecap="round"
          />{" "}
        </GetSvg>
      </button>
    </header>
  );
}

const GetSvg = ({ children }) => {
  return (
    <svg
      className="text-text no-drag  "
      width="20"
      height="20"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};
