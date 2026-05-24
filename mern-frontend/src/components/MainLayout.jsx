import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function MainLayout() {
  return (
    <div className="app-layout">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default MainLayout;