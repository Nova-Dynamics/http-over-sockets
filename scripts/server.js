#!/usr/bin/env node

const VERSION = require("../package.json").version;
const HELP = `
Development server for HTTP-over-sockets using sockhop

USAGE:
    hos-server [OPTIONS]

OPTIONS:
    -h,--help                       Prints this help menu
    -v,--version                    Prints version
    -a,--address                    Host (address) of this server (default "localhost")
    -p,--port                       Port to host on (default is 9898)
    -t,--timeout                    The timeout for HTTP requests to return by in seconds (default is 10)
`;

// Get a copy of the arguments array
let args = process.argv.slice(2);

let address = "localhost";
let port = 9898;
let timeout = 10*1000;

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
        case "-t":
        case "--timeout":
            timeout = parseInt(args.shift())*1000;
            if ( isNaN(timeout) || timeout < 0) {
                console.error("Bad timeout");
                process.exit(1);
            }
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

const { server:SockhopServer } = require("sockhop");
const { HOSServer } = require("../index.js");

const app = new HOSServer({ timeout });
const server = new SockhopServer({
    address,
    port,
});
server.on("request", (req,res,meta) => {
    if ( req.type == "HOSRequest" ) {
        log(`${(req.data.headers?.method ?? "GET").toUpperCase()} from ${meta.socket.identifier} to ${req.data.url}`);
        app.handle(req.data, (obj) => {
            res.send(obj);
        });
    } else {
        res.end();
    }
});

server.on("connect", (sock) => {
    sock.identifier = `${sock.remoteAddress}:${sock.remotePort}`;
    log(`New connection from ${sock.identifier}`);
});

server.on("error", console.error);

console.log(`Starting Server ...`);
server.listen().then(() => {
    console.log(`Listening on tcp://${address}:${port}`);
});
