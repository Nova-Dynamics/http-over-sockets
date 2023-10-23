
/**
 * Serializable HOSResponse
 *
 * @typedef HOSResponseObject
 * @type {object}
 * @property {number} statusCode - HTTP Response status code
 * @property {string} statusMessage - Standard response message (for response code)
 * @property {Object} headers - HTTP Response headers
 * @property {String} headers["content-type"] - The body's response type (e.g. "application/json")
 * @property {Boolean} complete - Was all data of HTTP response received by server?
 * @property {undefined|String|Buffer} [body=undefined] - Response body, type depends on the encoding type used by server
 */

/**
 * Wrapper class for the HTTP response trunked over the wire
 */
class HOSResponse {
    /**
     * Constructor
     * @param {HOSResponseObject}
     */
    constructor({
        statusCode,
        statusMessage,
        headers={},
        complete,
        body=undefined,
    }) {

        /**
         * HTTP Response status code
         * @type {Number}
         */
        this.statusCode = statusCode;

        /**
         * Standard HTTP Response status message (for code)
         * @type {String}
         */
        this.statusMessage = statusMessage;

        /**
         * HTTP Response headers
         * @type {object}
         * @property {String} "content-type" - The body's response type (e.g. "application/json")
         */
        this.headers = headers;

        /**
         * Was the HTTP Response's body completely recieved by the server?
         * @type {Boolean}
         */
        this.complete = complete;

        /**
         * HTTP response body
         * @type {undefined|String|Buffer}
         */
        this.body = body;
    }

    /**
     * Create a new object (on the server)
     * @param {HOSResponseObject}
     */
    static new(obj) { return new this(obj); }

    /**
     * Deserialize object (on the client)
     * @param {HOSResponseObject}
     */
    static parse(obj) { return new this(obj); }

    /**
     * Was the HTTP response of 200-century?
     * @type {Boolean}
     */
    get ok() { return this.statusCode < 300; }
}

module.exports = HOSResponse;
