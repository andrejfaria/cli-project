

import fse from 'fs-extra';
import inquirer from 'inquirer';
import path from 'path';
// import { dirname } from 'path';

import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
// console.log(path.join(__dirname, "templates"));

async function main() {


  const { project } = await inquirer.prompt([
    {
      type: "list",
      name: "project",
      choices: await fse.readdir(path.join(__dirname, "templates")),
    }])
  console.log(process.argv)
  console.log(project)
  await fse.copy(
    path.join(__dirname, "./templates", project),
    path.join(__dirname, "../", project)
  )
  // console.log(path.join(__dirname, "./templates", project));
}

main();