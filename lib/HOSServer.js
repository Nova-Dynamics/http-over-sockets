
const requests = {
    "http:": require("http").request,
    "https:": require("https").request,
};

const { HTTPTimeoutError, HOSErrorResponse } = require("./errors.js");
const HOSRequest = require("./HOSRequest.js");
const HOSResponse = require("./HOSResponse.js");

class HOSServer {
    constructor({ timeout=10*1000, response_encoding="utf-8" }={}) {
        this.timeout = timeout;
        this.response_encoding = response_encoding;
    }

    handle(obj, cb) {
        const req = HOSRequest.parse(obj);
        const $ = requests[req.url.protocol]; // Get request type: http or https

        let timeout;
        let cb_called = false;
        const hreq = $(req.url, req.options, (hres) => {
            // TODO : is there a good way to handle raw binary data?
            hres.setEncoding(req.options.response_encoding || this.response_encoding);
            const data = [];
            hres.on("data", (chunk) => data.push(chunk));
            hres.on("end", () => {
                // All data has arrived, so we can safely construct the response
                clearTimeout(timeout);

                if ( cb_called ) return;
                cb(HOSResponse.new({
                    statusCode: hres.statusCode,
                    statusMessage: hres.statusMessage,
                    headers: hres.headers, // note, this is just a raw object
                    complete: hres.complete,
                    body: data.join(""),
                }));
                cb_called = true;
            });
        });

        timeout = setTimeout(() => {
            hreq.destroy(new HTTPTimeoutError("Request timed out"));
        }, this.timeout);

        // Handle and return errors over the wire
        let first_error = true;
        hreq.on("error", (err) => {
            // Only return the first error
            if ( !first_error ) return;
            if ( cb_called ) return;
            cb(HOSErrorResponse.new(err));
            cb_called = true;
            first_error = false;
        });

        // Send the request
        // TODO : needs good way to handle steamed data
        hreq.end(req.body ? req.body : undefined);
    }
}

module.exports = HOSServer;
