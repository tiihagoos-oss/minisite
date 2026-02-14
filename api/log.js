export default function handler(req, res) {
  const country = req.headers["x-vercel-ip-country"] || "Unknown";
  const city = req.headers["x-vercel-ip-city"] || "Unknown";
  const region = req.headers["x-vercel-ip-country-region"] || "Unknown";
  const ip = req.headers["x-forwarded-for"] || "Unknown";

  console.log("=== NOVO ACESSO ===");
  console.log("IP:", ip);
  console.log("País:", country);
  console.log("Região:", region);
  console.log("Cidade:", city);
  console.log("===================");

  res.status(200).json({ status: "logged" });
}
