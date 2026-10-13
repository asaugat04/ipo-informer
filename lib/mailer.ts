import nodemailer from "nodemailer";
import { log } from "./logger";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html,
    });
    log.info("Email sent", info.messageId, "to", to);
    return info;
  } catch (err) {
    log.error("Failed to send email to", to, err);
    throw err;
  }
}
