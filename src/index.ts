#!/usr/bin/env node
import fse from 'fs-extra';
import inquirer from 'inquirer';
import path, { join } from 'path';
import { argv } from 'node:process';
// import { dirname } from 'path';

import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main() {

  let targetdir = ''
  if (!argv[2]) {
    targetdir = process.cwd();
  }
  targetdir = argv[2];

  console.log(argv[2])
  console.log('--------->', process.cwd()
    , 'process')

  console.log('--------->', targetdir
    , 'target')
  const destination = path.join(process.cwd(), targetdir)


  const { project } = await inquirer.prompt([
    {
      type: "list",
      name: "project",
      choices: await fse.readdir(path.join(__dirname, "templates")),
    }])


  await fse.copy(
    // path.join(__dirname, "./templates", project),
    // path.join(__dirname, "../", project)
    path.join(__dirname, "./templates", project), destination)
}




main();


