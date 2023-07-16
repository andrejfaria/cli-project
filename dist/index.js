import inquirer from 'inquirer';
async function main() {
    await inquirer.prompt([{
            type: "list",
            name: "project",
            choices: ["hi", "hello"]
        }]);
}
main();
//# sourceMappingURL=index.js.map