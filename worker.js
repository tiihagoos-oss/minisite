export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname === "/log") {
      const country = request.cf?.country || "desconhecido"
      return new Response(`Acesso do país: ${country}`)
    }

    return new Response("MiniSite ativo", {
      headers: { "Content-Type": "text/plain" }
    })
  }
}
