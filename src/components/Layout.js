import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";

const Layout = () => {
  return (
    <>
      <AppHeader />
      <main className="App">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
