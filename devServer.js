// @ts-ignore
const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const hostname = "localhost";
const port = 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev: true, hostname, port, });
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync("./cert.key"),
    cert: fs.readFileSync("./cert.pem"),
};

app.prepare().then(() => {
    createServer(httpsOptions, async (req, res) => {
        try {
            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.
            const parsedUrl = parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error("Error occurred handling", req.url, err);
            res.statusCode = 500;
            res.end("internal server error");
        }
    })
        .once("error", err => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on https://${hostname}:${port}`);
        });
});
