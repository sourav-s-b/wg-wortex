import { NavLink } from "react-router-dom";

export default function GameCard({id, name }) {
  return (
    <NavLink  
      to = {`/game/${id}`}className="w-[150px] h-[250px] bg-primary-500
                text-white
                border-secondary-500 border-2 rounded-3xl m-0.5
                flex justify-center items-center
                font-semibold text-2xl
                hover:scale-110 transition-transform duration-100
                text-center
                "
    >
        <span className="whitespace-normal wrap-break-word w-full">{name}</span>
    </NavLink>
  );
}
