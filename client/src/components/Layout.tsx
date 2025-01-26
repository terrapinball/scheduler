import { useDarkModeContext } from "./DarkModeProvider";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export const Layout = () => {
  const { isDark } = useDarkModeContext();
  
  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <Outlet/>
        <Footer />
      </div>
    </div>
  );
};