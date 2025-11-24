import { createTransport } from "nodemailer";

const SendMail = async (email, subject, htmlBody) => {
    const transport = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL,
            pass: process.env.PASSWORD,
        },
    });

    await transport.sendMail({
        from: process.env.GMAIL,
        to: email,
        subject,
        html: htmlBody,
    }).catch(err => console.log("MAIL ERROR:", err));
};

export default SendMail;
