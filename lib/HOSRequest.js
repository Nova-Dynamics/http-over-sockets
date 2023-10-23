
/**
 * Wrapper class for the HTTP request trunked over the wire
 */
class HOSRequest {
    /**
     * Constructor
     *
     * @param {HOSRequestObject}
     */
    constructor({
        url,
        options={},
        body=undefined,
    }={}) {
        this.url = url;
        this.options = options;
        this.body = body;
    }

    /**
     * Parse a response (on the server) sent by the client
     *
     * @param {HOSRequestObject}
     * @throws {TypeError} - If URL is invalid
     * @return {HOSRequest}
     */
    static parse({ url, options={}, body }) {
        return new this({
            url: new URL(url),
            options: options,
            body: body
        });
    }

    /**
     * Create a new request (on the client)
     *
     * @param {String} url
     * @param {Object} options
     * @param {undefined|String|Buffer} body
     * @return {HOSRequest}
     */
    static new(url, options, body) {
        return new this({
            url: url,
            options: options,
            body: body,
        });
    }

    /**
     * Serialize this request
     *
     * @return {HOSRequestObject}
     */
    toJSON() {

        /**
         * Serializable HOSRequest
         *
         * @typedef HOSRequestObject
         * @type {object}
         * @property {String} url - normalized URL string
         * @property {Object} [options={}] - options passed to the `http.request(...)` call made here on the server.
         * @property {String} [options.method='GET']
         * @property {Object} [options.headers={}]
         * @property {undefined|String|Buffer} [body=undefined] - Body to include with the request, not the server does not do any post-processing of this data, so you must stringify yourself.
         */
        return {
            url: this.url.toJSON(),
            options: this.options,
            body: this.body,
        };
    }
}

module.exports = HOSRequest;
