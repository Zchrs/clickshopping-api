export function detectOS(userAgent = "") {
  const ua = userAgent.toLowerCase();

  // 🪟 Windows (10 y 11 comparten NT 10.0)
  if (ua.includes("windows nt 10.0")) {
    return "Windows 10 / 11";
  }

  if (ua.includes("windows nt 6.3")) return "Windows 8.1";
  if (ua.includes("windows nt 6.2")) return "Windows 8";
  if (ua.includes("windows nt 6.1")) return "Windows 7";

  // 🍎 macOS
  if (ua.includes("mac os x")) return "macOS";

  // 🤖 Android
  if (ua.includes("android")) return "Android";

  // 🍎 iOS
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";

  // 🐧 Linux
  if (ua.includes("linux")) return "Linux";

  return "Unknown OS";
}