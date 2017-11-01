import natural from 'natural';
import parseCsv from 'csv-parse/lib/sync';
import fs from 'fs';

const profanities = parseCsv(fs.readFileSync('lib/dataset/profanewords.csv'));

const explicit = {}

const intersect = (a, b) => {
    var t;
    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    });
}

const classifyLyrics = (title, artist, lyrics) => {
    const tokeniser = new natural.WordTokenizer();
    const tokens = tokeniser.tokenize(lyrics);
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