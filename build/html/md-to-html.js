const fse = require("fs-extra");
const { breakHeaderEms, cleanIds, sectionize } = require("flat-html-helpers");
const { join } = require("path");
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
    const mdToHtml = marked(md.toString());

    // pipeline |> operator would be nice here
    const andCleanedIds = cleanIds(mdToHtml);
    const andBreakHeaders = breakHeaderEms(andCleanedIds, { level: 3 });
    const andSectionized = sectionize(andBreakHeaders, { levels: [2, 3, 4, 5, 6], pushDownHrs: true });
    const html = andSectionized;

    const { css } = await sassRender({ file: join(__dirname, "style.scss") });

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
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="theme-color" content="#47CD32" />
            <style>${css}</style>
        </head>
        <body>
            <div id="main">
                <div id="resume">${html}</div>
                <div id="downloads">
                    <a download title="Download Jacob Fischer's resume in PDF format" href="./Resume-Jacob-Fischer.pdf">&blacktriangledown; Download as PDF</a>
                    <a download title="Download Jacob Fischer's resume in Markdown (text) format" href="./Resume-Jacob-Fischer.md">&blacktriangledown; Download as Markdown (Text)</a>
                </div>
            </div>
            <footer id="page-footer">
                <p>This site was made with love and care automatically from a <a href="./Resume-Jacob-Fischer.md">Markdown source</a>, and is hosted graciously via <a href="https://pages.github.com/">GitHub pages</a>. For more information please check out my <a href="https://github.com/JacobFischer/resume">repo on GitHub</a>.</p>
            </footer>
        </body>
        </html>
    `;

    const minFile = htmlMinifier.minify(fullFile, {
        removeComments: true,
        minifyCSS: true,
        collapseWhitespace: true,
    })

    const stream = fse.createWriteStream(join(OUTPUT_DIR, "index.html"));
    await stream.write(minFile);
    stream.end();

    await fse.copyFile(
        join(__dirname, "favicon.ico"),
        join(OUTPUT_DIR, "favicon.ico"),
    );
})().catch((err) => {
    console.error("Error generating html for resume!");
    console.error(err);

    process.exit(1);
});
