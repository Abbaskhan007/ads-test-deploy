import { useState } from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import Image from "next/image";
import { Typography } from "antd";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getRequrieRules, getValidateEmailRules } from "../fn-utli/form-util";

export default function forgetPassword() {
  const [email, setEmail] = useState("");

  const { Title } = Typography;
  //   const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onReset = async e => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/forgetPassword", { email });
      console.log("Data of email", data);
      toast.success("Reset Passord Link Sent!, Check your email", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log("Error", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-screen flex items-center bg-[#F1FAF9] ">
      <ToastContainer />
      <form
        className="w-[500px] mx-auto bg-white p-10 rounded-lg "
        onSubmit={onReset}
      >
        <div className="flex space-x-3 justify-center items-center">
          <Title className="pt-[10px]" level={3}>
            Forget Password
          </Title>
          <button className="text-gray-800 font-bold text-xl">
            <div className="">
              <Image width={130} height={90} src={"/images/logo.png"} />
            </div>
          </button>
        </div>

        <Form.Item
          name="email"
          rules={[getRequrieRules("email"), getValidateEmailRules()]}
        >
          <Input
            placeholder="Enter your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
