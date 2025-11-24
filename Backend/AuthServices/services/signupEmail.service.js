import SendMail from "../middleware/email/SendMail.js";
import { getDeviceAndLocation } from "../utils/FetchDevice&Location.js";

export const SendSignupEmail = async (req, savedUser) => {
    const { ip, device, location } = await getDeviceAndLocation(req);

    const subject = "Welcome — Account Created";
    const html = `
        <p>Hi ${savedUser.name},</p>
        <p>Your account has been created successfully.</p>
        <p>Signup details:</p>
        <ul>
            <li>Email: ${savedUser.email}</li>
            <li><b>Device:</b> ${device}</li>
            <li><b>Location:</b> ${location}</li>
            <li><b>IP Address:</b> ${ip}</li>
        </ul>
        <p>If this wasn't you, please secure your account.</p>
    `;

    try {
        await SendMail(savedUser.email, subject, html);
    } catch (err) {
        console.error("Email send error:", err?.message || err);
    }
};
