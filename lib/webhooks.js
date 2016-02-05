"use strict";

const EventEmitter = require('events')
const util = require('util')

class RazorHook {

    constructor(args) {

        var handler = args.app
        var route = args.route
        
        if(handler.prototype !== EventEmitter.prototype)
            throw new Error("The argument passed to RazorHook should be an app's instance than can handle routing.")

        if(!route) {
            console.warn("A default route for RazorHook wasn't specified. Using '/razornode' instead.")
            route = "/razornode"
        }

        this.app = handler
        this.route = route

        this.init()

    }

    init() {

        var self = this

        if(self.initialized)
            return

        self.initialized = true

        self.app.post(self.route, self.handler.bind(self))

    }

    handler(req, res) {

        var self = this

        if(req.body.event == "payment.authorized")
            self.emit("authorized", {
                rawData: req.body,
                payment: req.body.payload.payment.entity
            })

        res.end()

    }

}

util.inherits(RazorHook, EventEmitter);

module.exports = RazorHook