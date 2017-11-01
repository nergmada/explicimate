import program from 'commander';
import main from './main/index';


program
    .version('1.0.0')
    .description("A CLI to scan CSVs of tracks and artists and flag explicit tracks")
    .arguments('<inputfile>')
    .parse(process.argv);

console.log("Welcome to Explicimate, a tool provided by King's College London Radio (KCL Radio)");

if (typeof program.args[0] === 'undefined') {
    console.log("No file provided, unable to flag explicit songs without a list of songs");
    process.exit(1);
}

main(program.args[0]);