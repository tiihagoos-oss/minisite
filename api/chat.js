export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Método não permitido"
        });
    }

    try {

        const apiKey = process.env.GROQ_API_KEY;

        console.log("GROQ_API_KEY existe:", !!apiKey);
        console.log("Tamanho da chave:", apiKey ? apiKey.length : 0);
        console.log(
            "Começa com gsk_:",
            apiKey ? apiKey.startsWith("gsk_") : false
        );

        if (!apiKey) {
            return res.status(500).json({
                error: "GROQ_API_KEY não está configurada na Vercel"
            });
        }

        const {
            model,
            messages,
            temperature,
            max_completion_tokens
        } = req.body;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },

                body: JSON.stringify({
                    model,
                    messages,
                    temperature,
                    max_completion_tokens
                })
            }
        );

        const data = await response.json();

        console.log("Status Groq:", response.status);

        if (!response.ok) {
            console.log("Erro Groq:", data);

            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {

        console.error("Erro backend:", error);

        return res.status(500).json({
            error: error.message
        });
    }
}



/*
export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({
            error: "Método não permitido"
        });

    }

    try {

        const {
            model,
            messages,
            temperature,
            max_completion_tokens
        } = req.body;


        const response =
            await fetch(
                "https://api.groq.com/openai/v1/chat/completions",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${process.env.GROQ_API_KEY}`

                    },

                    body: JSON.stringify({

                        model,

                        messages,

                        temperature,

                        max_completion_tokens

                    })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            return res.status(
                response.status
            ).json(data);

        }


        return res.status(200).json(data);


    } catch (error) {

        console.error(
            "Erro no backend:",
            error
        );


        return res.status(500).json({

            error:
                "Erro ao consultar a Groq"

        });

    }

}
*/
