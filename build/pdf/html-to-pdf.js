const httpServer = require("http-server");
const path = require("path");
const puppeteer = require("puppeteer");

const PORT = 22255;
const OUTPUT_DIR = process.argv[2] || "./";

(async function main() {
    const server = httpServer.createServer({
        root: path.join(__dirname, "../../output"),
        robots: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true"
        },
    });

    server.listen(PORT);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`http://localhost:${PORT}/`, {
        waitUntil: "networkidle2", // ensure web fonts and images are downloaded
    });
    await page.emulateMedia('print');
    const margin = "0.5in";
    await page.pdf({
        path: path.join(OUTPUT_DIR, "Resume-Jacob-Fischer.pdf"),
        format: "Letter",
        margin: { top: "0.25in", bottom: "0.125in" },
        pageRanges: '1-2',
        // left and right margins should be from centering the resume
    });

    browser.close();
    server.close();
})().catch((err) => {
    console.error("Error rendering resume!");
    console.error(err);

    // The constructed browser and server could make the process hang
    // indefinitely, so we must hard exit here.
    process.exit(1);
});
