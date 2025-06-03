import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { setToken } from "./redux/userSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

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
