import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

/**
 * Sends an HTML email using nodemailer
 */
export async function sendEmail(subject, receiver, html) {
  const mailOptions = {
    from: `"CivicTrack: " <${process.env.GMAIL_USER}>`,
    to: receiver,
    subject: `CivicTrack: ${subject}`,
    html
  };
  try {

    await transporter.sendMail(mailOptions);
    console.log("Mail sent to:", receiver);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function sendOTP(receiver, otp) {
  console.log("GMAIL_USER:", process.env.GMAIL_USER);
  console.log("GMAIL_PASS:", process.env.GMAIL_PASS ? "Loaded" : "Missing");
  const subject = "Your OTP Code";
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color: #333333; text-align: center;">🔐 Email Verification</h2>
        <p style="font-size: 16px; color: #555555;">Hi there,</p>
        <p style="font-size: 16px; color: #555555;">
          Your One-Time Password (OTP) for verifying your email is:
        </p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="display: inline-block; font-size: 32px; color: #4CAF50; font-weight: bold; letter-spacing: 2px;">
            ${otp}
          </span>
        </div>
        <p style="font-size: 14px; color: #999999;">
          This OTP is valid for 5 minutes. Please do not share it with anyone.
        </p>
        <p style="font-size: 14px; color: #999999; margin-top: 40px;">
          Regards,<br/>Civic Track Team
        </p>
      </div>
    </div>
  `;

  return await sendEmail(subject, receiver, html);
}
