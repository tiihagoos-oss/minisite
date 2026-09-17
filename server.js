const express = require("express");
const path = require("path");

const { GROQ_API_KEY } = require("./config");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/*
==========================================================
  ARQUIVOS DO SITE
==========================================================
*/

app.use(express.static(path.join(__dirname, "public")));


/*
==========================================================
  CHAT GROQ
==========================================================
*/

app.post("/api/chat", async (req, res) => {

    try {

        const { question, messages } = req.body;

        if (!question && !messages) {
            return res.status(400).json({
                error: "Mensagem não informada."
            });
        }

        const mensagens = messages || [
            {
                role: "user",
                content: question
            }
        ];

        const resposta = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    model: "openai/gpt-oss-20b",

                    messages: mensagens,

                    temperature: 0.7
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {

            console.error("Erro da Groq:", dados);

            return res.status(resposta.status).json({
                error: "Erro ao consultar a Groq."
            });
        }

        const texto =
            dados.choices?.[0]?.message?.content || "";

        res.json({
            response: texto
        });

    } catch (erro) {

        console.error("Erro no servidor:", erro);

        res.status(500).json({
            error: "Erro interno do servidor."
        });
    }

});


/*
==========================================================
  INICIAR SERVIDOR
==========================================================
*/

app.listen(PORT, () => {

    console.log(
        `Servidor Tiago Digital rodando em http://localhost:${PORT}`
    );

});
