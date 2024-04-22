import React,{useEffect, useState} from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link,useNavigate } from "react-router-dom";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const [serchTerm, setserchTerm] = useState("");
  const navigate = useNavigate();
  const userimage = user?.user?.avatar;


  function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", serchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTerm = urlParams.get("searchTerm");
    setserchTerm(searchTerm || "");
  },[location.search])
  
  return (
    <header className="shadow-md bg-slate-200">
      <div className="flex items-center max-w-6xl  justify-between mx-auto p-3">
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Talal</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <ul className="flex gap-4">
          <Link
            to={"/"}
            className="hidden sm:inline text-slate-700 hover:underline transition-all duration-200"
          >
            Home
          </Link>
          <Link
            to={"/about"}
            className="hidden sm:inline text-slate-700 hover:underline transition-all duration-200"
          >
            About
          </Link>
          {user ? (
            <Link to={"/profile"}>
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={userimage}
                alt="profile"
              />
            </Link>
          ) : (
            <Link
              to={"/signin"}
              className=" text-slate-700 hover:underline transition-all duration-200"
            >
              Sign in
            </Link>
          )}
        </ul>
        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 flex items-center rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={serchTerm}
            onChange={(e) => setserchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-500" />
          </button>
        </form>
      </div>
    </header>
  );
};

export default Header;
