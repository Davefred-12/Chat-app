import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <ToastContainer />
        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default App;