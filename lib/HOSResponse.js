

class HOSResponse {
    constructor({
        statusCode,
        statusMessage,
        headers={},
        complete,
        body=undefined,
    }) {
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
        this.headers = headers;
        this.complete = complete;
        this.body = body;
    }

    static new(obj) { return new this(obj); }
    static parse(obj) { return new this(obj); }

    get ok() { return this.statusCode < 300; }
}

module.exports = HOSResponse;
