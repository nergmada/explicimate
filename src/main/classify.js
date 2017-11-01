import natural from 'natural';
import parseCsv from 'csv-parse/lib/sync';
import fs from 'fs';

const profanities = parseCsv(fs.readFileSync('lib/dataset/profanewords.csv'));

const explicit = {}

const intersect = (passedProfanities, words) => {
    return passedProfanities.filter(profanity => {
        return words.findIndex(word => (word.toLowerCase() == profanity[0].toLowerCase())) != -1
    })
}

const classifyLyrics = (artist, title, lyrics) => {

    const tokeniser = new natural.WordTokenizer();
    const tokens = tokeniser.tokenize(lyrics).map(word => word.toLowerCase());
    
    const flaggedProfanities = intersect(profanities, tokens);
    
    if (flaggedProfanities.length > 0) {
        tokens.forEach(word => {
            if (explicit[word] == undefined) explicit[word] = 1
            else explicit[word] = explicit[word] + 1
        });
        return { 
            Title: title,
            Artist: artist,
            Explicit: true,
            uniqueProfanities: flaggedProfanities.length
        }
    } else {
        tokens.forEach(word => {
            if (explicit[word] == undefined) explicit[word] = -1
            else explicit[word] = explicit[word] - 1
        });
        return { 
            Title: title,
            Artist: artist,
            Explicit: false,
            uniqueProfanities: 0
        }
    }
}

export default classifyLyrics;