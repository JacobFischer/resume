const fse = require("fs-extra");
const htmlDocxJs = require("html-docx-js");
const { join } = require("path");

const HTML_DIR = process.argv[2] || "output";
const DOCX_INCH = 1440; // number from the html-docx-js code base for margins

(async function main() {
    const html = await fse.readFile(join(HTML_DIR, "index.html"));

    const sanitizedHtml = html
        .toString()
        // Remove the downloads div
        .replace(/<div id="downloads">(.+?)<\/div>/g, "")
        // Remove the page footer as well
        .replace(/<footer id="page-footer">(.+?)<\/footer>/g, "")
        // Flatten media queries, as our normal CSS does not look great in Word,
        // however the simplified formatting for mobile via via media queries looks fine
        .replace(/@media only screen(.+?){(.+?)}}/g, (s) => (
            (/{(.+?)}}/g).exec(s)[0].slice(1, -1)
        ));

    // Generate the docx file from the html we manipulated above.
    const docx = htmlDocxJs.asBlob(sanitizedHtml, {
        margins: {
            top: DOCX_INCH / 4,
            right: DOCX_INCH / 2,
            bottom: DOCX_INCH / 4,
            left: DOCX_INCH / 2,
            header: 0,
            footer: 0,
            gutter: 0
        },
    });

    await fse.writeFile(join(HTML_DIR, "Resume-Jacob-Fischer.docx"), docx);
})();
