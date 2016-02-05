/**
 * ⚠️⚠️⚠️⚠️⚠️ WARNING ⚠️⚠️⚠️⚠️⚠️
 * Do not use production keys when testing. This could cause irreversible damage. We, Dezine Zync Studios, will not responsible for any loss of data, money and unicorns.
 *
 * When running the entire test suite, always create a new payment ready to be captured, whose amount is higher than Rs. 50/-
 * 
 * All information inside the test file comes from your environment variables.
 * rzKey: Razor Pay Key (Sandbox, do not use production key)
 * rzSecret: Razor Pay Secret (Sandbox, do not use production secret)
 * paymentID: A paymentID which can be captured by the test
 * refundID: Generated below. Either capture it and rerun the tests.
 */


var assert    = require("assert");
var razorNode = require("../").razorNode;
var instance  = new razorNode(process.env.rzKey, process.env.rzSecret);

var aPayment = process.env.paymentID;
var aRefund;

describe('RazorNode', function() {

    describe('getPayments', function () {

        it("throws error for not specifying end date", function(done) {

            assert.throws(function() {
                return instance.getPayments("2015-09-20")
            }, Error);

            done()

        })

        it('fetch payments', function(done) {

            instance.getPayments("2015-09-01", "2015-09-30")
            .then(function (result) {
                done()
            })

        })

    })

    describe('getPayment', function() {

        it("throws error for not specifying paymentID", function() {

            assert.throws(function() {
                return instance.getPayment()
            }, Error);

        })

        it("fetch payment by it's ID", function() {

            instance.getPayment(aPayment)
            .then(function(result) {
                done()
            })

        })

    })

    describe('capturePayment', function() {

        it('throws error for not specifying paymentID', function() {

            assert.throws(function() {
                return instance.capturePayment();
            }, Error)

        })

        it('throws error for not specifying amount', function() {
            assert.throws(function() {
                return instance.capturePayment(aPayment);
            }, Error)
        })

        // it('captures payment by it\'s ID and amount', function(done) {

        //     instance.capturePayment(aPayment, 180000)
        //     .then(function (result) {
        //         done()
        //     })

        // })

    })

    describe('refundPayment', function() {

        it('throws error for not specifying paymentID', function() {

            assert.throws(function() {
                return instance.refundPayment();
            }, Error)

        })

        it('throws error for not specifying amount', function() {
            assert.throws(function() {
                return instance.refundPayment(aPayment);
            }, Error)
        })

        // enable with caution.
        it('refunds a payment by it\'s paymentID and defined amount', function(done) {

            instance.refundPayment(aPayment, 3000)
            .then(function(result) {
                aRefund = result.responseObject.id;
                done()
            })

        })

    })

    describe('getRefunds', function() {

        it('throws error for not specifying paymentID', function() {

            assert.throws(function() {
                return instance.getRefunds();
            }, Error)

        })

        it('throws error for not specifying from time', function() {

            assert.throws(function() {
                return instance.getRefunds(aPayment);
            }, Error)

        })

        it('throws error for not specifying to time', function() {

            assert.throws(function() {
                return instance.getRefunds(aPayment, "2015-09-01");
            }, Error)

        })

        it('retrives list of refunds for a specified paymentID', function(done) {

            instance.getRefunds(aPayment, "2015-09-01", "2015-09-30")
            .then(function(result) {

                done()

            })

        })

    })

    describe('getRefund', function() {

        it('throws error for not specifying paymentID', function() {

            assert.throws(function() {
                return instance.getRefund();
            }, Error)

        })

        it('throws error for not specifying refundID', function() {

            assert.throws(function() {
                return instance.getRefund(aPayment);
            }, Error)

        })

        it('retrives information of the specified refundID', function(done) {

            instance.getRefund(aPayment, aRefund)
            .then(function(result) {

                done()

            })

        })

    })

})

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
