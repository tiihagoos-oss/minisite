export default function handler(req, res) {
  const country = req.headers["x-vercel-ip-country"] || "Unknown";
  const city = req.headers["x-vercel-ip-city"] || "Unknown";
  const region = req.headers["x-vercel-ip-country-region"] || "Unknown";

  console.log("Country:", country);
  console.log("Region:", region);
  console.log("City:", city);

  res.status(200).json({
    country,
    region,
    city
  });
}
