import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteObject,
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
  deleteUserFail,
  deleteUserRequest,
  deleteUserSuccess,
  SignOutRequest,
  SignOutSuccess,
  SignOutFail,
} from "../redux/userSlice.js";
import { Link, useNavigate } from "react-router-dom";

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
  const [getListing, setgetListing] = useState([]);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const mutationDelete = useMutation({
    mutationFn: async () => {
      dispatch(deleteUserRequest());
      const { data } = await axios.delete(
        `http://localhost:3000/user/delete/${user.user._id}`,
        {
          withCredentials: true,
        }
      );
      return data;
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      dispatch(deleteUserFail(error.response.data.message));
    },
    onSuccess: (data) => {
      toast.success(data.message);
      dispatch(deleteUserSuccess());
    },
  });

  function handleDelete() {
    confirm("Are you sure you want to delete your account?");
    if (!confirm) return;
    mutationDelete.mutate();
    navigate("/signin");
  }

  const mutationSignout = useMutation({
    mutationFn: async () => {
      dispatch(SignOutRequest());
      const { data } = await axios.get(`http://localhost:3000/user/signout`, {
        withCredentials: true,
      });
      return data;
    },
    onError: (error) => {
      toast.error(error.response.data.message);
      dispatch(SignOutFail(error.response.data.message));
    },
    onSuccess: (data) => {
      toast.success(data.message);
      dispatch(SignOutSuccess());
    },
  });

  function handleSignout() {
    mutationSignout.mutate();
    navigate("/signin");
  }

  const mutationListing = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get(
        `http://localhost:3000/user/getlisting`,
        {
          withCredentials: true,
        }
      );
      return data;
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      setgetListing(data.listing);
    },
  });

  function showListing() {
    mutationListing.mutate();
  }

  const mutationDeleteListing = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(
        `http://localhost:3000/user/deletelisting/${id}`,
        {
          withCredentials: true,
        }
      );
      setgetListing((oldListing) =>
        oldListing.filter((list) => list._id !== id)
      );
      return data;
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
    onSuccess: (data) => {
      console.log(data.message);
    },
  });

  async function handleFirbaseDelete(imageUrls) {
    const storage = getStorage(app);

    while (imageUrls.length > 0) {
      const url = imageUrls.pop();
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    }
  }

  function handleDeleteListing(id, imageUrls) {
    confirm("Are you sure you want to delete this listing?");
    if (!confirm) return;
    mutationDeleteListing.mutate(id);
    if (mutationDeleteListing.isSuccess) {
      handleFirbaseDelete(imageUrls).then(() => {
        toast.success("Listing deleted successfully");
      });
    }
  }

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
        <Link
          to="/create-listing"
          className="text-center bg-blue-700 text-white p-3 rounded-lg uppercase"
        >
          Create A listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <button onClick={showListing} className="text-green-700 p-3 w-full">
        Show Listing
      </button>
      {getListing && getListing.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-2xl font-semibold">
            Your Listing
          </h1>
          {getListing.map((list) => {
            return (
              <div
                key={list._id}
                className="border p-3 rounded-lg flex justify-between items-center gap-4"
              >
                <Link to={`/listing/${list._id}`}>
                  <img
                    className="h-16 w-16 object-contain"
                    src={list.imageUrls[0]}
                    alt=""
                  />
                </Link>
                <Link
                  className="flex-1 text-slate-700 hover:underline truncate font-semibold"
                  to={`/listing/${list._id}`}
                >
                  <p>{list.name}</p>
                </Link>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() =>
                      handleDeleteListing(list._id, list.imageUrls)
                    }
                    className="text-red-700 uppercase"
                  >
                    Delete
                  </button>
                  <Link to={`/updatelisitng/${list._id}`}>
                    <button className="uppercase text-gray-700">edit</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
