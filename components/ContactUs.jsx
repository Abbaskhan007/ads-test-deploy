import React from "react";
import ContactForm from "./ContactForm";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiMail } from "react-icons/fi";
import emailjs from "@emailjs/browser";
export default function ContactUs() {
  return (
    <section className="w-full xl:mb-28 xl:mt-28 mt-16   lg:mb-16 relative gap-16">
      <div className="mx-auto z-20 px-2 sm:px-6 lg:px-10 xl:gap-24 lg:gap-14  container lg:flex justify-between">
        <div className="flex-1 lg:mb-0 sm:pb-10 pb-16">
          <div className="xl:py-16 lg:py-14 lg:pt-20">
            <h3 className="xl:mb-4  mb-2">CONTACT US</h3>
            <h2 className="xl:text-4xl lg:text-3xl sm:text-3xl text-3xl  leading-[1.1] font-semibold lg:leading-[1.15] text-gray-700">
              Let’s talk about AdsReveal
              <br /> 
            </h2>
          </div>
          <div className="sm:flex xl:mt-16 lg:mt-28 sm:mt-10 mt-6 lg:gap-2 sm:gap-4 w-full justify-between">
            <div className="flex xl:gap-6 lg:gap-2 sm:mb-0 mb-5 sm:gap-6 gap-4 items-center">
              <div>
                <HiOutlineLocationMarker className="text-4xl text-primary font-medium" />
              </div>
              <div>
                <h4 className="text-lg font-medium xl:mb-3 lg:mb-1">
                  Quick Response
                </h4>
                <p className="text-gray-400">
                  We aim to respond to all questions within 24 hours
                </p>
              </div>
            </div>
            <div className="flex xl:gap-6 sm:gap-6 lg:gap-3 gap-5 items-center">
              <div>
                <FiMail className="sm:text-4xl text-3xl text-primary font-medium" />
              </div>
              <div>
                <h4 className="text-lg font-medium xl:mb-3 lg:mb-1">
                  How Can We Help?
                </h4>
                <p className="text-gray-400">support@adsreveal.com</p>
              </div>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
