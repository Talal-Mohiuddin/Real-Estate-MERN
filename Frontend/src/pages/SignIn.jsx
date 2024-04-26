import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {
  userLoginFail,
  userLoginRequest,
  userLoginSuccess,
} from "../redux/userSlice.js";
import Oauth from "../components/Oauth.jsx";
import { URL } from "../URL.jsx";

const SignIn = () => {
  const [details, setDetails] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.id]: e.target.value });
  };
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: async () => {
      dispatch(userLoginRequest());
      const { data } = await axios.post(
        `${URL}/user/signin`,
        details,
        {
          withCredentials: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    },
    onError: (error) => {
      dispatch(userLoginFail());
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      dispatch(userLoginSuccess(data));
      toast.success(data.message);
      navigate("/");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  const { isPending } = mutation;
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg my-3"
          id="email"
          value={details.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          value={details.password}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-slate-700 uppercase text-white p-3 rounded-lg hover:opacity-95 disabled:opacity-80 cursor-pointer"
          disabled={isPending}
        >
          {isPending ? "Loading" : "Login"}
        </button>
        <Oauth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?</p>
        <Link to="/signup" className="text-blue-700">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
