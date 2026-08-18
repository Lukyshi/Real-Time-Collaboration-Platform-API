import nodemailer from 'nodemailer';


// communicate with a mail server
export const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number (process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === "465",
  auth : {
    user : process.env.SMTP_USER,
    pass : process.env.SMTP_PASS
  },
});

transport.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP ERROR:", error);
  } else {
    console.log("✅ SMTP SERVER READY");
  }
});

// after creating trasport, create a send email 
// and put it in queue and works
// after that put that functions in service 

export const sendInvitationEmail = async ({to, token, workspaceName}) => {

  const acceptInvitation = `${process.env.APP_URL}/api/v1/invitations?token=${encodeURIComponent(token)}`;

  const info = await transport.sendMail({
    from: process.env.EMAIL_FROM || '"Your app" <no-reply@yourapp.com>',
    to,
    subject: `You've been invited to join ${workspaceName}`,
    html: `
    <p>You've been invited to join <strong>${workspaceName}</strong>.</p>
    <p><a href="${acceptInvitation}"> Accept Invitations></a></p>
    <p>This invitation expires in 24 hours.</p>
    `,
  });

  return info;

};