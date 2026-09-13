/* ==========================================================
MEMÓRIA DA CONVERSA
Este arquivo controla somente a memória da conversa atual.

Ele NÃO controla:

personagem.json
personalidade
interface
mensagens visuais do chat
Ele controla:

histórico da conversa
resumo da conversa
mensagens recentes
quando criar um resumo
========================================================== */
/* ==========================================================
CONFIGURAÇÕES
========================================================== */

/*
Quantas mensagens recentes queremos manter completas
depois que um resumo for criado.

6 mensagens = aproximadamente 3 perguntas + 3 respostas.
*/

const MEMORIA_MENSAGENS_RECENTES = 6;

/*
Quando o histórico passar dessa quantidade,
o sistema cria um resumo.

Estamos usando mensagens apenas para o primeiro teste.

Depois podemos trocar isso por limite de tokens.
*/

const MEMORIA_LIMITE_MENSAGENS = 8;

/* ==========================================================
ESTADO DA CONVERSA
========================================================== */

const memoriaConversa = {

/*
   Resumo das partes antigas da conversa.
*/

resumo: "",


/*
   Mensagens que ainda estão sendo mantidas
   integralmente.
*/

mensagens: []

};

/* ==========================================================
ADICIONAR MENSAGEM
========================================================== */

function memoriaAdicionarMensagem(
role,
content
) {

if (!content) {
    return;
}


memoriaConversa.mensagens.push({

    role: role,

    content: content

});


console.log(
    "Memória: mensagem adicionada",
    role,
    content
);

}

/* ==========================================================
PEGAR MENSAGENS
========================================================== */

function memoriaObterMensagens() {

return [
    ...memoriaConversa.mensagens
];

}

/* ==========================================================
PEGAR RESUMO
========================================================== */

function memoriaObterResumo() {

return memoriaConversa.resumo;

}

/* ==========================================================
VERIFICAR SE PRECISA RESUMIR
========================================================== */

function memoriaPrecisaResumir() {

return (
    memoriaConversa.mensagens.length >
    MEMORIA_LIMITE_MENSAGENS
);

}

/* ==========================================================
CRIAR TEXTO DO HISTÓRICO
========================================================== */

function memoriaCriarHistorico() {

return memoriaConversa.mensagens

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

async function memoriaGerarResumo(
groqApiKey,
model = "openai/gpt-oss-20b"
) {

if (!groqApiKey) {

    throw new Error(
        "A chave da Groq não foi informada."
    );

}


/*
   Pega as mensagens atuais.
*/

const historico =
    memoriaCriarHistorico();


/*
   Prompt responsável pela criação da memória.
*/

const prompt = `

Você é responsável por manter a memória resumida
de uma conversa.

Crie um resumo curto e útil para que outro modelo
consiga continuar essa conversa sem precisar receber
todas as mensagens antigas.

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

Se existir um resumo anterior, mantenha as informações
importantes dele e acrescente as informações relevantes
das novas mensagens.

RESUMO ANTERIOR:

${memoriaConversa.resumo || "(nenhum)"}

MENSAGENS DA CONVERSA:

${historico}

Retorne somente o novo resumo.
`;

console.log(
    "Memória: gerando resumo..."
);


/*
   Chamada para a Groq.
*/

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
                            "Você cria memórias resumidas de conversas."
                    },

                    {
                        role: "user",

                        content: prompt
                    }

                ],

                temperature: 0.2

            })

        }
    );


const data =
    await response.json();


/*
   Verifica erro da API.
*/

if (!response.ok) {

    throw new Error(
        data.error?.message ||
        "Erro ao gerar resumo da conversa."
    );

}


/*
   Pega o resumo retornado.
*/

const resumo =
    data.choices?.[0]?.message?.content;


if (!resumo) {

    throw new Error(
        "A API não retornou um resumo."
    );

}


/*
   Salva o novo resumo.
*/

memoriaConversa.resumo =
    resumo.trim();


/*
   Depois que o resumo foi criado,
   não precisamos mais manter todas as mensagens.

   Mantemos somente as mais recentes.
*/

memoriaConversa.mensagens =
    memoriaConversa.mensagens.slice(
        -MEMORIA_MENSAGENS_RECENTES
    );


console.log(
    "================================="
);

console.log(
    "MEMÓRIA ATUALIZADA"
);

console.log(
    memoriaConversa.resumo
);

console.log(
    "================================="
);


return memoriaConversa.resumo;

}

/* ==========================================================
OBTER CONTEXTO COMPLETO
========================================================== */

function memoriaObterContexto() {

let contexto = "";


/*
   Primeiro colocamos o resumo.
*/

if (
    memoriaConversa.resumo
) {

    contexto +=
        `RESUMO DA CONVERSA:\n\n`;


    contexto +=
        memoriaConversa.resumo;


    contexto +=
        "\n\n";

}


/*
   Depois colocamos as mensagens recentes.
*/

if (
    memoriaConversa.mensagens.length > 0
) {

    contexto +=
        "MENSAGENS RECENTES:\n\n";


    for (
        const message
        of memoriaConversa.mensagens
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
LIMPAR MEMÓRIA
========================================================== */

function memoriaLimpar() {

memoriaConversa.resumo =
    "";


memoriaConversa.mensagens =
    [];


console.log(
    "Memória da conversa apagada."
);

}

/* ==========================================================
MOSTRAR MEMÓRIA NO CONSOLE
========================================================== */

function memoriaDebug() {

console.log(
    "================================="
);

console.log(
    "RESUMO:"
);

console.log(
    memoriaConversa.resumo ||
    "(nenhum)"
);


console.log(
    "MENSAGENS:"
);

console.log(
    memoriaConversa.mensagens
);


console.log(
    "CONTEXTO COMPLETO:"
);

console.log(
    memoriaObterContexto()
);


console.log(
    "================================="
);

}

/* ==========================================================
DISPONIBILIZAR FUNÇÕES
========================================================== */

window.memoriaConversa = {

adicionarMensagem:
    memoriaAdicionarMensagem,

obterMensagens:
    memoriaObterMensagens,

obterResumo:
    memoriaObterResumo,

precisaResumir:
    memoriaPrecisaResumir,

gerarResumo:
    memoriaGerarResumo,

obterContexto:
    memoriaObterContexto,

limpar:
    memoriaLimpar,

debug:
    memoriaDebug

};
