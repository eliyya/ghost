#!/usr/bin/env node
import { Command } from 'commander';
import { execSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { confirm } from '@inquirer/prompts'
import fileSelector from 'inquirer-fs-selector'
import chalk from 'chalk'
import { parse } from 'dotenv'

const program = new Command()
    .name('ghost install')
    .description('Install the Ghost app in your system')
    .parse(process.argv)


const log = (message: string) => process.stdout.write(`${message}\n`)
const clearLastLine = () => {
    process.stdout.moveCursor(0, -1) // up one line
    process.stdout.clearLine(1) // from cursor to end
  }
log('Installing Ghost app...');
log('Checking platform...');
const platform = process.platform === 'win32' ? 'Windows' : 'Linux';
if (!['Windows', 'Linux'].includes(platform)) {
    log(`Sorry, ${chalk.red('Ghost app is only supported on Windows and Linux at the moment')}`);
    process.exit(1);
}
clearLastLine()
log(`Checking platform: ${chalk.cyan(`${platform} detected`)}`);
log('Checking system requirements...');
log('- Checking Node.js version...'); 
const [major, minor] = process.versions.node.split('.').map(Number)
if (major < 20 || (major === 20 && minor < 11)) {
    log(`Sorry, ${chalk.red('Ghost app requires Node.js version 20.11.0 or higher')}`); // TODO: add method to install node 
    process.exit(1);
}
clearLastLine()
log(`- Checking Node.js version: ${chalk.cyan(`Node.js ${process.versions.node} detected`)}`);
log('- Checking git ...');
let gitVersion;
try {
    gitVersion = execSync('git --version').toString().trim();
} catch (error) {    
    log(`Sorry, ${chalk.red('Ghost app requires git to be installed')}`); // TODO: add method to install git    
    log(`Please install git from ${
        platform === 'Windows' ? 'https://git-scm.com/download/win' : 'https://git-scm.com/download/linux'    
    } and try again`);    
    process.exit(1);
}
clearLastLine()
log(`- Checking git: ${chalk.cyan(`git ${gitVersion} detected`)}`);
clearLastLine()
clearLastLine()
clearLastLine()
log(chalk.cyan('System requirements met'));
log(`- Checking Node.js version: ${chalk.cyan(`Node.js ${process.versions.node} detected`)}`);
log(`- Checking git: ${chalk.cyan(`git ${gitVersion} detected`)}`);
const dirnameApp = platform === 'Windows' ? 'GhostApp' : '.ghostapp';
// const yes = false
// log(`Installing Ghost app in ${pathToInstall}...[Y/n]`);
// confirm
async function getInstalationPath(defaultPathToInstall: string) {
    const res = await confirm({ 
        message: `Installing Ghost app in ${defaultPathToInstall}`,
    });
    if (res) return defaultPathToInstall
    const filePath = await fileSelector({
        message: 'Select a dir:',
        path: dirname(defaultPathToInstall),
        dir: true
    })
    return await getInstalationPath(join(filePath, dirnameApp))
}

const pathToInstall = await getInstalationPath(platform == 'Windows' ? join(process.env.ProgramFiles as string, dirnameApp) : '~/.ghostapp')
async function download() {
    try {
        // clone in directory
        execSync(`git clone https://github.com/eliyya/ghost "${pathToInstall}"`);
    } catch (error) {   
        if (`${error}`.includes('Permission denied')) {
            log(`${chalk.red('Permission denied')}. Try running the command ${platform === 'Windows' ? 'as administrator' : 'with sudo'}`);
        } else if (`${error}`.includes('already exists')) {
            const res = await confirm({ 
                message: `Directory ${pathToInstall} already exists, do you want to overwrite it? (you will lose all data in the directory)`,
            });
            if (res) {
                execSync(`rm -rf ${pathToInstall}`);
                await download();
            } else {
                log(chalk.red(`Directory ${pathToInstall} already exists`));
            } 
        } else {
            log(chalk.red('An error occurred while downloading Ghost app'));    
        }
        process.exit(1);
    }
}
await download()
console.log(parse('PORT=3000\nNODE_ENV=development\n'));
console.log('created');
