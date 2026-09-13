/* ==========================================================
   PERSONAGEM DIGITAL
   ========================================================== */

/*
 * Este arquivo é responsável por:
 *
 * 1. Carregar o personagem.json
 * 2. Armazenar os dados na variável "personagem"
 * 3. Transformar os dados do JSON em texto
 *    para serem utilizados no prompt da IA
 */


/* ==========================================================
   VARIÁVEL DO PERSONAGEM
   ========================================================== */

let personagem = {};


/* ==========================================================
   CARREGAR PERSONAGEM
   ========================================================== */

async function carregarPersonagem() {
    try {
        const response = await fetch("./personagem.json");

        if (!response.ok) {
            throw new Error(
                `Não foi possível carregar personagem.json. Status: ${response.status}`
            );
        }

        personagem = await response.json();

        console.log("PERSONAGEM CARREGADO:", personagem);

        if (typeof status !== "undefined" && status) {
            status.textContent = "Personagem carregado";
        }

        return personagem;

    } catch (error) {

        console.error("ERRO AO CARREGAR PERSONAGEM:", error);

        if (typeof status !== "undefined" && status) {
            status.textContent = "Erro ao carregar personagem";
        }

        throw error;
    }
}


/* ==========================================================
   TRANSFORMAR PERSONAGEM EM TEXTO
   ========================================================== */

function montarPromptPersonagem() {

    if (!personagem || Object.keys(personagem).length === 0) {
        console.warn("O personagem ainda não foi carregado.");
        return "";
    }

    let prompt = "";

    for (const [categoria, conteudo] of Object.entries(personagem)) {

        prompt += `

### ${categoria}

${conteudo}`;
    }

    return prompt.trim();
}


/* ==========================================================
   OBTER UMA CATEGORIA ESPECÍFICA
   ========================================================== */

function obterInformacaoPersonagem(categoria) {

    if (!personagem || Object.keys(personagem).length === 0) {
        console.warn("O personagem ainda não foi carregado.");
        return "";
    }

    return personagem[categoria] || "";
}


/* ==========================================================
   VERIFICAR SE O PERSONAGEM FOI CARREGADO
   ========================================================== */

function personagemCarregado() {

    return (
        personagem &&
        Object.keys(personagem).length > 0
    );
}
