import nodemailer from "nodemailer";
import sendGridTransport from "nodemailer-sendgrid-transport";
const transporter = nodemailer.createTransport(
  sendGridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const sendResetEmail = async (email, resetUrl = "") => {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.SUPPORT_NAME} <${process.env.SUPPORT_EMIAL}>`, // sender address
      to: email, // list of receivers
      subject: "Request for reset password", // Subject line
      text: "You have sent a request to reset your password", // plain text body
      html: `<a href="${process.env.DOMAIN_NAME}/resetPassword?token=${resetUrl}">Reset Password</a>`, // html body
    });
    console.log("---- info ----", info);
  } catch (error) {
    console.log("Error in sending Email", error);
  }
};

export const VerificationEmail = async (email, token) => {
  try {
    const info = await transporter.sendMail({
      from: `${process.env.SUPPORT_NAME} <${process.env.SUPPORT_EMIAL}>`,
      to: email,
      subject: "AdsReveal Account Verification",
      text: "Please Verify your email",
      html: `<a href="${process.env.DOMAIN_NAME}/verifyEmail?token=${token}&email=${email}">Verify Email</a>`, // html body
    });
    console.log("---- info ----", info);
  } catch (error) {
    console.log("Error in sending Email", error);
  }
};

export default sendResetEmail;
