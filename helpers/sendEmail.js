const nodemailer = require("nodemailer");
const { EMAIL, PASS } = process.env;

async function sendEmail(bodyWithFiles) {
  const { name, email, phone, company, message, multiple_files } =
    bodyWithFiles;

  console.log(bodyWithFiles);

  const html = `
<h1>NEW CUSTOMER REQUEST</h1>
<p><strong>Customer name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Company:</strong> ${company ? company : "-"}</p>
<p><strong>Message:</strong> ${message ? message : "-"}</p>
<p><strong>Attached files:</strong></p>
<ul>
  ${
    multiple_files
      ? multiple_files.map((file) => `<li>${file}</li>`).join("\n")
      : "<li>-</li>"
  }
</ul>
`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASS,
    },
  });

  const info = await transporter.sendMail({
    from: EMAIL,
    to: EMAIL,
    subject: "New customer request",
    html: html,
  });

  console.log("Message sent: " + info.messageId);
}

module.exports = sendEmail;
