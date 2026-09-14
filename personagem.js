/* ==========================================================
   PERSONAGEM DIGITAL
========================================================== */

let personagem = {};


/* ==========================================================
   CARREGAR PERSONAGEM
========================================================== */

async function carregarPersonagem() {

    try {

        const response =
            await fetch("./personagem.json");

        if (!response.ok) {

            throw new Error(
                `Não foi possível carregar personagem.json. Status: ${response.status}`
            );

        }

        personagem =
            await response.json();

        console.log(
            "PERSONAGEM CARREGADO:",
            personagem
        );

        if (
            typeof status !== "undefined" &&
            status
        ) {

            status.textContent =
                "Personagem carregado";

        }

        return personagem;

    } catch (error) {

        console.error(
            "ERRO AO CARREGAR PERSONAGEM:",
            error
        );

        if (
            typeof status !== "undefined" &&
            status
        ) {

            status.textContent =
                "Erro ao carregar personagem";

        }

        throw error;

    }

}


/* ==========================================================
   TRANSFORMAR PERSONAGEM EM TEXTO
========================================================== */

function montarPromptPersonagem() {

    if (
        !personagem ||
        Object.keys(personagem).length === 0
    ) {

        console.warn(
            "O personagem ainda não foi carregado."
        );

        return "";

    }

    let prompt = "";

    for (
        const [categoria, conteudo]
        of Object.entries(personagem)
    ) {

        prompt += `

### ${categoria}

${conteudo}`;

    }

    return prompt.trim();

}


/* ==========================================================
   OBTER CATEGORIA
========================================================== */

function obterInformacaoPersonagem(categoria) {

    if (
        !personagem ||
        Object.keys(personagem).length === 0
    ) {

        return "";

    }

    return personagem[categoria] || "";

}


/* ==========================================================
   VERIFICAR SE CARREGOU
========================================================== */

function personagemCarregado() {

    return (
        personagem &&
        Object.keys(personagem).length > 0
    );

}


/* ==========================================================
   INICIAR
========================================================== 

carregarPersonagem();
 */










