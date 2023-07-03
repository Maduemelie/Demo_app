import nodemailer from "nodemailer";

export async function sendResetPasswordEmail(email, resetToken) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Compose the email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Dear user,\n\nYou have requested to reset your password. Please click on the following link to reset your password:\n\nhttps://example.com/reset-password?token=${resetToken}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nThe Example Team`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
}
