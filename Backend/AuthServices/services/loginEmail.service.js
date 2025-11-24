import SendMail from "../middleware/email/SendMail.js";
import { getDeviceAndLocation } from "../utils/FetchDevice&Location.js";

export const SendLoginEmail = async (req, user) => {
    const { ip, device, location } = await getDeviceAndLocation(req);

    const subject = "New Login Alert";
    const html = `
        <p>Hi ${user.name},</p>
        <p>You successfully logged in.</p>
        <p>Login details:</p>
        <ul>
            <li>Email: ${user.email}</li>
            <li><b>Device:</b> ${device}</li>
            <li><b>Location:</b> ${location}</li>
            <li><b>IP Address:</b> ${ip}</li>
        </ul>
        <p>If this wasn't you, please secure your account.</p>
    `;

    try {
        await SendMail(user.email, subject, html);
    } catch (err) {
        console.error("Email send error:", err?.message || err);
    }
};

