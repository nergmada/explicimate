import fs from 'fs';
import readline from 'readline-sync';
import titledCsv from './handleTitledCsv.js';
import untitledCsv from './handleUntitledCsv.js';

const handler = (filename) => {
    if (!fs.existsSync(filename)) {
        console.log("Sorry, the file path you've provided doesn't seem to exist");
        process.exit(1);
    }
    if (filename.toLowerCase().lastIndexOf(".csv") != filename.length - 4) {
        console.log("Sorry, the file provided is not marked as a csv (i.e. ending in .csv)");
        process.exit(1);
    }
    console.log("Congratulations, you've managed to give me a file I can probably work with!");
    
    const headersAnswer = 
        readline.keyInYNStrict("Now I need some more information, does this file have headers over all the columns? e.g. Title, Artist, Album artist etc.\n\n");
    if (headersAnswer) {
        const answer = readline.keyInYNStrict("This might seem like a stupid question but is there an 'artist' and 'title' header? Don't worry about case I've got this\n\n");
        if (answer) {
            titledCsv(filename);
        } else {
            untitledCsv(filename, true);
        }
    } else {
        untitledCsv(filename);
    }

}

export default handler;