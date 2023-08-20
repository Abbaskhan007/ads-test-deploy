import React, { useRef, useState } from "react";
import { getRequrieRules, getValidateEmailRules } from "../fn-utli/form-util";
import { Input, Form, Button } from "antd";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function ContactForm() {
  const form = useRef();
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    message: "",
  });

  const contactUsFormHandler = e => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_tkitctn",
        "template_l9wab3c",
        form.current,
        "8Uw7kP2HDN-DENDjQ"
      )
      .then(
        result => {
          toast.success("Email Sent Successfully!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setFormData({ firstName: "", email: "", message: "" });
        },
        error => {
          toast.error("Email Sending Failed", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          console.log(error.text);
        }
      );
  };
  return (
    <div className="xl:p-16 lg:p-12 sm:p-10 p-6 bg-white lg:mb-0 sm:mb-24 mb-16 rounded-lg contact-form shadow-md">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <h2 className="font-semibold lg:text-3xl text-2xl  mb-7 text-gray-700">
        Send us a Message
      </h2>
      <form ref={form} onSubmit={contactUsFormHandler} layout="vertical">
        <Form.Item label="First Name" rules={[getRequrieRules("first name")]}>
          <Input
            value={formData?.firstName}
            onChange={e =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            name={"firstName"}
            className="border-0 text-lg font-medium text-gray-400 border-b border-b-gray-200 rounded-none w-full hover:border-0 hover:border-b focus:border-0 focus:border-b hover:border-b-primary"
          ></Input>
        </Form.Item>
        <Form.Item
          label="Email"
          rules={[getRequrieRules("email"), getValidateEmailRules()]}
        >
          <Input
            name={"email"}
            value={formData?.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="border-0 text-lg font-medium text-gray-400 border-b border-b-gray-200 rounded-none w-full hover:border-0 hover:border-b focus:border-0 focus:border-b hover:border-b-primary"
          ></Input>
        </Form.Item>
        <Form.Item label="Message" rules={[getRequrieRules("message")]}>
          <Input.TextArea
            value={formData?.message}
            onChange={e =>
              setFormData({ ...formData, message: e.target.value })
            }
            name={"message"}
            className="border-0 text-lg font-medium text-gray-400 border-b border-b-gray-200 rounded-none w-full hover:border-0 hover:border-b focus:border-0 focus:border-b hover:border-b-primary"
          ></Input.TextArea>
        </Form.Item>
        <div className="flex justify-end">
          <Button
            htmlType="submit"
            className="bg-primary h-auto px-6 py-2 text-white hover:opacity-90"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
