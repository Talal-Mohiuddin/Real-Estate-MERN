import React, { useState } from "react";
import { app } from "../firebase";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CreateListing = () => {
  const [files, setfiles] = useState([]);
  const [formDate, setformDate] = useState({
    name: "",
    description: "",
    address: "",
    type: "rent",
    parking: false,
    furnished: false,
    offer: false,
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 0,
    imageUrls: [],
  });
  const [imageurlError, setimageurlError] = useState(false);
  const [uploading, setuploading] = useState(false);
  const { id } = useParams();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  async function storeImage(file) {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, `${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },

        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  }

  const handleUploadImage = () => {
    if (files.length > 0 && files.length + formDate.imageUrls.length < 7) {
      setuploading(true);
      setimageurlError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((data) => {
          setformDate({
            ...formDate,
            imageUrls: formDate.imageUrls.concat(data),
          });
          setimageurlError(false);
          setuploading(false);
          toast.success("Images uploaded successfully");
        })
        .catch((error) => {
          setimageurlError(true);
          setuploading(false);
          toast.error("Error uploading image {2 mb max per Image}");
        });
    } else if (files.length + formDate.imageUrls.length > 6) {
      setimageurlError(true);
      setuploading(false);
      toast.error("You can only upload 6 images");
    } else if (files.length === 0) {
      setuploading(false);
      setimageurlError(true);
      toast.error("Please select an image");
    }
  };
  async function handleFirbaseDelete(url) {
    const storage = getStorage(app);
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  }

  const handleChnage = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setformDate({ ...formDate, type: e.target.id });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setformDate({ ...formDate, [e.target.id]: e.target.checked });
    } else {
      setformDate({ ...formDate, [e.target.id]: e.target.value });
    }
  };

  const handleRemoveImage = (index, url) => {
    const newImages = formDate.imageUrls.filter((_, i) => i !== index);
    setformDate({ ...formDate, imageUrls: newImages });
    handleFirbaseDelete(url).then(() => {
      toast.success("File deleted successfully");
    });
  };

  const mutationEdit = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        `http://localhost:3000/listing/editlisting/${id}`,
        formDate,
        {
          withCredentials: true,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/profile");
    },
    onError: () => {
      toast.error("An error has occurred");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formDate.imageUrls.length < 1) {
      toast.error("Please upload at least one image");
      return;
    }
    if (+formDate.discountedPrice > +formDate.regularPrice) {
      toast.error("Discounted price can't be higher than regular price");
      return;
    }
    mutationEdit.mutate();
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await axios.get(
        `http://localhost:3000/listing/getindividuallisting/${id}`,
        {
          withCredentials: true,
        }
      );
      setformDate(data.listing);
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    toast.error(error.response.data.message);
  }

  const { isPending } = mutationEdit;
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            className="border p-3 rounded-lg"
            maxLength="62"
            minLength="10"
            required
            id="name"
            onChange={handleChnage}
            value={formDate.name}
          />
          <textarea
            type="text"
            placeholder="description"
            className="border p-3 rounded-lg"
            required
            id="description"
            onChange={handleChnage}
            value={formDate.description}
          />
          <input
            type="text"
            placeholder="address"
            className="border p-3 rounded-lg"
            required
            id="address"
            onChange={handleChnage}
            value={formDate.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                onChange={handleChnage}
                checked={formDate.type === "sell"}
                type="checkbox"
                id="sell"
                className="w-5"
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChnage}
                checked={formDate.type === "rent"}
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChnage}
                checked={formDate.parking}
                type="checkbox"
                id="parking"
                className="w-5"
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChnage}
                checked={formDate.furnished}
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                onChange={handleChnage}
                checked={formDate.offer}
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                id="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleChnage}
                value={formDate.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                id="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleChnage}
                value={formDate.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="p-3 border border-gray-300 rounded-lg"
                id="regularPrice"
                min="50"
                required
                onChange={handleChnage}
                value={formDate.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-sm">$ / month</span>
              </div>
            </div>
            {formDate.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="p-3 border border-gray-300 rounded-lg"
                  id="discountedPrice"
                  min="0"
                  required
                  onChange={handleChnage}
                  value={formDate.discountedPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-sm">$ / month</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <p className="font-semibold ">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The First Image Will Be Cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="images/*"
              onChange={(e) => {
                setfiles(e.target.files);
              }}
              multiple
              className="p-3 border border-gray-300 rounded w-full"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleUploadImage}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          {formDate.imageUrls.length > 0
            ? formDate.imageUrls.map((url, index) => {
                return (
                  <div
                    key={url}
                    className="flex justify-between  p-3 border items-center"
                  >
                    <img
                      src={url}
                      alt="listing"
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index, url)}
                      className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                    >
                      Delete
                    </button>
                  </div>
                );
              })
            : ""}
          <button
            disabled={isPending || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95  disabled:opacity-80"
          >
            {isPending ? "Updating..." : "Update Listing"}
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateListing;
