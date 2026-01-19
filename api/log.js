export default function handler(req, res) {
  const country =
    req.headers["x-vercel-ip-country"] || "Desconhecido";

  console.log("ACESSO | País:", country);

  res.status(200).end();
}
