const fse = require("fs-extra");
const path = require("path");
const { promisify } = require("util");

const htmlMinifier = require("html-minifier");
const marked = require("marked");
const sass = require("node-sass");
const sassRender = promisify(sass.render);

const INPUT_MD = process.argv[2] || "resume.md";
const OUTPUT_DIR = process.argv[3] || "./";

// we want to use async/await syntax, so invoke this function immediately
(async function main() {
    const md = await fse.readFile(INPUT_MD);

    const levels = [];
    const ids = {};
    const mdToHtml = marked(md.toString());
    const html = mdToHtml
    // First, wrap all sections, and their contents, into sections and divs for easier styling
    .replace(/(<hr>\n)?<h([2-6]).*?>/g, (s) => {
        const hr = s.startsWith("<hr>") ? "<hr>" : "";
        const header = s.replace("<hr>", ""); // remove the hr, so we have only the header
        const level = Number(header[header.indexOf("<h") + 2]);
        const last = levels[levels.length - 1];
        const section = `${hr}<section class="for-h${level}">${header}`;

        if (!last || level > last) {
            levels.push(level);
            return section ;
        }
        else { // level < last, so we are going out of the current level
            const diff = (last - level);
            levels.length = Math.max(0, levels.length - diff);

            const end = "</div></section>".repeat(diff + 1);
            return end + section;
        }
    })
    // Add the div for the contents as mentioned above
    .replace(/<\/h([2-6])>/g, (s) => `${s}<div class="h${s[3]}-content">`)
    // Next, make sure there are no duplicate ids, and if there are add anumber on the end of subsequent ids
    .replace(/id=\"([^"]*)\"/g, (s) => {
        const id = s.slice(4, s.length - 1);
        const n = (ids[id] || 0) + 1;
        ids[id] = n;

        return `id=${n > 1
            ? `${id}-${n}`
            : id
        }`;
    })
    // Finally close all elements we added in to "finish" the html
    +  "</div></section>".repeat(levels.length) + "\n";

    const { css } = await sassRender({ file: path.join(__dirname, "style.scss") });

    // We don't care about the extra indentation space in this string literal,
    // as it will be minified out regardless.
    const fullFile = `
        <!doctype html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Jacob Fischer's Resume</title>
            <link rel="shortcut icon" type="image/x-icon" href="favicon.ico" />
            <link rel="icon" type="image/x-icon" href="favicon.ico" />
            <meta name="theme-color" content="#47CD32" />
            <style>${css}</style>
        </head>
        <body>
            <div id="main">
                <div id="resume">${html}</div>
                <div id="downloads">
                    <a download title="Download Jacob Fischer's resume in PDF format" href="./Resume-Jacob-Fischer.pdf">&#11123; Download as PDF</a>
                    <a download title="Download Jacob Fischer's resume in Markdown (text) format" href="./Resume-Jacob-Fischer.md">&#11123; Download as Markdown (Text)</a>
                </div>
            </div>
            <footer id="page-footer">
                <p>This site was made with love and care automatically from a <a href="./Resume-Jacob-Fischer.pdf">Markdown source</a>, and is hosted graciously via <a href="https://pages.github.com/">GitHub pages</a>. For more information please check out my <a href="https://github.com/JacobFischer/resume">repo on GitHub</a>.</p>
            </footer>
        </body>
        </html>
    `;

    const minFile = htmlMinifier.minify(fullFile, {
        removeComments: true,
        minifyCSS: true,
        collapseWhitespace: true,
    })

    const stream = fse.createWriteStream(path.join(OUTPUT_DIR, "index.html"));
    await stream.write(minFile);
    stream.end();

    await fse.copyFile(
        path.join(__dirname, "favicon.ico"),
        path.join(OUTPUT_DIR, "favicon.ico"),
    );
})().catch((err) => {
    console.error("Error generating html for resume!");
    console.error(err);

    process.exit(1);
});
