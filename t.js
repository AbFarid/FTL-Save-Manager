const fs = require('fs');
const readline = require('readline');
const moment = require('moment');
const bc = require('bytecode');
const bts = require('buffer-to-string');
const settings = require('./app/js/config');

const SAVESDIR = require('os').homedir() + settings.savesDir[process.platform];
const BACKUPDIR = require('os').homedir() + settings.savesDir[process.platform] + settings.backupsDir;

// fs.mkdirSync(BACKUPDIR);

let bytecode = fs.readFileSync(SAVESDIR + '/continue.sav');
let bytestring = bts(bytecode, 4).replace(/\s/g,'');
// let output = '';
// output = bytestring.replace(/(.{4})/g, "$1\n");
// for (let i = 0; i < bytecode.length; i++) {
//     if (i > 0 && (i+1)%4 == 0 && i < 256) {
//         output = bytecode.slice(0, i) + '\n' + bytecode.slice(i);
//     }
// }
// fs.writeFileSync('output.txt', bts(bytecode, 4).replace(/\s/g,''));
// console.log(bts(bytecode, 4));

let saveInfo = {
    shipType: '',
    shipName: '',
    hull: 0,
    fuel: 0,
    drones: 0,
    missiles: 0,
    scrap: 0,
    crewCount: 0
}

const orderOfValues = {
    'verion1': 4,
    'version2': 4,
    'difficulty': 4,
    'ships defeated': 4,
    'jumps in sector': 4,
    'scrap collected': 4,
    'crew recruited': 4,
    'string length (ship name)': 4,
    'ship name': 'get'
}

function getVal() {
    let structure = fs.readFileSync('structure.txt');
}

function hexToInt(hexString) {
    return parseInt(hexString, 16);
}

function getByteAt(index) {
    return '' + bytestring[index] + bytestring[index + 1];
}
function get4BytesAt() {}

function getShipNameLength() {
    const nameLengthOffset = 56;
    return hexToInt(getByteAt(nameLengthOffset));
}

let output = '';
// const regex = /(?:.+  )(.+)/;
const regex = /(\d+).*?\s*  (.*)/;
const rl = readline.createInterface({
    input: fs.createReadStream('structure.txt')
});

rl.on('line', function (line) {
    while (line.charAt(0) == ' ') {
        line = line.slice(1)
    };
    if (Number.isInteger(parseInt(line.charAt(0))) || line.charAt(0) == 'n') {
        
        // output += line + '\n';
        if (Number.isInteger(parseInt(line.charAt(0)))) console.log(regex.exec(line)[1]);
    }
});

rl.on('close', () => {
    console.log(output);
});


