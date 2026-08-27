const GA_SNIPPET = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-JQFKN41R88"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-JQFKN41R88');
</script>`;

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("text/html")) return response;

    return new HTMLRewriter()
      .on("head", {
        element(el) {
          el.append(GA_SNIPPET, { html: true });
        },
      })
      .transform(response);
  },
};
