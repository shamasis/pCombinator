/**
 * @constructor
 * @param {array} stream
 */
var Lex = function (stream) {
    this.stream = stream;

    this.pos = 0;
    this.line = 0;
    this.col = 0;
    this.lastToken = null;
    this.skipWhiteSpaces();

    return this;
};

Lex.prototype = /** @lends Lex.prototype */ {
	constructor: Lex,

    skipWhiteSpaces: function () {
        var c;

        while (this.pos < this.stream.length) {
            c = this.stream.charAt(this.pos);
            if (c == ' ' || c == '\t' || c == '\r' || c == '\n') {
                if (c == '\n') {
                    this.line++;
                    this.col = 0;
                }
                this.pos++;
            }
            else {
                break;
            }
        }
        return this;
    },

    advance: function (by) {
        this.pos += (by || 1);
        this.skipWhiteSpaces();
        return this;
    },

    matchFromList: function (list) {
        var remaining = this.stream.slice(this.pos),
            result = false,

            i;

        for (i = 0; i < list.length; i++) {
            if (remaining.substr(0, list[i].length) == list[i]) {
                result = list[i];
                break;
            }
        }

        return result;
    },

    getToken: function () {
        this.lastToken = null;

        if (this.pos < this.stream.length) {
            this.lastToken = this.stream.charAt(this.pos);
        }

        return this.lastToken;
    },

    beginsWith: function (rx) {
        var match = this.stream.slice(this.pos).match(rx);
        return (match && match[0]) || false;
    },

    getPos: function () {
        return this.pos;
    }
};

module.exports = {
	Lex: Lex
};
