
const { TransportError, HOSErrorResponse } = require("./errors.js");
const HOSRequest = require("./HOSRequest.js");
const HOSResponse = require("./HOSResponse.js");

/**
 * Base class for types of message transport over the wire
 */
class Transport {
    #connection;

    /**
     * Constructor
     *
     * @param {*} connection - internal object used for transport
     */
    constructor(connection) {
        this.#connection = connection;
    }

    /**
     * Connection
     * @type {*}
     */
    get connection() {
        return this.#connection;
    }

    /**
     * Request the server make a HTTP request and return results
     *
     * @virtual
     * @param {HOSRequest}
     * @throws {HOSError}
     * @throws {TransportError}
     * @return {Promise<HOSResponse>}
     */
    request(req) { // eslint-disable-line no-unused-vars
        throw new Error("Not Implemented");
    }
}

/**
 * Transport wraper for a sockhop connection
 * @extends Transport
 */
class SockhopTransport extends Transport {
    /**
     * Constructor
     *
     * @param {SockhopClient|SockhopSession} connection
     * @param {Object} config
     * @param {number} [config.timeout=30000] - Sockhop request timeout in ms
     */
    constructor(connection, { timeout=30*1000 /* something very long */ }={}) {
        super(connection);
        this.timeout = timeout;
    }

    /**
     * Request the server make a HTTP request and return results
     *
     * @param {HOSRequest}
     * @throws {HOSError}
     * @throws {TransportError}
     * @return {Promise<HOSResponse>}
     */
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


/**
 * A client object for trunking an HTTP request to a server
 *
 * ```js
 * // Example using sockhop
 * // Create an instance
 * const client = HOSClient.sockhop(sockhop_client_or_session);
 *
 * // Call me like a function
 * const response = await client("www.google.com");
 *
 * // Or if you prefer using the member function directly:
 * const response = await client.call("www.google.com");
 * ```
 *
 * @extends Function
 */
class HOSClient extends Function {
    /**
     * Constructor
     *
     * @param {Transport} transport
     */
    constructor(transport) {
        super();

        this._transport = transport;

        // Thanks to: https://hackernoon.com/creating-callable-objects-in-javascript-d21l3te1
        return new Proxy(this, {
            apply: (target, this_arg, args) => this.call(...args)
        });
    }

    /**
     * Make an HTTP request over the wire
     *
     * @param {String|URL} url - URL of the request
     * @param {Object} [options={}] - options passed to the `http.request(...)` call made on the server.
     * @param {?String} [options.method='GET']
     * @param {?Object} [options.headers]
     * @param {undefined|String|Buffer} [body=undefined] - Body to include with the request, not the server does not do any post-processing of this data, so you must stringify yourself.
     * @throws {TypeError} - If URL is invalid
     * @throws {TransportError} - If there is an error with trunking message across the wire
     * @throws {HOSError} - If there is an error on the server while making this request
     * @return {Promise<HOSRequest>}
     */
    call(url, options={}, body=undefined) {
        url = typeof(url) == "string" ? new URL(url) : url; // Error checking and normalization of url
        const req = HOSRequest.new(url, options, body);
        return this._transport.request(req);
    }

    /**
     * Create an instance from a Sockhop connection
     *
     * @param {SockhopClient|SockhopSession} sockhop - an existing sockhop connection
     * @param {Object} [options={}] - Options to pass to the SockhopTransport object
     * @return {HOSClient}
     */
    static sockhop(sockhop, options={}) {
        return new this(new SockhopTransport(sockhop, options));
    }
}

module.exports = HOSClient;
