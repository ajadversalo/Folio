const fs = require("fs");
const path = require("path");
require("./icons.js");
const required = ["index.html", "styles.css", "constants.js", "app.js", "manifest.webmanifest", "sw.js", "icon-192.png", "icon-512.png"];
for (const file of required) {
  if (!fs.existsSync(path.join(__dirname, "..", file))) throw new Error(`Missing ${file}`);
}
const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
for (const ref of ["styles.css", "constants.js", "app.js", "manifest.webmanifest"]) {
  if (!html.includes(ref)) throw new Error(`index.html does not reference ${ref}`);
}
const testNode = { classList: { add(){}, remove(){}, toggle(){} }, addEventListener(){}, focus(){}, style: {}, offsetWidth: 1 };
global.localStorage = { getItem: () => null, setItem(){} };
global.document = { querySelector: () => testNode, querySelectorAll: () => [], addEventListener(){}, documentElement: { style: { setProperty(){} } }, body: { dataset: {}, classList: { add(){}, remove(){} } } };
global.window = { addEventListener(){} };
global.navigator = {};
require(path.join(__dirname, "..", "constants.js"));
require(path.join(__dirname, "..", "app.js"));
console.log("Build verified: all app and PWA assets are present.");
