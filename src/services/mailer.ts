import nodemailer from "nodemailer";
import { log } from "../utils/logger";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendIpoEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to,
    subject,
    html,
  };


  try {
    const info = await transporter.sendMail(mailOptions);
    log.info("Email sent", info.messageId, "to", to);
    return info;
  } catch (err) {
    log.error("Failed to send email to", to, err);
    throw err;
  }
}
