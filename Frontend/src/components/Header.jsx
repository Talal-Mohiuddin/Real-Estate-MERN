import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
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
          <Link
            to={"/signin"}
            className=" text-slate-700 hover:underline transition-all duration-200"
          >
            Sign in
          </Link>
        </ul>
        <form className="bg-slate-100 p-3 flex items-center rounded-lg">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-500" />
        </form>
      </div>
    </header>
  );
};

export default Header;
