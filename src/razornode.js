"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x5, _x6, _x7) { var _again = true; _function: while (_again) { var object = _x5, property = _x6, receiver = _x7; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x5 = parent; _x6 = property; _x7 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Q = require("q");

var url = require('url');
var API = require("./api");
var _ = require("underscore");

var RazorNode = (function (_API) {
    _inherits(RazorNode, _API);

    function RazorNode(key, secret) {
        _classCallCheck(this, RazorNode);

        _get(Object.getPrototypeOf(RazorNode.prototype), "constructor", this).call(this, "https://api.razorpay.com");

        var self = this;

        self.key = key;
        self.secret = secret;

        self.basicAuth = [key, secret].join(":");

        self.requestModifier = function (options) {

            var headers = {
                "Accept": "application/json",
                "Authorization": "Basic " + new Buffer(self.basicAuth).toString('base64')
            };

            if (options.headers) options.headers = _.extend(options.headers, headers);else options.headers = headers;

            options.path = "/v1" + options.path;

            console.log("requesting: " + options.method + ":" + options.uri + "\n", options);
            return options;
        };
    }

    _createClass(RazorNode, [{
        key: "getPayments",
        value: function getPayments(from, to) {
            var count = arguments.length <= 2 || arguments[2] === undefined ? 10 : arguments[2];
            var skip = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];

            if (!from || !from.toString().length) {
                throw new Error("An invalid or no \"from\" timestamp was passed");
                return;
            }

            if (!to || !to.toString().length) {
                throw new Error("An invalid or no \"to\" timestamp was passed");
                return;
            }

            if (_.isString(from)) from = +new Date(from);

            if (_.isString(to)) to = +new Date(to);

            count = parseInt(count);
            skip = parseInt(skip);

            return this.get("/payments", {
                from: from,
                to: to,
                count: count,
                skip: skip
            });
        }
    }, {
        key: "getPayment",
        value: function getPayment(paymentID) {

            if (!paymentID || !paymentID.length) {
                throw new Error("An invalid or no paymentID was passed");
                return;
            }

            return this.get("/payments/" + paymentID);
        }
    }, {
        key: "capturePayment",
        value: function capturePayment(paymentID, amount) {

            if (!paymentID || !paymentID.length) {
                throw new Error("An invalid or no paymentID was passed");
                return;
            }

            if (!amount || !amount.toString().length) {
                throw new Error("An invalid or no amount was passed");
                return;
            }

            if (_.isNumber(amount)) amount = amount.toString();

            return this.post("/payments/" + paymentID + "/capture", undefined, {
                amount: amount
            });
        }
    }, {
        key: "refundPayment",
        value: function refundPayment(paymentID, amount) {

            if (!paymentID || !paymentID.length) {
                throw new Error("An invalid or no paymentID was passed");
                return;
            }

            if (!amount || !amount.toString().length) {
                throw new Error("An invalid or no amount was passed");
                return;
            }

            if (_.isNumber(amount)) amount = amount.toString();

            return this.post("/payments/" + paymentID + "/refund", undefined, {
                amount: amount
            });
        }
    }, {
        key: "getRefunds",
        value: function getRefunds(paymentID, from, to) {
            var count = arguments.length <= 3 || arguments[3] === undefined ? 10 : arguments[3];
            var skip = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];

            if (!paymentID || !paymentID.length) {
                throw new Error("An invalid or no paymentID was passed");
                return;
            }

            if (!from || !from.toString().length) {
                throw new Error("An invalid or no \"from\" timestamp was passed");
                return;
            }

            if (!to || !to.toString().length) {
                throw new Error("An invalid or no \"to\" timestamp was passed");
                return;
            }

            if (_.isString(from)) from = +new Date(from);

            if (_.isString(to)) to = +new Date(to);

            return this.get("/payments/" + paymentID + "/refunds", {
                from: from,
                to: to,
                count: count,
                skip: skip
            });
        }
    }, {
        key: "getRefund",
        value: function getRefund(paymentID, refundID) {

            if (!paymentID || !paymentID.length) {
                throw new Error("An invalid or no paymentID was passed");
                return;
            }

            if (!refundID || !refundID.length) {
                throw new Error("An invalid or no refundID was passed");
                return;
            }

            return this.get("/payments/" + paymentID + "/refunds/" + refundID);
        }
    }]);

    return RazorNode;
})(API);

exports["default"] = RazorNode;
module.exports = exports["default"];