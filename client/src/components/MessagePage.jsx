/* eslint-disable react/prop-types */
import "react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import uploadFile from "../helpers/uploadFile";
import { IoIosClose } from "react-icons/io";
import Loading from "./Loading";
import backgroundImage from "../assets/wallapaper.jpeg";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);
  // const [, setMessagesStatus] = useState({});

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behaviour: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadPhoto = await uploadFile(file);
      setMessage((prev) => ({
        ...prev,
        imageUrl: uploadPhoto.url,
        videoUrl: "",
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      setOpenImageVideoUpload(false);
    }
  };

  const handleClearUploadImage = () => {
    setMessage((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const handleClearUploadVideo = () => {
    setMessage((prev) => ({
      ...prev,
      videoUrl: "",
    }));
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadPhoto = await uploadFile(file);
      setMessage((prev) => ({
        ...prev,
        videoUrl: uploadPhoto.url,
        imageUrl: "",
      }));
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setIsUploading(false);
      setOpenImageVideoUpload(false);
    }
  };

  // Render message status indicators
  const MessageStatus = ({ msg }) => {
    // Only show status for messages sent by the current user
    if (user._id !== msg.msgByUserId) {
      return null;
    }

    if (msg.seen) {
      return (
        <span className="text-primary ml-1">
          <IoCheckmarkDoneSharp />
        </span>
      );
    } else if (msg.delivered) {
      return (
        <span className="text-gray-500 ml-1">
          <IoCheckmarkDoneSharp />
        </span>
      );
    } else {
      return (
        <span className="text-gray-500 ml-1">
          <IoCheckmarkSharp />
        </span>
      );
    }
  };

  useEffect(() => {
    if (socketConnection) {
      // Join the message room for this conversation
      socketConnection.emit("message-page", params.userId);
      socketConnection.emit("mark_as_delivered", params.userId);
      socketConnection.emit("seen", params.userId);

      // Get user data of the conversation partner
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });

      // Load initial message history
      socketConnection.on("message", (data) => {
        console.log("message data", data);
        setAllMessage(data);
      });

      // Listen for new incoming messages
      socketConnection.on("receive_message", (newMessage) => {
        console.log("Received new message:", newMessage);
        setAllMessage((prevMessages) => [...prevMessages, newMessage]);

        // Mark received message as seen immediately since we're in the chat
        socketConnection.emit("seen", newMessage.msgByUserId);
      });

      // Handle sent message confirmation
      socketConnection.on("message_sent", (sentMessage) => {
        console.log("Message sent confirmation:", sentMessage);
        setAllMessage((prevMessages) => [...prevMessages, sentMessage]);
      });

      // Listen for messages being delivered
      socketConnection.on("messages_delivered", (data) => {
        console.log("Messages delivered:", data);
        setAllMessage((prevMessages) =>
          prevMessages.map((msg) =>
            msg.msgByUserId === user._id ? { ...msg, delivered: true } : msg
          )
        );
      });

      // Listen for messages being seen
      socketConnection.on("messages_seen_by", (data) => {
        console.log("Messages seen:", data);
        setAllMessage((prevMessages) =>
          prevMessages.map((msg) =>
            msg.msgByUserId === user._id ? { ...msg, seen: true } : msg
          )
        );
      });
    }

    return () => {
      if (socketConnection) {
        socketConnection.off("message-user");
        socketConnection.off("message");
        socketConnection.off("receive_message");
        socketConnection.off("message_sent");
        socketConnection.off("messages_delivered");
        socketConnection.off("messages_seen_by");
      }
    };
  }, [socketConnection, params?.userId, user]);

  const handleOnchange = (e) => {
    // eslint-disable-next-line no-unused-vars
    const { name, value } = e.target;

    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        const newMessage = {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
          createdAt: new Date().toISOString(), // Add timestamp for immediate display
        };

        // We don't need to update the UI here anymore as we'll rely on the socket message_sent event
        socketConnection.emit("new message", newMessage);

        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4  dark:bg-slate-900 text-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden" title="Go back">
            <FaAngleLeft size={25} />
          </Link>
          <div>
            <Avatar
              width={50}
              height={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-my-2 text-sm">
              {dataUser.online ? (
                <span className="text-primary">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-primary" title="Info">
            <HiDotsVertical />
          </button>
        </div>
      </header>

      {/* To show all message */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50 ">
        {/* Text Dispaly */}
        {/* Text Display */}
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessage.map((msg, index) => {
            return (
              <div
                key={index}
                className={`
          p-1 py-1 rounded w-fit max-w-[250px] md:max-w-sm lg:max-w-md 
          ${
            user._id === msg.msgByUserId
              ? "ml-auto bg-teal-200 dark:bg-teal-800 text-slate-900 dark:text-teal-100"
              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          }
        `}
              >
                <div className="w-full">
                  {msg?.imageUrl && (
                    <img
                      src={msg?.imageUrl}
                      className="w-full h-full object-scale-down"
                    />
                  )}
                  {msg?.videoUrl && (
                    <video
                      src={msg?.videoUrl}
                      className="w-full h-full object-scale-down"
                      controls
                      muted
                      autoPlay
                    />
                  )}
                </div>
                <p className="px-2">{msg.text}</p>
                <div className="flex items-center justify-end px-2 text-xs">
                  <span>
                    {msg.createdAt
                      ? moment(msg.createdAt).format("hh:mm A")
                      : "No timestamp"}
                  </span>
                  <MessageStatus msg={msg} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading indicator using custom Loading component */}
        {isUploading && (
          <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden absolute top-0 left-0 z-10">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center sticky bottom-0 ">
              <Loading />
              <p className="text-primary mt-3">Uploading media...</p>
            </div>
          </div>
        )}
        {/* upload image display */}
        {message.imageUrl && (
          <div className="w-full sticky bottom-0 h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadImage}
            >
              <IoIosClose size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {/* upload video display */}
        {message.videoUrl && (
          <div className="w-full sticky bottom-0  h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              onClick={handleClearUploadVideo}
            >
              <IoIosClose size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                alt="uploadVideo"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
      </section>

      {/* Send Message */}
      <section className="h-16 bg-white flex items-center px-4 text-slate-800 dark:text-slate-900">
        <div className="relative ">
          <button
            onClick={handleUploadImageVideoOpen}
            className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white "
          >
            <FaPlus title="Add Image/Video" size={17} />
          </button>

          {/* video and image upload menu */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2 z-20">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center px-3 p-2 gap-3 hover:bg-slate-200 cursor-pointer"
                  title="Upload Image"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center px-3 p-2 gap-3 hover:bg-slate-200 cursor-pointer"
                  title="Upload Video"
                >
                  <div className="text-purple-600">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  accept="image/*"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  accept="video/*"
                  onChange={handleUploadVideo}
                  className="hidden"
                  autoPlay
                />
              </form>
            </div>
          )}
        </div>

        {/* input box */}
        <form
          className="h-full w-full flex gap-2 "
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="Type here..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnchange}
          />
          <button title="Send" className="text-primary hover:text-secondary">
            <IoMdSend size={25} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
