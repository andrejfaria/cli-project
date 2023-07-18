#!/usr/bin/env node
import fse from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
import { argv } from 'node:process';
import { fileURLToPath } from 'url';
import { promises as fsPromise } from 'fs';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const url = "https://api.github.com/gitignore/templates/Node"

async function getTemplates(): Promise<string | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data.source;
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
  return undefined;
}


async function main() {
  let targetdir = ''
  if (!argv[2]) {
    targetdir = process.cwd();
  }
  targetdir = argv[2]
  console.log("targetdir------------------------", targetdir)

  const destination = path.join(process.cwd().toString(), targetdir);
  console.log("targetdir------------------------", targetdir)

  const tempDir = path.join(__dirname, ".././src", "./templates");
  console.log("tempDir------------------------", tempDir)


  const { project } = await inquirer.prompt([
    {
      type: "list",
      name: "project",
      choices: await fse.readdir(path.join(tempDir)),
    }])

  const copyFromDir = path.join(tempDir, project);
  console.log("copyFromDir------------------------", copyFromDir)
  await fse.copy(copyFromDir, destination, (err) => {
    if (err) {
      console.log(err)
    }
    console.log("sucessfully copied");
  });


  const content = await getTemplates();
  if (content) {
    await fsPromise.writeFile(path.join(destination, ".gitignore"), content);
  }

  const targetPackage = path.join(destination, "package.json");
  let packageContent = JSON.parse(fse.readFileSync(targetPackage).toString())
  packageContent.name = targetdir;
  await fsPromise.writeFile(targetPackage, JSON.stringify(packageContent, null, 2))
  console.log("packageContent", JSON.stringify(packageContent.name))
}

main();


