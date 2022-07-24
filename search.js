const fs = require("fs");
const distance = require("./algorithm.js");

const startPath = require("./path.json");

const files = [];

const setup = async () => {
    const fileSearch = (dir) => {
        let contents = fs.readdirSync(dir, { withFileTypes: true });
        contents.forEach(d => {
            let path = dir + "/" + d.name;
            if (d.isFile()) {

                if (d.name.endsWith(".html")) {
                    let content = fs.readFileSync(path, "utf8");

                    let title = /(?<=<title>)(.|\n)+(?=<\/title>)/.exec(content.toLowerCase());
                    let workingTitle;

                    if (title) {
                        query = title[0] + " " + path.slice(startPath.length+1);
                        workingTitle = title[0];
                    }
                    else {
                        query = path.slice(startPath.length+1);
                        workingTitle = d.name;
                    }
                
                    files.push({path: path, query: query, title: workingTitle});
                }

            }
            else if (d.isDirectory()) {
                fileSearch(path);
            }
        });
    }

    fileSearch(startPath);
}

const search = (query) => {
    query = query.toLowerCase();

    let results = [];
    let queryWords = query.split(" ");

    files.forEach(file => {
        let contains = false;
        queryWords.forEach(s => {
            if (file.query.includes(s)) contains = true;
        });

        if (contains) {
            results.push(file);
        }
    });

    results.sort((a, b) => distance(a.query, query) - distance(b.query, query));

    return results.slice(0, 10);
}

module.exports = {setup: setup, search: search};