
class HOSRequest {
    constructor({
        url,
        options={},
        body=undefined,
    }={}) {
        this.url = url;
        this.options = options;
        this.body = body;
    }

    static parse({ url, options={}, body }) {
        return new this({
            url: new URL(url),
            options: options,
            body: body
        });
    }
    static new(url, options, body) {
        return new this({
            url: url,
            options: options,
            body: body,
        });
    }

    toJSON() {
        return {
            url: this.url.toJSON(),
            options: this.options,
            body: this.body,
        };
    }
}

module.exports = HOSRequest;
