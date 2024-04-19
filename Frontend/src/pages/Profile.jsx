import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  updateUserFail,
  updateUserRequest,
  updateUserSuccess,
} from "../redux/userSlice.js";

const Profile = () => {
  const fileref = useRef(null);
  const { user } = useSelector((state) => state.user);
  const userProfile = user?.user?.avatar;
  const [filePercentage, setfilePercentage] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData, setformData] = useState({
    name: user?.user?.name,
    email: user?.user?.email,
    password: "",
    avatar: userProfile,
  });
  const [file, setfile] = useState(undefined);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const dispatch = useDispatch();
  const { name, email, avatar, password } = formData;

  function handleChnage(e) {
    setformData({ ...formData, [e.target.id]: e.target.value });
  }

  const mutation = useMutation({
    mutationFn: async () => {
      dispatch(updateUserRequest());
      const { data } = await axios.post(
        `http://localhost:3000/user/update/${user.user._id}`,
        { ...formData, password: formData.password || user.user.password },
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
      dispatch(updateUserFail(error.response.data.message));
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      dispatch(updateUserSuccess(data));
      toast.success(data.message);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (
      name === user.user.name &&
      email === user.user.email &&
      avatar === user.user.avatar &&
      password === ""
    ) {
      return toast.error("No changes made");
    }

    mutation.mutate();
  }

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilePercentage((oldProgress) => Math.round(progress));
      },
      (error) => {
        setfileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setformData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex gap-4 flex-col">
        <input
          type="file"
          ref={fileref}
          hidden
          accept="image/*"
          onChange={(e) => {
            setfile(e.target.files[0]);
          }}
        />
        <img
          src={formData.avatar || userProfile}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileref.current.click()}
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error uploading file</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-blue-700">Uploading {filePercentage}%</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Name"
          className="border p-3 rounded-lg my-3"
          id="name"
          value={formData.name}
          onChange={handleChnage}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg my-3"
          id="email"
          value={formData.email}
          onChange={handleChnage}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg my-3"
          id="password"
          value={formData.password}
          onChange={handleChnage}
        />
        <button className="bg-slate-700 p-3 uppercase text-white rounded-lg hover:opacity-95 disabled:opacity-80 ">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
