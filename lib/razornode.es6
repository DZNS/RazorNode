var Q = require("q");

var url   = require('url');
var API   = require("./api");
var _     = require("underscore");

class RazorNode extends API {

    constructor(key, secret) {

        super("https://api.razorpay.com");

        var self = this;

        self.key = key;
        self.secret = secret;

        self.basicAuth = [key, secret].join(":");

        self.requestModifier = options => {

            var headers = {
                "Accept" : "application/json",
                "Authorization": "Basic " + new Buffer(self.basicAuth).toString('base64')
            }

            if(options.headers)
                options.headers = _.extend(options.headers, headers);
            else
                options.headers = headers;

            options.path = `/v1${options.path}`;

            // uncomment this line to enable logging of all requests going out to the API. Do no uncomment in production code unless you're absolutely sure you know what you're doing.
            // console.log(`requesting: ${options.method}:${options.uri}\n`, options);
            return options;

        }

    }

    getPayments(from, to, count=10, skip=0) {

        if(!from || !from.toString().length) {
            throw new Error(`An invalid or no "from" timestamp was passed`);
            return;
        }

        if(!to || !to.toString().length) {
            throw new Error(`An invalid or no "to" timestamp was passed`);
            return;
        }

        if(_.isString(from))
            from = +new Date(from);

        if(_.isString(to))
            to = +new Date(to);

        count = parseInt(count);
        skip  = parseInt(skip);

        return this.get(`/payments`, {
            from,
            to,
            count,
            skip
        });

    }

    getPayment(paymentID) {

        if(!paymentID || !paymentID.length) {
            throw new Error("An invalid or no paymentID was passed");
            return;
        }

        return this.get(`/payments/${paymentID}`);

    }

    capturePayment(paymentID, amount) {

        if(!paymentID || !paymentID.length) {
            throw new Error("An invalid or no paymentID was passed");
            return;
        }

        if(!amount || !amount.toString().length) {
            throw new Error("An invalid or no amount was passed");
            return;
        }

        if(_.isNumber(amount))
            amount = amount.toString();

        return this.post(`/payments/${paymentID}/capture`, undefined, {
            amount
        });

    }

    refundPayment(paymentID, amount) {

        if(!paymentID || !paymentID.length) {
            throw new Error("An invalid or no paymentID was passed");
            return;
        }

        if(!amount || !amount.toString().length) {
            throw new Error("An invalid or no amount was passed");
            return;
        }

        if(_.isNumber(amount))
            amount = amount.toString();

        return this.post(`/payments/${paymentID}/refund`, undefined, {
            amount
        });

    }

    getRefunds(paymentID, from, to, count=10, skip=0) {

        if(!paymentID || !paymentID.length) {
            throw new Error("An invalid or no paymentID was passed");
            return;
        }

        if(!from || !from.toString().length) {
            throw new Error(`An invalid or no "from" timestamp was passed`);
            return;
        }

        if(!to || !to.toString().length) {
            throw new Error(`An invalid or no "to" timestamp was passed`);
            return;
        }

        if(_.isString(from))
            from = +new Date(from);

        if(_.isString(to))
            to = +new Date(to);

        return this.get(`/payments/${paymentID}/refunds`, {
            from,
            to,
            count,
            skip
        });

    }

    getRefund(paymentID, refundID) {

        if(!paymentID || !paymentID.length) {
            throw new Error("An invalid or no paymentID was passed");
            return;
        }

        if(!refundID || !refundID.length) {
            throw new Error("An invalid or no refundID was passed");
            return;
        }

        return this.get(`/payments/${paymentID}/refunds/${refundID}`);

    }

}

export default RazorNode;