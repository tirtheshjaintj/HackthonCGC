import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    const mailOptions = {
      from: `"Lets Connect" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>OTP Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h3 style="color: #272727;">${otp}</h3>
          <p>This OTP is valid for the next 10 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("OTP email sent: ", info.response);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
};
