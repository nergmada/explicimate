import lyrics from 'node-lyrics';
import lyr from 'lyrics-fetcher';
import progress from 'cli-progress';
import fs from 'fs';
import classify from './classify.js';

const explicitCheck = (tracks, outputDir) => {
    //create progress bar
    const trackProgress = new progress.Bar({}, progress.Presets.shades_classic);
    trackProgress.start(tracks.length, 0);
    console.log();
    //keep track of number of concurrent calls
    var currentTrack = 0;

    //lyr.fetch(tracks[3].Artist, tracks[3].Title, console.log);
    
    var finishedClassification = [];

    const handleTrack = index => {
        lyr.fetch(tracks[index].Artist, tracks[index].Title, (error, result) => {
            trackProgress.increment(1);
            if (result == 'Sorry, We don\'t have lyrics for this song yet.' || result == undefined) {
                console.log("\nHad trouble finding lyrics");
            } else {
                finishedClassification.push(classify(tracks[index].Artist, tracks[index].Title, result));
            }
            if (currentTrack < tracks.length) {
                const nextTrack = currentTrack;
                currentTrack = currentTrack + 1;
                handleTrack(nextTrack);
            } else if (currentTrack == tracks.length) {
                currentTrack = currentTrack + 1;
                console.log("Finished cataloging explicit music, I'll write this to a CSV and give you the file path");
                fs.writeFileSync(outputDir + "Explicit Tracks.csv", 'Title,Artist,Explicit,Profanity Count\n', { encoding: 'UTF-8' });
                
                finishedClassification.forEach(track => {
                    const outStr = track.Title + "," + track.Artist + "," + track.Explicit + "," + track.uniqueProfanities + '\n';
                    fs.appendFileSync(outputDir + "Explicit Tracks.csv", outStr, { encoding: 'UTF-8' });
                });
            }
        });
    }
    handleTrack(currentTrack);
    handleTrack(++currentTrack);
    handleTrack(++currentTrack);
    handleTrack(++currentTrack);
    handleTrack(++currentTrack);
}

export default explicitCheck;