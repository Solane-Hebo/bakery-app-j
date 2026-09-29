import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  throw new Error(
    "RESEND_API_KEY is not defined in environment variables"
  );
}

const resend = new Resend(apiKey);

type SendPasswordResetEmailProps = {
  email: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail({
  email,
  resetUrl,
}: SendPasswordResetEmailProps) {
  const { data, error } = await resend.emails.send({
    from: "Harme App <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Reset your password</h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to choose a new password.
        </p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #553030;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset password
        </a>

        <p style="margin-top: 20px;">
          This link expires in 15 minutes.
        </p>

        <p>
          If you did not request a password reset,
          you can ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend error:", error);
    throw new Error("Could not send password reset email");
  }

  return data;
}