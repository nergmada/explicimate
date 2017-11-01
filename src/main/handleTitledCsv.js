import fs from 'fs';
import path from 'path';
import parseCsv from 'csv-parse/lib/sync';
import pullLyrics from './pullLyrics.js';

const pullRelevantFieldsFromObject = (trackObj) => {
    const keys = Object.keys(trackObj);
    const neededHeaders = ['Artist', 'Title']
    const newTrackObj = {}
    neededHeaders.forEach(headerElement => {
        const header = keys.find(keyElement => {
            return (headerElement.toLowerCase() == keyElement.toLowerCase()) 
        });
        newTrackObj[headerElement] = trackObj[header];
    });
    return newTrackObj;
}

const titledCsv = (csvFile) => {
    const records = 
        parseCsv(fs.readFileSync(csvFile, { encoding: 'UTF-8' }), { columns: true })
        .map(pullRelevantFieldsFromObject);
    pullLyrics(records, path.dirname(csvFile));
}

export default titledCsv