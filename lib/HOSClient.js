
const { TransportError, HOSErrorResponse } = require("./errors.js");
const HOSRequest = require("./HOSRequest.js");
const HOSResponse = require("./HOSResponse.js");

class Transport {
    #connection;
    constructor(connection) {
        this.#connection = connection;
    }

    get connection() {
        return this.#connection;
    }

    request(req, cb) { // eslint-disable-line no-unused-vars
        throw new Error("Not Implemented");
    }
}

class SockhopTransport extends Transport {
    constructor(connection, { timeout=30*1000 /* something very long */ }={}) {
        super(connection);
        this.timeout = timeout;
    }
    request(req) {
        return this.connection.request(req, { timeout:this.timeout }).then(stream => {
            return new Promise((resolve, reject) => {
                // Listen for the 'end' event, which will provide an error if something
                // went wrong (i.e. a timeout), in that case, bubble the error to make
                // sure we don't just hang
                stream.once("end", (err) => {
                    if ( err ) reject(err);
                });
                // Also listen for the "next" of the stream -- which currently will also
                // just be the last
                stream.next().then(resolve);
            });
        }).catch((err) => {
            throw new TransportError(err.message);
        }).then(resp => {
            if ( resp.type == "HOSResponse" ) {
                return HOSResponse.parse(resp.data);
            } else {
                throw HOSErrorResponse.parse(resp.data).error();
            }
        });
    }
}


class HOSClient extends Function {
    constructor(transport) {
        super();

        this._transport = transport;

        // Thanks to: https://hackernoon.com/creating-callable-objects-in-javascript-d21l3te1
        return new Proxy(this, {
            apply: (target, this_arg, args) => this.call(...args)
        });
    }

    /**
     * Make a request over the wire
     *
     * @param {string|URL} url
     * @param {object} [options={}]
     * @param {?string} [body=undefined]
     * @throws {TransportError}
     * @returns {Promise<HOSRequest>}
     */
    call(url, options={}, body=undefined) {
        url = typeof(url) == "string" ? new URL(url) : url; // Error checking and normalization of url
        const req = HOSRequest.new(url, options, body);
        return this._transport.request(req);
    }

    static sockhop(sockhop, options={}) {
        return new this(new SockhopTransport(sockhop, options));
    }
}

module.exports = HOSClient;
