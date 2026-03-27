import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const country = req.headers["x-vercel-ip-country"] || "Unknown";
  const city = req.headers["x-vercel-ip-city"] || "Unknown";
  const region = req.headers["x-vercel-ip-country-region"] || "Unknown";
  const ip = req.headers["x-forwarded-for"] || "Unknown";

  const mensagem = `
=== NOVO ACESSO ===
IP: ${ip}
País: ${country}
Região: ${region}
Cidade: ${city}
  `;

  console.log(mensagem);

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "tiiagoos@hotmail.com",
      subject: "Nova visita no minisite",
      text: mensagem,
    });

    res.status(200).json({ status: "email enviado" });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    res.status(500).json({ error: "erro ao enviar email" });
  }
}
