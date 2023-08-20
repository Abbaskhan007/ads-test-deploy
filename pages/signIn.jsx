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
import Head from "next/head";

<Head>
  <script
    dangerouslySetInnerHTML={{
      __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
    }}
  />
  <script async src="https://r.wdfl.co/rw.js" data-rewardful="6e34fc"></script>
</Head>;
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { Title } = Typography;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onForgetHandle = async () => {
    const { data } = await axios.post("/api/forgetPassword", {});
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result.error) {
        return toast.error(result.error, {
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
      router.push("/");
      console.log("Result", result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    // Handle login result (e.g., redirect, error handling)
  };

  return (
    <div className="h-screen flex items-center bg-[#F1FAF9] ">
      <ToastContainer />
      <form
        className="w-[500px] mx-auto bg-white p-10 rounded-lg "
        onSubmit={handleLogin}
      >
        <div className="flex space-x-3 justify-center items-center">
          <Title className="pt-[10px]" level={3}>
            Log In
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
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          rules={[{ required: true, type: "password" }]}
          name="password"
        >
          <Input.Password
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            Login
          </Button>
        </Form.Item>
        <p className="text-sm text-gray-400 text-center">
          Don't have an Account? Click here to{" "}
          <Link className="underline text-blue-400" href="/register">
            CREATE ACCOUNT
          </Link>
        </p>
        <Link href="forgetPassword">
          <p className="text-right pt-2 text-sm  text-slate-500">
            Forgot Password?
          </p>
        </Link>
      </form>
    </div>
  );
}

{
  /* <Form onFinish={handleLogin}>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: "email" }]}
      >
        <Input value={email} onChange={e => setEmail(e.target.value)} />
      </Form.Item>

      <Form.Item label="Password" name="password" rules={[{ required: true }]}>
        <Input.Password
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
      </Form.Item>
    </Form> */
}
