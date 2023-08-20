import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { useLottie } from "lottie-react";
import paymentAnimation from "../public/emailSuccess.json";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function verifyEmail({ params }) {
  const router = useRouter();
  const { token, email } = router.query;
  console.log("Token", token, email);
  const [success, setSuccess] = useState("");
  const options = {
    animationData: paymentAnimation,
    loop: true,
  };

  const { View } = useLottie(options);

  const confirmData = async () => {
    try {
      const { data } = await axios.post("/api/verifyEmail", {
        token,
        email,
      });

      console.log("Data -----", data);
      toast.success(data?.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.push("/signIn");
    } catch (error) {
      toast.error("Incorrect Token or Email", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      router.push("/register");
    }
  };

  useEffect(() => {
    if (token && email) confirmData();
  }, [token, email]);

  if (success === true) {
    return (
      <div className="h-screen flex flex-col w-full items-center justify-center -mt-20">
        <ToastContainer />
        <div className="w-[400px] h-[300px]"> {View}</div>
        <span className="font-semibold text-2xl ">Email Verified</span>
      </div>
    );
  } else if (success === false) {
    return (
      <div>
        {" "}
        <ToastContainer />
      </div>
    );
  } else {
    return (
      <div className="h-screen flex flex-col w-full items-center justify-center -mt-20">
        <div className="w-[400px] h-[300px]"> {View}</div>
        <span className="font-semibold text-2xl ">Verifying</span>
      </div>
    );
  }
}
