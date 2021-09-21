import Email from "email-templates";
import path from "path";
import { createTransport } from "nodemailer";

async function sendMail(to, template, locals) {
  const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    from: `${process.env.SMTP_NO_REPLY_DISPLAY_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    auth: {
      user: process.env.SMTP_NO_REPLY_MAIL,
      pass: process.env.SMTP_NO_REPLY_MAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  console.log("Transporter value:", transporter)
  const sendMail = process.env.SEND_MAIL === "true";
  const showPreview = process.env.SHOW_EMAIL_PREVIEW === "true";
  let email = new Email({
    send: sendMail,
    preview: showPreview,
    transport: transporter,
    juiceResources: {
      webResources: {
        relativeTo: path.join(__dirname, "emails", template),
      },
    },
    message: undefined,
  });
  await email.send({
    template,
    message: {
      to,
      from: process.env.SMTP_FROM_EMAIL,
    },
    locals,
  });
}

module.exports = { sendMail };
