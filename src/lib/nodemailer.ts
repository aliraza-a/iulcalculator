// src/lib/nodemailer.ts
import nodemailer from "nodemailer";
import { google } from "googleapis";

const OAuth2 = google.auth.OAuth2;

export const createTransporter = async () => {
  try {
    // Validate environment variables
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
    const smtpUser = process.env.SMTP_USER;

    if (!clientId || !clientSecret || !refreshToken || !smtpUser) {
      throw new Error(
        "Missing required environment variables for email configuration"
      );
    }

    const oauth2Client = new OAuth2(
      clientId,
      clientSecret,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const accessToken = await new Promise<string>((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.error("Failed to get access token:", err);
          reject(new Error("Failed to create access token"));
        }
        if (!token) {
          reject(new Error("No access token received"));
        }
        resolve(token as string);
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: smtpUser,
        clientId,
        clientSecret,
        refreshToken,
        accessToken,
      },
    });

    // Verify connection (optional but recommended)
    await transporter.verify();
    console.log("Email transporter ready");

    return transporter;
  } catch (error) {
    console.error("Error creating email transporter:", error);
    throw error;
  }
};
