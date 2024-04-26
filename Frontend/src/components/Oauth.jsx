import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { userLoginSuccess } from "../redux/userSlice";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { URL } from "../URL";

const Oauth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      const { displayName: name, email, photoURL: photo } = result.user;

      const { data } = await axios.post(
        `${URL}/user/oauth`,
        {
          name,
          email,
          photo,
        },
        { withCredentials: true },
        { headers: { "Content-Type": "application/json" } }
      );
      return data;
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      toast.success(data.message);
      dispatch(userLoginSuccess(data));
      navigate("/");
    },
  });

  const handleGoogleClick = () => {
    mutation.mutate();
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 rounded-lg uppercase p-3 text-white hover:opacity-95"
    >
      Continue with Google
    </button>
  );
};

export default Oauth;
