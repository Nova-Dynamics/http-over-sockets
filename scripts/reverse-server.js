#!/usr/bin/env node

const VERSION = require("../package.json").version;
const HELP = `
Development (reverse) server for HTTP-over-sockets using sockhop

USAGE:
    hos-reverse-server [OPTIONS]

OPTIONS:
    -h,--help                       Prints this help menu
    -v,--version                    Prints version
    -a,--address                    Address to connect to (default "localhost")
    -p,--port                       Port to connect on (default is 9898)
    -r,--reconnect-time             Reconnet time delay in seconds (default is 3)
    -t,--timeout                    The timeout for HTTP requests to return by in seconds (default is 10)
    -s,--ssl                        Use ssl when connecting
`;

// Get a copy of the arguments array
let args = process.argv.slice(2);

let address = "localhost";
let port = 9898;
let timeout = 10*1000;
let reconnect = 3*1000;
let ssl = false;

// Read off all the options
let arg;
let input;
while ( args.length > 0 ) {
    switch (arg = args.shift()) {
        case "-v":
        case "--version":
            console.log(VERSION);
            process.exit(0);
            break;
        case "-a":
        case "--address":
            address = args.shift();
            break;
        case "-p":
        case "--port":
            port = parseInt(args.shift());
            if ( isNaN(port) || port < 0 || port >= 2**16 ) {
                console.error("Bad port");
                process.exit(1);
            }
            break;
        case "-r":
        case "--reconnect-time":
            reconnect = parseInt(args.shift())*1000;
            if ( isNaN(reconnect) || reconnect < 0) {
                console.error("Bad reconnect");
                process.exit(1);
            }
            break;
        case "-t":
        case "--timeout":
            timeout = parseInt(args.shift())*1000;
            if ( isNaN(timeout) || timeout < 0) {
                console.error("Bad timeout");
                process.exit(1);
            }
            break;
        case "-s":
        case "--ssl":
            ssl = true;
            break;
        case "-h":
        case "--help":
            console.log(HELP);
            process.exit(0);
            break;
        default:
            if ( args.length > 0 ) {
                console.error(`Unknown argument: ${arg}`);
                console.log(HELP);
                process.exit(1);
            } else {
                input = arg;
            }
    }
}


function log(str) {
    console.log(`[\x1b[32m${(new Date()).toISOString()}\x1b[0m] - ${str}`);
}

const { client:SockhopClient } = require("sockhop");
const { HOSServer } = require("../index.js");

const app = new HOSServer({ timeout });
const client = new SockhopClient({
    address,
    port,
    auto_reconnect_timeout: reconnect,
    ssl,
});


client.on("request", (req,res) => {
    if ( req.type == "HOSRequest" ) {
        log(`${(req.data.headers?.method ?? "GET").toUpperCase()} to ${req.data.url}`);
        app.handle(req.data, (obj) => {
            res.send(obj);
        });
    } else {
        res.end();
    }
});

client.on("disconnect", () => {
    log(`Disconnected from Sockhop server`);
});

client.on("connect", () => {
    log(`Connected to Sockhop server`);
});

client.on("error", console.error);

console.log(`Starting HOS Server in reverse mode ...`);
client.auto_reconnect = true;
