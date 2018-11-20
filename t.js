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



function hexToDec(hexStr) {
    const hexStrReverse = hexStr.match(/.{1,2}/g).reverse().join('');
    return parseInt(hexStrReverse, 16);
}

function hexToUTF8(hexStr) {
    return new Buffer(hexStr, 'hex').toString('utf8');
}

function getBytesAt(index, length = 4) {
    return bytestring.slice(index, index + (length*2));
}

function getVal(entries, target, cb) {
    let offset = 0;
    let lastByteLen = 0;
    let index = 0;
    for (let entry of entries) {
        if (entry.len == 'n') {
            entry.len = hexToDec(getBytesAt(offset - lastByteLen*2));
        }
        console.log(entry, offset, lastByteLen, index);
        if (entry.name == target) {
            let value;
            if (entry.type == 'int') value = hexToDec(getBytesAt(offset, entry.len));
            if (entry.type == 'char') value = hexToUTF8(getBytesAt(offset, entry.len));
            if (entry.type == 'bool') value = true;
            cb(value);
            break;
        }
        lastByteLen = entry.len;
        offset += entry.len*2;
        index++;
    }
}

function getDataType(str) {
    if (str.indexOf('bit int') != -1) return 'int';
    else if (str.indexOf('bool') != -1) return 'bool';
    else if (str.indexOf('char *') != -1) return 'char';
    else return 'unknown';
}

let output = [];
const regexName = /(?:.+  )(.+)/;
const regexBytes = /(\d+).*?\s*  (.*)/;
let inSection = false;

const rl = readline.createInterface({
    input: fs.createReadStream('structure.txt')
});

rl.on('line', function (line) {
    while (line.charAt(0) == ' ') {
        line = line.slice(1)
    };
    // handle sections

    // structure txt to json
    if (Number.isInteger(parseInt(line.charAt(0))) || line.charAt(0) == 'n') {
        let name = regexName.exec(line)[1];
        let type = getDataType(line);
        let len;
        if (Number.isInteger(parseInt(line.charAt(0)))) len = parseInt(regexBytes.exec(line)[1]);
        else if (line.charAt(0) == 'n') {len = 'n';}
        output.push({name, len, type});

        // if (name.indexOf('count') != -1) {
        //     expectSection = true;
        // }
    }
});

rl.on('close', () => {
    getVal(output, 'Categories count', (bytes) => {
        console.log(bytes);
    });
    // fs.writeFileSync('output.json', JSON.stringify(output));
    // getVal(output, 'Ships defeated');
});


