"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EventEmitter = require('events');
var util = require('util');

var RazorHook = (function () {
    function RazorHook(args) {
        _classCallCheck(this, RazorHook);

        var handler = args.app;
        var route = args.route;

        if (!handler.constructor.EventEmitter) throw new Error("The argument passed to RazorHook should be an app's instance.");

        this.app = handler;
        this.route = route;

        this.init();
    }

    _createClass(RazorHook, [{
        key: 'init',
        value: function init() {

            var self = this;

            if (self.initialized) return;

            self.initialized = true;

            self.app.post(self.route, self.handler.bind(self));
        }
    }, {
        key: 'handler',
        value: function handler(req, res) {

            var self = this;

            if (req.body.event == "payment.authorized") self.emit("authorized", {
                rawData: req.body,
                payment: req.body.payload.payment.entity
            });

            res.end();
        }
    }]);

    return RazorHook;
})();

util.inherits(RazorHook, EventEmitter);

module.exports = RazorHook;