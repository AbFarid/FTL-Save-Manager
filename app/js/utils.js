const fs = require('fs');
const moment = require('moment');
const {shell} = require('electron');

const CONFIG = require('./js/config');
const SAVESDIR = require('os').homedir() + CONFIG.savesDir[process.platform];
const BACKUPDIR = require('os').homedir() + CONFIG.savesDir[process.platform] + CONFIG.backupsDir;

function createBackupsFolder() {
    if (!fs.existsSync(BACKUPDIR)) {
        fs.mkdirSync(BACKUPDIR)
    }
}

function saveExists() {
    return fs.existsSync(SAVESDIR + '/continue.sav');
}

function openBackups() {
    shell.openItem(BACKUPDIR);
    // shell.openExternal('https://github.com');
}

function backupSave() {
    if (fs.existsSync(SAVESDIR + '/continue.sav')) {
        let name = moment().format('YYYY-MM-DD HHmm') + '.sav';
        createBackupsFolder();
        const save = fs.createReadStream(SAVESDIR + '/continue.sav');
        fs.createWriteStream(BACKUPDIR + '/' + name);
    } else {
        console.error('404: No save file found');
        return false;
    }
}

function getBackups() {
    try {
        let files = fs.readdirSync(BACKUPDIR);
        // ignore system files
        files.forEach((file, index, object) => {
            if (file[0] == '.') object.splice(index, 1);
        });
        return files;
    } catch (err) {
        console.error(err);
    }
}

function restoreBackup(file) {
    const save = fs.createReadStream(BACKUPDIR + '/' + file);
    fs.createWriteStream(SAVESDIR + '/continue.sav');
}

// console.log();


