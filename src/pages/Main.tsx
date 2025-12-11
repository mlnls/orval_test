import { Link } from "react-router-dom";

export const MainPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/test">Test</Link>
    </div>
  );
};
