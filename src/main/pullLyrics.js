import lyrics from 'node-lyrics';
import lyr from 'lyrics-fetcher';
import progress from 'cli-progress';
import fs from 'fs';
import classify from './classify.js';
import http from 'http';
import syncreq from 'sync-request'

const explicitCheck = (tracks, outputDir) => {
    //create progress bar
    const trackProgress = new progress.Bar({}, progress.Presets.shades_classic);
    trackProgress.start(tracks.length, 0);
    console.log();
    //keep track of number of concurrent calls
    var currentTrack = 0;
    var failedCount = 0;
    //lyr.fetch(tracks[3].Artist, tracks[3].Title, console.log);
    
    var finishedClassification = [];
 
    const handleTrack = index => {
        lyr.fetch(tracks[index].Artist, tracks[index].Title, (error, result) => {
            trackProgress.increment(1);
            if (result == 'Sorry, We don\'t have lyrics for this song yet.' || result == undefined) {
                console.log();
                console.log(error + " - " + result);
                console.log("Had trouble finding lyrics, trying a secondary source");

                var secondaryResult = {}; 
                try {
                    secondaryResult = JSON.parse(syncreq('GET', 'http://lyric-api.herokuapp.com/api/find/' + tracks[index].Artist + '/' + tracks[index].Title).getBody());
                } catch (e) {
                    secondaryResult.err = 'Something went wrong';
                }
                if (secondaryResult.err == undefined) {
                    finishedClassification.push(classify(tracks[index].Artist, tracks[index].Title, secondaryResult.lyric));
                } else {
                    console.log("Secondary source failed too... Sorry")
                    finishedClassification.push({ 
                        Artist: tracks[index].Artist, 
                        Title: tracks[index].Title, 
                        Explicit: 'Unknown', 
                        uniqueProfanities: -1 
                    });
                    failedCount = failedCount + 1;
                }

            } else {
                finishedClassification.push(classify(tracks[index].Artist, tracks[index].Title, result));
            }
            if (currentTrack < tracks.length) {
                handleTrack(++currentTrack);
            } else if (currentTrack == tracks.length) {
                currentTrack = currentTrack + 1;
                console.log();
                console.log("Finished cataloging explicit music, I'll write this to a CSV and give you the file path");
                fs.writeFileSync(outputDir + "Explicit Tracks.csv", 'Title,Artist,Explicit,Profanity Count\n', { encoding: 'UTF-8' });
                finishedClassification.forEach(track => {
                    const outStr = track.Title + "," + track.Artist + "," + track.Explicit + "," + track.uniqueProfanities + '\n';
                    fs.appendFileSync(outputDir + "/Explicit Tracks.csv", outStr, { encoding: 'UTF-8' });
                });
                console.log("All done... Sorry I couldn't help more!");
                console.log("Out of: " + tracks.length + " I've classified: " + tracks.length - failedCount + " and failed: " + failedCount);
                process.exit(0);
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