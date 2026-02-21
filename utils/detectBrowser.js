export function detectBrowser(userAgent = "") {
  if (userAgent.includes("Edg")) return "Edge";
  if (userAgent.includes("OPR") || userAgent.includes("Opera")) return "Opera";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";
  return "Unknown";
}



