import fetch from "node-fetch";

export const getDeviceAndLocation = async (req) => {
    let ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress;
    if (ip === "::1" || ip === "127.0.0.1") ip = "Localhost";

    const ua = req.headers["user-agent"] || "";
    const browser = ua.includes("Chrome") ? "Chrome" :
        ua.includes("Firefox") ? "Firefox" :
            ua.includes("Safari") ? "Safari" : "Unknown";
    const os = ua.includes("Windows") ? "Windows" :
        ua.includes("Android") ? "Android" :
            ua.includes("Mac") ? "MacOS" : "Unknown";
    const device = `${browser} on ${os}`;

    let location = "Unknown, Unknown";
    if (ip !== "Localhost") {
        try {
            const geo = await fetch(`https://ipapi.co/${ip}/json/`).then(res => res.json());
            location = `${geo.city || "Unknown"}, ${geo.country_name || "Unknown"}`;
        } catch (err) {
            // ignore errors
        }
    }

    return { ip, device, location };
};
