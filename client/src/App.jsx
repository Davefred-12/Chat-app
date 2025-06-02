import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setToken } from "./redux/userSlice";
import axios from "axios";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));

      // Optionally fetch user profile
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/api/user-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("Logged-in user profile", res.data);
          // Dispatch to store user info if needed
        })
        .catch((err) => {
          console.error("Invalid or expired token", err);
          sessionStorage.removeItem("token");
        });
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
