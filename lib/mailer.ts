import nodemailer from "nodemailer";
import { log } from "./logger";
import { env } from "./env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendMail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: env.FROM_EMAIL,
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
