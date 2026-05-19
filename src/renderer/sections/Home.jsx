import { Book, Settings } from "lucide-react";
import logoImg from "../assets/wg-logo.png";
import { useNavigate } from "react-router-dom";
import SideMenu from "../components/SideMenu";

export default function Home() {
  const navigate = useNavigate();

  const handleLibraryClick = () => {
    navigate("/library");
  };
  const handleSettingsClick = () => {
    navigate("/Settings");
  };
  return (
    <div>
      <SideMenu />
      <section className="flex-1 h-full flex flex-col">
        <div
          className="absolute top-125 left-1/2 -translate-x-1/2
                w-455.5 h-135.75 rounded-full
                bg-primary/35
                blur-[100px] pointer-events-none z-0"
        />
        {/* Image & Form*/}
        <div className="flex items-center justify-center">
          <button
            className="
            w-21.75 h-20.5 bg-secondary
            rounded-[25px] border-accent border-2
            shadow-inner flex flex-col items-center justify-center
            hover:bg-secondary/50
            "
            onClick={handleLibraryClick}
          >
            <Book />
            <p>Library</p>
          </button>
          <div className="flex items-center justify-center flex-col">
            <img
              src={logoImg}
              alt="WG Vortex"
              className="object-contain w-122.25 md:w-144.25 mt-15"
            />
            <form>
              <input
                className="w-85 lg:w-100 h-14 lg:h-20
                  bg-secondary rounded-3xl
                  border-3 border-accent
                  font-stm text-3xl pl-5
                  focus:bg-primary focus:outline-none focus:border-secondary"
                placeholder="Search..."
              />
            </form>
          </div>

          {/* Future button*/}
          <button
            className="
            w-21.75 h-20.5 bg-secondary
            rounded-[25px] border-accent border-2
            shadow-inner flex flex-col items-center justify-center
            hover:bg-secondary/50
            "
            onClick={handleSettingsClick}
          >
            <Settings />
            <p>Settings</p>
          </button>
        </div>
      </section>
    </div>
  );
}
