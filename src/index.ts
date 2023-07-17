#!/usr/bin/env node
import fse from 'fs-extra';
import inquirer from 'inquirer';
import path, { join } from 'path';
import { argv } from 'node:process';
import { fileURLToPath } from 'url';
import gitignore from "gitignore"
import util from 'util';
import { promisify } from 'util';
import { promises as fsPromise } from 'fs';
import { json } from 'stream/consumers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const wgitignore = promisify(gitignore.writeFile)
const url = "https://api.github.com/gitignore/templates/Node"

async function getTemplates(): Promise<string | undefined> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    console.log("first-------------", data.source)
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
  targetdir = argv[2];

  const tempDir = path.join(__dirname, "./templates");

  const { project } = await inquirer.prompt([
    {
      type: "list",
      name: "project",
      choices: await fse.readdir(path.join(tempDir)),
    }])

  const projectDir = join(tempDir, project);

  await fse.copy(projectDir, project);
  // const gwrite = util.promisify(());

  const content = await getTemplates()
  if (content) {
    console.log(content, '----------------------------- ')
    console.log('aqui')
    await fsPromise.writeFile(join(projectDir, ".gitignore"), content);

  }

}

main();


