import { useState } from "react";
import { Form, Input, Button } from "antd";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Typography } from "antd";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import { getRequrieRules, getValidateEmailRules } from "../fn-utli/form-util";
import axios from "axios";

export default function resetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { Title } = Typography;
  const { token } = router.query;

  const handleReset = async e => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (password.length < 6) {
        return toast.error("Password Length should be atleast 6 characters", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      if (password !== confirmPassword) {
        return toast.error("Password and Confirm Password is not same", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      console.log("Token", token);
      const { data } = await axios.post("api/resetPassword", {
        token,
        password,
      });
      console.log("Data of ---", data);
      toast.success("Password Reset Successfully", {
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
      console.log("Error", error);
      return toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-screen flex items-center bg-[#F1FAF9] ">
      <ToastContainer />
      <form
        className="w-[500px] mx-auto bg-white p-10 rounded-lg "
        onSubmit={handleReset}
      >
        <div className="flex space-x-3 justify-center items-center">
          <Title className="pt-[10px]" level={3}>
            Reset Password
          </Title>
          <button className="text-gray-800 font-bold text-xl">
            <div className="">
              <Image width={130} height={90} src={"/images/logo.png"} />
            </div>
          </button>
        </div>

        <Form.Item
          rules={[{ required: true, type: "password" }]}
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password
            placeholder="Enter New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          rules={[{ required: true, type: "password" }]}
          name="confirmPassword"
          rules={[{ required: true }]}
        >
          <Input.Password
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button
            size="large"
            className="bg-blue-500  text-white text-lg font-medium"
            block
            htmlType="submit"
            loading={isLoading}
          >
            Reset
          </Button>
        </Form.Item>
      </form>
    </div>
  );
}
