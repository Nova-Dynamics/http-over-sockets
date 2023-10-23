# HTTP-over-Sockets

HTTP request trunking over tcp sockets

- 100% native javascript
- Low-dependency
- Uses [Sockhop](https://www.npmjs.com/package/sockhop) for the socket backend -- your favorite tcp-normalizing library


## Example usage
The following examples expect `sockhop` to be installed (`npm install sockhop`)

See [Full documentation](./API.md) for details.

### Forward
Here is an example of a "forward" usage, where the HOSClient is also a SockhopClient.
Spin up a server:
```bash
./scripts/server.js
```
Then run:
```js
const { client:SockhopClient } = require("sockhop");
const { HOSClient } = require("http-over-sockets");

// Create a sockhop client
const sclient = new SockhopClient({
    address: "localhost",
    port: 9898,
});
// Create a HOS client from the sockhop client
const hclient = HOSClient.sockhop(sclient);

// Fire up the connection
sclient.connect().then(() => {
    // Ask for Google's home page from the server
    return hclient("https://www.google.com/")
}).then((response) => {
    // Prints out the html response
    console.log(response.body);
})
```

### Reverse
Here is an example of a "reverse" usage, where the HOSClient is actually a SockhopServer.
Spin up a HOSServer (actually a sockhop client trying to connect to a sockhop server):
```bash
./scripts/reverse-server.js
```
Then run:
```js
const { server:SockhopServer } = require("sockhop");
const { HOSClient } = require("http-over-sockets");

// Construct a sockhop server which the "HOSServer/SockhopClient" will connect to
const server = new SockhopServer({
    address: "localhost",
    port: 9898,
});

server.on("connect", (sock, sess) => {
    // Once the connection comes in, create a HOSClient from
    // the sockhop session
    const hclient = HOSClient.sockhop(sess);

    // Ask for Google's home page from the server
    hclient("https://www.google.com/").then((res) => {
        console.log(res.body);
    })
});

// Fire up the server
server.listen();
```

## TODO
 - [ ] Add websocket
 - [ ] Add socket.io support
 - [ ] Add streaming support
