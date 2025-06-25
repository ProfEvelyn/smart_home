import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL_USER,
    pass: process.env.NEXT_PUBLIC_NODEMAILER_PASSWORD,
  },
});

// Email Subjects
const subjects = {
  security: "Security Alert",
  motion: "Motion Detected",
  flame: "Flame Detected",
};

export async function POST(req) {
  const { email, alertType, details } = await req.json();
  const subject = subjects[alertType] || "Smart Home Notification";

  //simplespecific messages
  let message = "";
  if (alertType === "security") {
    message = `
      <p>There was a failed login attempt using the email <strong>${details}</strong>.</p>
      <p>If this wasn't you, please contact HomePulse support immediately.</p>
    `;
  } else if (alertType === "motion") {
    message = `<p>Motion has been detected in your home. Please check your security feed.</p>`;
  } else if (alertType === "flame") {
    message = `<p><strong>Flame alert:</strong> A flame has been detected in your house. Please check your house immediately!</p>`;
  } else {
    message = `<p>${details}</p>`;
  }

  try {
    await transporter.sendMail({
      from: `"Smart Home System" <${process.env.NEXT_PUBLIC_EMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 16px; border: 1px solid #eee;">
          <h2 style="color: #d63031;">${subject}</h2>
          ${message}
          <hr style="margin-top: 20px;"/>
          <p style="font-size: 0.8em; color: #636e72;">This is an automated alert from your Smart Home System.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
