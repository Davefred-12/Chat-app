import "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { HiOutlineUserCircle } from "react-icons/hi2";

const CheckEmailPage = () => {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();
  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_BACKEND_URL}/api/email`;

    try {
      const response = await axios.post(URL, data);
      toast.success(response.data.message);

      if (response.data.success) {
        setData({
          email: "",
        });
        navigate("/password", {
            state: response?.data?.data
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto dark:bg-slate-800 text-slate-800 dark:text-slate-200">
        <div className="w-fit mx-auto mb-2 ">
          <HiOutlineUserCircle 
          size={90}/>
        </div>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your Email"
              className="bg-slate-100 px-2 py-1 focus:outline-primary dark:text-slate-800"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Let&apos;s Go
          </button>
        </form>
        <p className="my-3 text-center">
          New User?{" "}
          <Link to={"/register"} className="hover:text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
