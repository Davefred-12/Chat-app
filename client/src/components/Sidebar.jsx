import "react";
import { HiMiniChatBubbleOvalLeftEllipsis } from "react-icons/hi2";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLogOut, BiSun, BiMoon } from "react-icons/bi";
import Avatar from "./Avatar";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import EditUserDetails from "./EditUserDetails";
import { FiArrowUpLeft } from "react-icons/fi";
import SearchUser from "./SearchUser";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { useTheme } from "../context/ThemeContext"; // Import the theme hook

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme(); // Use the theme hook
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (socketConnection && user && user._id) {
      socketConnection.emit("sidebar", user._id);
      socketConnection.on("conversation", (data) => {
        console.log("conversation", data);

        // Check if data is an array before trying to map it
        if (Array.isArray(data)) {
          const conversationUserData = data.map((conversationUser) => {
            if (
              conversationUser?.sender?._id === conversationUser?.receiver?._id
            ) {
              return {
                ...conversationUser,
                userDetails: conversationUser?.sender,
              };
            } else if (conversationUser?.receiver._id !== user?._id) {
              return {
                ...conversationUser,
                userDetails: conversationUser?.receiver,
              };
            } else {
              return {
                ...conversationUser,
                userDetails: conversationUser.sender,
              };
            }
          });
          setAllUser(conversationUserData);
        } else {
          // Handle the case where data is not an array
          console.error("Expected array but received:", typeof data);
          setAllUser([]);
        }
      });
    }

    return () => {
      if (socketConnection) {
        socketConnection.off("conversation");
      }
    };
  }, [socketConnection, user]);

  const handleLogout = () => {
    setLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    if (socketConnection) {
      socketConnection.disconnect();
    }

    dispatch({ type: "LOGOUT_USER" });

    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    navigate("/email");

    setLogoutConfirmOpen(false);
  };
  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200  ">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5  dark:bg-slate-900 text-slate-600 flex flex-col justify-between   ">
        <div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-12 h-10 cursor-pointer flex justify-center items-center 
    dark:hover:bg-slate-700 
    hover:text-slate-900 
    dark:hover:text-white 
    rounded 
    text-slate-600 
    dark:text-slate-800 ${isActive && "bg-slate-200"} `
            }
            title="Chat"
          >
            <HiMiniChatBubbleOvalLeftEllipsis size={20} />
          </NavLink>
          <div
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-10 cursor-pointer flex justify-center items-center 
    hover:bg-slate-200 
    dark:hover:bg-slate-700 
    hover:text-slate-800 
    dark:hover:text-white 
    rounded 
    text-slate-600 
    dark:text-slate-300"
            title="Add Friends"
          >
            <FaUserPlus size={20} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="mx-auto "
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          {/* Theme Toggle Button */}
          <button
            className="w-12 h-10 cursor-pointer flex justify-center items-center mt-1
    hover:bg-slate-200 
    dark:hover:bg-slate-700 
    hover:text-slate-800 
    dark:hover:text-white 
    rounded 
    text-slate-600 
    dark:text-slate-300"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            onClick={toggleTheme}
          >
            {isDarkMode ? <BiSun size={20} /> : <BiMoon size={20} />}
          </button>
          <button
            className="w-12 h-10 cursor-pointer flex justify-center items-center 
    hover:bg-slate-200 
    dark:hover:bg-slate-700 
    hover:text-slate-800 
    dark:hover:text-white 
    rounded 
    text-slate-600 
    dark:text-slate-300"
            title="Logout"
            onClick={handleLogout}
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 dark:text-slate-100">
            Messages
          </h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="mt-2">
              <div className="flex justify-center items-centermy-4 text-slate-500">
                <FiArrowUpLeft size={50} />
              </div>
              <div>
                <p className="text-lg text-center text-slate-400 dark:text-slate-100 ">
                  Explore Users to start a conversation with
                </p>
              </div>
            </div>
          )}

          {allUser.map((conv) => {
            return (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?._id}
                className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer  hover:dark:bg-slate-900"
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base dark:text-slate-100 ">
                    {conv?.userDetails?.name}
                  </h3>

                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div>
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-2">
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-2 ">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1 dark:text-slate-100 italic ">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs ml-auto py-1 px-2 bg-primary text-white font-semibold rounded-full flex items-center justify-center min-w-6 h-6">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/***Edit User Details */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}

      {/* Logout Confirmation Dialog */}
      {logoutConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 hover:dark:bg-slate-700"
                onClick={() => setLogoutConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                onClick={confirmLogout}
              >
                Proceed to Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
