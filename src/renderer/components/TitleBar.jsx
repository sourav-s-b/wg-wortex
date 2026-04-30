import { useEffect, useState } from "react";

export default function TitleBar() {
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        if (!window.windowAPI) return;

        const removeMax = window.windowAPI.onMaximized(() => setIsMaximized(true));
        const removeUnmax = window.windowAPI.onUnmaximized(() => setIsMaximized(false));

        return () => {
            removeMax();
            removeUnmax();
        };
    }, [])

    const handleMaximize = async () => {
        if (isMaximized) {
            await window.windowAPI.unmaximize();
        } else {
            await window.windowAPI.maximize();
        }
    }

    const handleClose = () => window.windowAPI.close();
    const handleMinimize = () => window.windowAPI.minimize();

    return (
        <header className="drag-region bg-background-50 flex justify-end p-2 gap-5">
            <p className="text-text-50 flex-1">WebGames-Vortex</p>
            {/* Minimize */}
            <button onClick={handleMinimize}>
                <GetSvg>
                    <path d="M2 8H10" strokeWidth="1.2" strokeLinecap="round" />
                </GetSvg>
            </button>
            <button
                onClick={handleMaximize}
            >
                <GetSvg >{
                    isMaximized
                        ? <rect x="4.5" y="0.5" width="7" height="7" strokeWidth="1.2" />
                        : <></>
                }
                    <rect x="2.5" y="2.5" width="7" height="7" strokeWidth="1.2" className="fill-background-100" />{" "}
                </GetSvg>
            </button>
            <button onClick={handleClose}>
                <GetSvg>
                    <path
                        d="M3 3L9 9M9 3L3 9"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                    />{" "}
                </GetSvg>
            </button>
        </header>
    )
}

const GetSvg = ({ children }) => {
    return (
        <svg
            className="text-text-50 no-drag"
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