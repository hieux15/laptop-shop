import nodemailer from "nodemailer";

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM } = process.env;

const transport = nodemailer.createTransport(
  MAIL_HOST && MAIL_PORT && MAIL_USER && MAIL_PASS
    ? {
        host: MAIL_HOST,
        port: Number(MAIL_PORT),
        secure: Number(MAIL_PORT) === 465,
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASS,
        },
      }
    : {
        // development fallback
        jsonTransport: true,
      }
);

export async function sendEmail({ to, subject, html, text }) {
  if (!to || (!html && !text)) {
    throw new Error("Missing email params");
  }

  if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) {
    console.log("[mail-fallback] To:", to);
    console.log("[mail-fallback] Subject:", subject);
    console.log("[mail-fallback] Text:", text);
    console.log("[mail-fallback] HTML:", html);
    return { message: "email logged to console" };
  }

  const info = await transport.sendMail({
    from: MAIL_FROM || `no-reply@${process.env.NEXT_PUBLIC_URL || "localhost"}`,
    to,
    subject,
    text,
    html,
  });

  return info;
}
