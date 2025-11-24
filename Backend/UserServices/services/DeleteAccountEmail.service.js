import SendMail from "../middleware/SendMail.js";
import { getDeviceAndLocation } from "../utils/FetchDevice&Location.js";

export const SendDeleteAccountEmail = async (req, user) => {
    const { ip, device, location } = await getDeviceAndLocation(req);

    const subject = "Account Deleted Alert";
    const html = `
        <p>Hi ${user.name},</p>
        <p>Your account has been deleted.</p>
        <p>Account details:</p>
        <ul>
            <li>Email: ${user.email}</li>
            <li><b>Device:</b> ${device}</li>
            <li><b>Location:</b> ${location}</li>
            <li><b>IP Address:</b> ${ip}</li>
        </ul>
        <p>Thank you for using our service.</p>
    `;

    try {
        await SendMail(user.email, subject, html);
    } catch (err) {
        console.error("Email send error:", err?.message || err);
    }
};

