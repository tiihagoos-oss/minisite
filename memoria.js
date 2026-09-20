/* ==========================================================
   MEMÓRIA DA CONVERSA
========================================================== */

const MEMORIA_MENSAGENS_RECENTES = 6;

const MEMORIA_LIMITE_MENSAGENS = 12;


/* ==========================================================
   ESTADO INTERNO
========================================================== */

const memoriaEstado = {

    resumo: "",

    mensagens: []

};


/* ==========================================================
   ADICIONAR MENSAGEM
========================================================== */

function adicionarMensagem(role, content) {

    if (!content) {
        return;
    }

    memoriaEstado.mensagens.push({

        role: role,

        content: content

    });

    console.log(
        "MEMÓRIA: mensagem adicionada",
        role,
        content
    );

}


/* ==========================================================
   OBTER MENSAGENS
========================================================== */

function obterMensagens() {

    return [
        ...memoriaEstado.mensagens
    ];

}


/* ==========================================================
   OBTER RESUMO
========================================================== */

function obterResumo() {

    return memoriaEstado.resumo;

}


/* ==========================================================
   VERIFICAR SE PRECISA RESUMIR
========================================================== */

function precisaResumir() {

    return (
        memoriaEstado.mensagens.length >
        MEMORIA_LIMITE_MENSAGENS
    );

}


/* ==========================================================
   CRIAR HISTÓRICO
========================================================== */

function criarHistorico(mensagens) {

    return mensagens

        .map(message => {

            const nome =
                message.role === "user"
                    ? "USUÁRIO"
                    : "TIAGO";

            return (
                `${nome}: ${message.content}`
            );

        })

        .join("\n\n");

}


/* ==========================================================
   GERAR RESUMO
========================================================== */
/*
async function gerarResumo(
    groqApiKey,
    model = "openai/gpt-oss-20b"
) {

    if (!groqApiKey) {

        throw new Error(
            "A chave da Groq não foi informada."
        );

    }
*/


async function gerarResumo(
    model = "openai/gpt-oss-20b"
) {

    /*
        Pega somente as mensagens antigas.

        As 6 mensagens mais recentes permanecem
        fora do resumo e continuam sendo enviadas
        normalmente como contexto recente.
    */

    const mensagensAntigas =
        memoriaEstado.mensagens.slice(
            0,
            -MEMORIA_MENSAGENS_RECENTES
        );


    if (
        mensagensAntigas.length === 0
    ) {

        return memoriaEstado.resumo;

    }


    const historico =
        criarHistorico(
            mensagensAntigas
        );


    const prompt = `

Você é responsável por criar a memória resumida
de uma conversa.

Crie um resumo curto e útil para que outro modelo
consiga continuar a conversa sem receber todas
as mensagens antigas.

PRESERVE:

assuntos discutidos;
informações importantes fornecidas pelo usuário;
decisões tomadas;
projetos mencionados;
problemas que o usuário está tentando resolver;
objetivos;
preferências relevantes;
informações necessárias para entender referências futuras.

NÃO INVENTE informações.

RESUMO ANTERIOR:

${memoriaEstado.resumo || "(nenhum)"}

MENSAGENS ANTIGAS:

${historico}

Retorne somente o resumo atualizado.
`;


    console.log(
        "MEMÓRIA: gerando resumo..."
    );


    const response =
        await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${groqApiKey}`

                },

                body: JSON.stringify({

                    model: model,

                    messages: [

                        {
                            role: "system",

                            content:
                                "Você cria resumos de memória de conversas."
                        },

                        {
                            role: "user",

                            content: prompt
                        }

                    ],

                    temperature: 0.2,

                    max_completion_tokens: 600

                })

            }
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.error?.message ||
            "Erro ao gerar resumo."
        );

    }


    const resumo =
        data.choices?.[0]?.message?.content;


    if (!resumo) {

        throw new Error(
            "A API não retornou um resumo."
        );

    }


    memoriaEstado.resumo =
        resumo.trim();


    /*
        Mantém somente as mensagens recentes.

        As mensagens antigas já foram incorporadas
        ao resumo.
    */

    memoriaEstado.mensagens =
        memoriaEstado.mensagens.slice(
            -MEMORIA_MENSAGENS_RECENTES
        );


    console.log(
        "================================="
    );

    console.log(
        "MEMÓRIA ATUALIZADA:"
    );

    console.log(
        memoriaEstado.resumo
    );

    console.log(
        "================================="
    );


    return memoriaEstado.resumo;

}


/* ==========================================================
   OBTER CONTEXTO COMPLETO
========================================================== */

function obterContexto() {

    let contexto = "";


    /*
        Resumo antigo
    */

    if (
        memoriaEstado.resumo
    ) {

        contexto +=
            "RESUMO DA CONVERSA:\n\n";

        contexto +=
            memoriaEstado.resumo;

        contexto +=
            "\n\n";

    }


    /*
        Mensagens recentes
    */

    if (
        memoriaEstado.mensagens.length > 0
    ) {

        contexto +=
            "MENSAGENS RECENTES:\n\n";


        for (
            const message
            of memoriaEstado.mensagens
        ) {

            const nome =
                message.role === "user"
                    ? "USUÁRIO"
                    : "TIAGO";


            contexto +=
                `${nome}: ${message.content}\n\n`;

        }

    }


    return contexto.trim();

}


/* ==========================================================
   LIMPAR
========================================================== */

function limpar() {

    memoriaEstado.resumo =
        "";

    memoriaEstado.mensagens =
        [];

}


/* ==========================================================
   DEBUG
========================================================== */

function debug() {

    console.log(
        "================================="
    );

    console.log(
        "RESUMO:"
    );

    console.log(
        memoriaEstado.resumo ||
        "(nenhum)"
    );

    console.log(
        "MENSAGENS:"
    );

    console.log(
        memoriaEstado.mensagens
    );

    console.log(
        "CONTEXTO:"
    );

    console.log(
        obterContexto()
    );

    console.log(
        "================================="
    );

}


/* ==========================================================
   OBJETO PÚBLICO
========================================================== */

window.memoriaConversa = {

    adicionarMensagem,

    obterMensagens,

    obterResumo,

    precisaResumir,

    gerarResumo,

    obterContexto,

    limpar,

    debug

};
