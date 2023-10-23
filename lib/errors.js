
/**
 * Error for HTTP requests timing out
 *
 * @extends Error
 */
class HTTPTimeoutError extends Error {}

/**
 * Error for wrapping all failures for message transport across the wire
 *
 * @extends Error
 */
class TransportError extends Error {}

/**
 * Error for wrapping all failures of the HTTP request
 *
 * @extends Error
 */
class HOSError extends Error {}

/**
 * Class for serializing HOSErrors over the wire, preserving stack trace
 */
class HOSErrorResponse {
    constructor(err_json) {
        this.err_json = err_json;
    }

    static new(err) {
        const obj = {};
        for ( const key of Object.getOwnPropertyNames(err) ) {
            obj[key] = err[key];
        }
        obj.remoteType = err.constructor.name;
        return new this(obj);
    }
    static parse(obj) {
        return new this(obj);
    }

    toJSON() {
        return this.err_json;
    }

    error() {
        const err = new HOSError();
        const remote_stack = this.err_json.stack;
        const local_stack = err.stack;
        for ( const key of Object.keys(this.err_json) ) {
            err[key] = this.err_json[key];
        }

        err.stack = `\n${remote_stack}\n    ∧∧∧ --- Remote\n    ∨∨∨ --- Local\n${local_stack.split("\n").slice(1).join("\n")}`;
        return err;
    }
}

module.exports = {
    HTTPTimeoutError,
    TransportError,
    HOSError,
    HOSErrorResponse,
};
