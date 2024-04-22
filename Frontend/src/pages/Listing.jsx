import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "../components";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed, FaBath, FaParking, FaChair } from "react-icons/fa";

const Listing = () => {
  SwiperCore.use([Navigation]);
  const { id } = useParams();
  const [list, setlist] = useState({});
  const { isLoading, error, data } = useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const { data, error } = await axios.get(
        `http://localhost:3000/listing/getindividuallisting/${id}`,
        {
          withCredentials: true,
        }
      );
      setlist(data.listing);
      return data;
    },
  });

  if (isLoading) {
    return <Spinner />;
  }
  if (error) {
    return <div>{error.response.data.message || "Something went Wrong"}</div>;
  }
  console.log(list);

  return (
    <main>
      {list && (
        <div>
          <Swiper navigation>
            {list.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {list.name} - ${" "}
              {list?.offer
                ? list?.discountedPrice.toLocaleString("en-US")
                : list?.regularPrice.toLocaleString("en-US")}
              {list.type === "rent" && " / month"}
            </p>
            <p className="flex items-center mt-6 gap-2 text-slate-600  text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {list.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {list.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {list.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+list.regularPrice - +list.discountedPrice} OFF
                </p>
              )}
            </div>
            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {list.description}
            </p>
            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBed className="text-lg" />
                {list.bedrooms > 1
                  ? `${list.bedrooms} beds `
                  : `${list.bedrooms} bed `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaBath className="text-lg" />
                {list.bathrooms > 1
                  ? `${list.bathrooms} baths `
                  : `${list.bathrooms} bath `}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaParking className="text-lg" />
                {list.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap ">
                <FaChair className="text-lg" />
                {list.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
};

export default Listing;
