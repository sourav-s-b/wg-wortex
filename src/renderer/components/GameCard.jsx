import { NavLink } from "react-router-dom";

export default function GameCard({ id, name }) {
  return (
    <NavLink
      to={`/game/${id}`}
      className="w-37.5 h-62.5 bg-primary
                text-text
                border-secondary border-2 rounded-3xl m-0.5
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
