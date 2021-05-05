import { readdirRecursive } from "./pathScanUtils";
import AutograderError from "./AutograderError";
import fs from "fs";
import { JSDOM, VirtualConsole } from "jsdom";


export async function loadHTML(filename, pathToScan) {

  const files = (await readdirRecursive(pathToScan))
    .filter(f => f.endsWith(filename));

  if (files.length === 0) {
    throw new AutograderError('File not found: ' + filename);
  }

  if (files.length > 1) {
    throw new AutograderError('You have more file named `' + filename + '`, make sure to keep only one to be graded.');
  }

  let file = files[0];

  const fileContents = await fs.promises.readFile(file,  { encoding: "utf-8" });

  const virtualConsole = new VirtualConsole();
  virtualConsole.sendTo(console, { omitJSDOMErrors: true });

  let dom = new JSDOM(fileContents, {
    resources: "usable",
    runScripts: "dangerously",
    url: "file:///" + file,
    virtualConsole
  });

  return new Promise(resolve => {
    dom.window.document.addEventListener('load', () => resolve(dom.window));
  });
}
