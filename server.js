const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // <<--- Add this at the top

const app = express();
const PORT = process.env.PORT || 5000; // <<-- Use from .env or default 5000

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// POST route to handle form
app.post("/send-email", async (req, res) => {
  const { user_name, user_email, message, phone, subject } = req.body;

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // <-- from .env
        pass: process.env.GMAIL_PASS, // <-- from .env
      },
    });


    await transporter.sendMail({
      from: process.env.SENDING_MAIL,
      to: process.env.SENDING_MAIL,
      replyTo: user_email, // <- this is what you want
      subject: "New Contact Form Submission From Your Portfolio Website",
      html: `
        <h3>New Message From <a href="https://awanishkumar.com" target="_blank">https://awanishkumar.com/</a> </h3>
        <p><strong>Name:</strong> ${user_name}</p>
        <p><strong>Email:</strong> ${user_email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    });
    

    // Send confirmation mail to user
    await transporter.sendMail({
      from:process.env.SENDING_MAIL,
      to: user_email,
      subject: "Thank you for contacting Awanish Kumar",
      html: `
        <h3>Dear ${user_name},</h3> 
<p>Thank you for reaching out to me. This is an automated response to let you know that I've received your message.</p>
<p>I personally review all inquiries and will get back to you within 1-2 business days with a thoughtful response. If your matter requires immediate attention, please reply with "URGENT" in the subject line.</p>
<p>If you're inquiring about Digital Dadi, please visit our official website at <a href="https://digitaldadi.in/" target="_blank">https://digitaldadi.in/</a> for immediate information about our services and offerings.</p>
<p>I look forward to connecting with you soon.</p>
<p>Best regards,<br>Awanish Kumar<br>Founder & Director<br>Digital Dadi</p>

      `,
    });

    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ message: "Failed to send emails" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
