// made in like 2.5 hours
const fs = require("fs");
const searcher = require("./search.js");

console.log("Starting...");

(async () => {
    await searcher.setup();

    console.log("Started");

    let server = require("http").createServer((req, res) => {
        if (req.method !== "GET") {
            res.statusCode = 400;
            res.write("no");
            res.end();
            return;
        }

        let url = new URL(req.url, `http://${req.headers.host}`);
        
        if (url.pathname == "/search") {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.write(JSON.stringify(searcher.search(url.searchParams.get("q"))));
            res.end();
        }
        else {
            res.statusCode = 404;
            res.write("404");
            res.end();
        }
    });
    server.listen(8080);
    console.log(`Server started`);
    console.log(`file:///${__dirname.replace(/\\/g, '/')}/index.html`)
})();