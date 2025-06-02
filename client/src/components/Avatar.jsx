/* eslint-disable react/prop-types */
import "react";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { useMemo } from "react";

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  // Generate avatar initials from name
  const avatarName = useMemo(() => {
    if (!name) return "";

    const splitName = name.split(" ");

    if (splitName.length > 1) {
      return splitName[0][0] + splitName[1][0];
    } else {
      return splitName[0][0];
    }
  }, [name]);

  
  const bgColorIndex = useMemo(() => {
    if (!name) return 0;

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash + name.charCodeAt(i)) % 9;
    }
    return hash;
  }, [name]);

  const bgColor = [
    "bg-slate-200",
    "bg-teal-200",
    "bg-red-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-gray-200",
    "bg-cyan-300",
    "bg-sky-200",
    "bg-blue-200",
  ];

  const isOnLine = onlineUser.includes(userId);

  // Common styling for the container
  const containerStyle = {
    width: `${width}px`,
    height: `${height}px`,
  };

  return (
    <div className="relative" style={{ width: `${width}px`, height: `${height}px` }}>
      <div
        className="text-slate-800 rounded-full shadow flex justify-center items-center overflow-hidden dark:bg-slate-900  dark:hover:text-slate-400 dark:text-slate-500"
        style={containerStyle}
      >
        {imageUrl ? (
          <div className="w-full h-full">
            <img
              src={imageUrl}
              alt={name || "User avatar"}
              className="w-full h-full object-cover"
              style={{
                minWidth: "100%",
                minHeight: "100%",
              }}
            />
          </div>
        ) : name ? (
          <div
            className={`w-full h-full flex justify-center items-center text-xl font-bold ${bgColor[bgColorIndex]}`}
          >
            {avatarName}
          </div>
        ) : (
          <HiOutlineUserCircle
            size={Math.min(width, height)}
            className="flex-shrink-0"
          />
        )}
      </div>
      
      {isOnLine && (
        <div
          className="bg-green-600 absolute rounded-full border-2 border-white"
          style={{
            width: `${Math.max(width * 0.2, 8)}px`,
            height: `${Math.max(height * 0.2, 8)}px`,
            bottom: "2px",
            right: "-4px",
          }}
        ></div>
      )}
    </div>
  );
};
export default Avatar;
