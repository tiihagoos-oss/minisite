
export default function handler(req, res) {
  const country =
    req.headers["x-vercel-ip-country"] || "Desconhecido";

  res.status(200).json({ country });
}
