import fs from 'fs';
import path from 'path';
import parseCsv from 'csv-parse/lib/sync';
import readline from 'readline-sync';
import pullLyrics from './pullLyrics.js';

const untitledCsv = (csvFile, abnormalHeadersFlag) => {
    const records = parseCsv(fs.readFileSync(csvFile, { encoding: 'UTF-8' }));
    console.log("Okay, so here's the deal, I'm going to go through a record and you're going to tell me if it's an artist or a title");
    console.log("By doing this I can figure out what column artists are in and what column titles are in");
    console.log("Here we go:");
    const map = {
        Artist: -1,
        Title: -1
    };
    records.every(record => {
        record.every((item, index) => {
            const options = {
                limit: Object.keys(map).filter(key => map[key] == -1).concat(['Neither'])
            }
            console.log("Data: " + item);
            const answer = readline.question("What is this piece of data? <" + options.limit + ">\n\n", options);
            if (answer.toLowerCase() == "artist") {
                map["Artist"] = index;
            } else if (answer.toLowerCase() == "title") {
                map["Title"] = index;
            }
            
            if (Object.keys(map).filter(key => map[key] == -1).length == 0) return false;
            else return true;
        });

        if (Object.keys(map).filter(key => map[key] == -1).length == 0) return false;
        else return true;
    });
    var data;

    if (abnormalHeadersFlag) {
        data = records.slice(1).map(record => {
            return { Artist: record[map.Artist], Title: record[map.Title] }
        });
    } else {
        data = records.map(record => {
            return { Artist: record[map.Artist], Title: record[map.Title] }
        });
    }
    
    pullLyrics(data, path.dirname(csvFile));
}

export default untitledCsv