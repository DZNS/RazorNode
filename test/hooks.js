
var razorHook = require("../").razorHook
var assert    = require("assert")
var EventEmitter = require("events")
var util = require("util")

var app = new Object();
app.prototype = EventEmitter.prototype
app.post = (path, cb) => {}

describe('RazorHook', function() {

    describe('initialize', function () {

        it("throws error for not specifying an app", function(done) {

            assert.throws(function() {
                return new razorHook()
            }, Error);

            done()

        })

        it('sets a default route when not provided', function(done) {

            var instance = new razorHook({app})
            if(instance.route === "/razornode")
                done()
            else
                throw new Error("default route did not match")

        })

    })

})
