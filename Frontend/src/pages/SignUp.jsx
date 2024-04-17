import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

const SignUp = () => {
  const [details, setDetails] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        "http://localhost:3000/user/signup",
        details
      );
      return data;
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/signin");
      setDetails({ name: "", email: "", password: "" });
    },
  });

  const { isPending } = mutation;

  function handleChange(e) {
    setDetails({ ...details, [e.target.id]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    mutation.mutate();
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="name"
          className="border p-3 rounded-lg"
          id="name"
          value={details.name}
          onChange={handleChange}
        />
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
          {isPending ? "Loading" : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/signin" className="text-blue-700">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
