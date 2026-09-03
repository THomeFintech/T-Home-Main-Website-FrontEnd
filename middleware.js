import { isValidRoute } from "./routes.config.js";

const STATIC_FILE_PATTERN = /\.[a-zA-Z0-9]+$/;

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>404 - Page Not Found | T-Home</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, -apple-system, sans-serif;
      background: linear-gradient(180deg, #071327 0%, #08162b 100%);
      color: #fff;
    }
    .container { text-align: center; padding: 2rem; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    p { color: #94a3b8; margin-bottom: 1.5rem; }
    a { color: #5a8cff; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/">Return to homepage</a>
  </div>
</body>
</html>`;

export default function middleware(request) {
  const { pathname } = new URL(request.url);

  if (
    STATIC_FILE_PATTERN.test(pathname) ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/home/")
  ) {
    return;
  }

  if (!isValidRoute(pathname)) {
    return new Response(NOT_FOUND_HTML, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }
}

export const config = {
  matcher: ["/((?!assets|home).*)"],
};
