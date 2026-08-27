// deploy marker: force fresh build
const GA_SNIPPET = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-JQFKN41R88"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-JQFKN41R88');
</script>`;

const CANONICAL_HOST = "11brands.com";

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), camera=(), microphone=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src https://fonts.gstatic.com",
    "img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com",
    "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; "),
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname !== CANONICAL_HOST) {
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    const response = await env.ASSETS.fetch(request);
    const contentType = response.headers.get("content-type") || "";

    const withTag = contentType.startsWith("text/html")
      ? new HTMLRewriter()
          .on("head", {
            element(el) {
              el.append(GA_SNIPPET, { html: true });
            },
          })
          .transform(response)
      : response;

    const headers = new Headers(withTag.headers);
    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }

    return new Response(withTag.body, { status: withTag.status, headers });
  },
};
