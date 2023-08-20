import { useState } from "react";
import { Form, Input, Button } from "antd";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Typography } from "antd";
import Link from "next/link";
import axios from "axios";
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

export default function register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { Title } = Typography;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handlerRegister = async (e) => {
    // const result = await signIn("credentials", {
    //   email,
    //   password,
    //   redirect: false,
    // });
    try {
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
        return toast.error("Password and Confirm Password is not equal", {
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
      setIsLoading(true);
      const { data } = await axios.post("/api/signUp", {
        firstName,
        lastName,
        email,
        password,
        providerType: "credentials",
      });
      console.log("Result", data);
      // setLastName("");
      // setFirstName("");
      // setEmail("");
      // setPassword("");
      // setConfirmPassword("");

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

      form.resetFields();

      //router.push("signIn");

      // await signIn("credentials", {
      //   email,
      //   password,
      //   redirect: true,
      //   callbackUrl: "/",
      // });
    } catch (err) {
      console.log("Error", err);
      return toast.error(err?.response?.data, {
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

    // Handle login result (e.g., redirect, error handling)
  };
  return (
    <div className="h-screen flex items-center bg-[#F1FAF9] ">
      <ToastContainer />
      <Form
        form={form}
        className="w-[500px] mx-auto bg-white p-10 rounded-lg "
        onFinish={handlerRegister}
      >
        <div className="flex space-x-3 justify-center items-center">
          <Title className="pt-[10px]" level={3}>
            Sign Up
          </Title>
          <button className="text-gray-800 font-bold text-xl">
            <div className="">
              <Image width={130} height={90} src={"/images/logo.png"} />
            </div>
          </button>
        </div>
        {/* <Form.Item name="firstName" rules={[getRequrieRules("first name")]}>
          <Input
            placeholder="Enter your First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
        </Form.Item> */}
        {/* <Form.Item name="lastName" rules={[getRequrieRules("last name")]}>
          <Input
            placeholder="Enter your Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </Form.Item> */}

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
        <Form.Item
          rules={[{ required: true, type: "password" }]}
          name="confirmPassword"
        >
          <Input.Password
            placeholder="Confirm Your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            Sign Up
          </Button>
        </Form.Item>
        <p className="text-sm text-gray-400 text-center">
          Already have an Account? Click here to{" "}
          <Link className="underline text-blue-400" href="/signIn">
            Log In
          </Link>
        </p>
      </Form>
    </div>
  );
}

// import { useRouter } from "next/router";
// import { useEffect } from "react";
// import { signIn } from "next-auth/react";
// import { setCookie } from "nookies";
// import Head from "next/head";

// <Head>
// <script
//       dangerouslySetInnerHTML={{
//         __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
//       }}
//     />
//     <script
//       async
//       src="https://r.wdfl.co/rw.js"
//       data-rewardful="6e34fc"
//     ></script>
// </Head>

// export default function Register() {
//   const router = useRouter();

// <Head>
// <script
//       dangerouslySetInnerHTML={{
//         __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
//       }}
//     />
//     <script
//       async
//       src="https://r.wdfl.co/rw.js"
//       data-rewardful="6e34fc"
//     ></script>
// </Head>

//   useEffect(() => {
//     if (router.query.ref) {
//       // set the ref parameter as a cookie
//       setCookie(null, "ref", router.query.ref, {
//         maxAge: 30 * 24 * 60 * 60,
//         path: "/",
//       });

//       // redirect to sign-in page
//       signIn("credentials", { ref: router.query.ref }); // use signIn function
//     } else {
//       // redirect to home page
//       router.replace("/");
//     }
//   }, [router.query.ref]); // run the effect whenever router.query.ref changes

//   return (
//     <div>
//       <p>Redirecting to sign-in...</p>
//     </div>
//   );
// }
