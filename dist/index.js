#!/usr/bin/env node
import fse from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import { argv } from 'node:process';
import { fileURLToPath } from 'url';
import { promises as fsPromise } from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const url = "https://api.github.com/gitignore/templates/Node";
async function getTemplates() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response;
    }
    catch (error) {
        console.error(`Could not get template: ${error}`);
    }
    return undefined;
}
async function main() {
    let targetdir = '';
    if (!argv[2]) {
        targetdir = process.cwd();
    }
    targetdir = argv[2];
    const destination = path.join(process.cwd().toString(), targetdir);
    const tempDir = path.join(__dirname, ".././src", "./templates");
    const { project } = await inquirer.prompt([
        {
            type: "list",
            name: "Choose a project :",
            choices: await fse.readdir(path.join(tempDir)),
        }
    ]);
    const copyFromDir = path.join(tempDir, project);
    console.log("copyFromDir------------------------", copyFromDir);
    await fse.copy(copyFromDir, destination, (err) => {
        if (err) {
            console.log(err);
        }
        console.log("sucessfully copied");
    });
    const content = await getTemplates();
    let res = await (content === null || content === void 0 ? void 0 : content.json());
    console.log(res);
    if (content) {
        await fsPromise.writeFile(path.join(destination, ".gitignore"), res.source);
    }
    const targetPackage = path.join(destination, "package.json");
    let packageContent = JSON.parse(fse.readFileSync(targetPackage).toString());
    packageContent.name = targetdir;
    await fsPromise.writeFile(targetPackage, JSON.stringify(packageContent, null, 2));
    console.log("packageContent", JSON.stringify(packageContent.name));
}
main();
//# sourceMappingURL=index.js.map