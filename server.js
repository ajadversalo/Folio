const http = require("node:http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 4173);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  http.createServer((request, response) => handle(request, response)).listen(port, hostname, () => {
    console.log(`Folio is ready at http://${hostname}:${port}`);
  });
}).catch(error => {
  console.error("Unable to start Folio:", error);
  process.exit(1);
});
