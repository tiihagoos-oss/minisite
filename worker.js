export default {
  async fetch(request, env, ctx) {
    const country = request.headers.get("cf-ipcountry") || "Desconhecido";

    return new Response(
      `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Obrigado pela visita</title>
        </head>
        <body style="font-family: Arial; text-align:center; margin-top:40px;">
          <h2>Link acessado com sucesso</h2>
          <p>País detectado:</p>
          <h1>${country}</h1>
        </body>
      </html>
      `,
      {
        headers: {
          "content-type": "text/html;charset=UTF-8",
        },
      }
    );
  },
};
