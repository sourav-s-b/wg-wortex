import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  return (
    <div className="text-5xl flex flex-col justify-center items-center">
      In Development
      <button
        className="mt-10"
        onClick={() => {
          navigate("/");
        }}
      >
        {" "}
        PressMe
      </button>
    </div>
  );
}
