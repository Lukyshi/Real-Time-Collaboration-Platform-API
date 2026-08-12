import { transport } from "../workspace-invitation/email.service.js";

export const sendVerificationEmail = async ({ to, token, name }) => {
  console.log("📧 sendVerificationEmail CALLED:", to);
  const verifyLink = `${process.env.APP_URL}/api/v1/verification/verify-email?token=${encodeURIComponent(token)}`;

  return transport.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Verify your email address",
    html: `
    <h2>Verify your email</h2>

    <p>Hello ${name},</p>

      <p>
        Thanks for creating an account.
        Please verify your email address by clicking the button below.
      </p>

      <p>
        <a
          href="${verifyLink}"
          style="
            display:inline-block;
            padding:12px 20px;
            background:#2563eb;
            color:#ffffff;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Verify Email
        </a>
      </p>

      <p>This link expires in 24 hours.</p>

      <p>
        If you didn't create this account, you can safely ignore this email.
      </p>
    
    `,
  });
};
