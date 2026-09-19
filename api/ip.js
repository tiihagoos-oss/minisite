export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            erro: "Método não permitido"
        });
    }

    try {

        const {
            ip,
            pagina,
            navegador
        } = req.body;

        if (!ip) {
            return res.status(400).json({
                erro: "IP não informado"
            });
        }

        const data = new Date().toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo"
        });

        const email = `
Novo acesso ao Tiago Digital

IP: ${ip}

Data e hora: ${data}

Página:
${pagina || "Não informado"}

Navegador:
${navegador || "Não informado"}
`;

        const resposta = await fetch("https://api.resend.com/emails", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.RESEND_API_KEY}`
            },

            body: JSON.stringify({
                from: "onboarding@resend.dev",
                to: ["SEU_EMAIL@gmail.com"],
                subject: "Novo acesso ao Tiago Digital",
                text: email
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            console.error(resultado);

            return res.status(500).json({
                erro: "Erro ao enviar e-mail"
            });
        }

        return res.status(200).json({
            sucesso: true
        });

    } catch (erro) {

        console.error(erro);

        return res.status(500).json({
            erro: "Erro interno"
        });
    }
}
