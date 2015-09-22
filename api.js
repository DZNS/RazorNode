"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var https = require('https');
var Q = require("q");
var URL = require("url");
var crypto = require("crypto");
var querystring = require("querystring");
var _ = require("underscore");

var API = (function () {
    function API(baseURL) {
        _classCallCheck(this, API);

        var self = this;

        self.baseURL = baseURL;

        self.parsedURL = URL.parse(self.baseURL);

        self.maxValidHTTPStatusCode = 399; // the maximum "success" status code. All status codes above this value will be treated as an error. Do not set a value for 304 or below for sanity purposes.

        self.cacheEnabled = false; //if true, Etags will be used for checking unmodified responses and instead use a cached response.
        self.cacheClient = undefined; //if cacheEnabled is true and this is undefined, caching will not work.

        self.requestModifier = undefined; //if set, this function will be called with the request options parameter before it is sent out. Feel free to modify the URI or Headers before the request is made. It's good practice not the modify the host and port options, as well as the method. If you set the wrong values, the request will obviously fail.

        self.basicAuth = undefined;
    }

    _createClass(API, [{
        key: "md5",
        value: function md5(string) {
            return crypto.createHash('md5').update(string).digest('hex').toString();
        }

        //convinience HTTP instance methods
    }, {
        key: "get",
        value: function get(uri, params) {

            var self = this;
            var deferred = Q.defer();

            var query = querystring.stringify(params || {});
            uri = API.path(uri, query.length ? "?" + query : "");

            var md5URI = self.md5(uri);

            function makeReq(etag, cachedRes) {

                var options = {
                    hostname: self.parsedURL.hostname,
                    port: self.parsedURL.port,
                    path: uri,
                    method: 'GET',
                    headers: {}
                };

                if (etag) {
                    options.headers = _.extend(options.headers, {
                        "If-None-Match": etag || ""
                    });
                }

                if (self.requestModifier) {

                    options = _.extend(options, {
                        uri: uri
                    });

                    options = self.requestModifier(options);

                    if (options.uri !== uri) {
                        uri = options.uri;
                    }

                    delete options[uri];
                }

                var req = https.request(options, function (result) {

                    var responseData = "";

                    result.on("data", function (chunk) {
                        responseData += chunk.toString("utf8");
                    });

                    result.on("end", function () {

                        if (result.statusCode == 304 && etag) {

                            console.log("returning cached request for ", uri);

                            // Etag was passed, matched. Send cached response
                            deferred.resolve(JSON.parse(cachedRes));

                            return;
                        } else {

                            self.responseParser(result, responseData).then(function (res) {

                                if (result.headers.etag && self.cacheEnabled && self.cacheClient) {

                                    self.cacheClient.set("etag:" + md5URI, result.headers.etag);
                                    self.cacheClient.setex("res:" + md5URI, 3600, JSON.stringify(res), console.log);
                                }

                                deferred.resolve(res);
                            })["catch"](deferred.reject);
                        }
                    });
                });

                req.on("error", deferred.reject);
                req.end();
            }

            if (self.cacheEnabled && self.cacheClient) {

                self.cacheClient.mget("etag:" + md5URI, "res:" + md5URI).then(function (values) {

                    values = values.filter(function (item) {
                        return item != null && item != undefined;
                    });

                    if (values.length == 2) makeReq(values[0], values[1]);else makeReq();
                })["catch"](function (err) {

                    makeReq();
                });
            } else {

                makeReq();
            }

            return deferred.promise;
        }

        /**
         * Trigger request with HTTP Post Method
         * @param  {String} uri         The URI to post to.
         * @param  {Object} params      The HTTPBody parameters. Expected in key-value format.
         * @param  {Object} queryParams If you need to send any query params
         * @param  {String} type        The default option is `form` a.k.a. `formdata`. Valid: form | json
         * @return {Promise}            The promise resolves with a {} Object
         */
    }, {
        key: "post",
        value: function post(uri, params, queryParams) {
            var type = arguments.length <= 3 || arguments[3] === undefined ? "form" : arguments[3];

            var self = this;
            var deferred = Q.defer();

            if (queryParams) {
                uri += "?" + querystring.stringify(queryParams);
            }

            var bodyData = undefined;

            if (type === "form") {
                bodyData = querystring.stringify(params);
            } else {
                bodyData = JSON.stringify(params);
            }

            var options = {
                hostname: self.parsedURL.hostname,
                port: self.parsedURL.port,
                path: uri,
                method: 'POST',
                headers: {
                    'Content-Type': type == "form" ? 'application/x-www-form-urlencoded' : 'application/json',
                    'Content-Length': bodyData.length
                }
            };

            if (self.requestModifier) {
                options = self.requestModifier(options);
            }

            var req = https.request(options, function (result) {

                var responseData = "";

                result.on("data", function (chunk) {
                    responseData += chunk.toString("utf8");
                });

                result.on("end", function () {

                    self.responseParser(result, responseData).then(deferred.resolve)["catch"](deferred.reject);
                });
            });

            req.on('error', function (e) {
                deferred.reject(e);
            });

            req.end(bodyData);

            return deferred.promise;
        }

        /**
         * Trigger request with HTTP Post Method
         * @param  {String} uri         The URI to post to.
         * @param  {Object} params      The HTTPBody parameters. Expected in key-value format.
         * @param  {Object} queryParams If you need to send any query params
         * @param  {String} type        The default option is `form` a.k.a. `formdata`. Valid: form | json
         * @return {Promise}            The promise resolves with a {} Object
         */
    }, {
        key: "put",
        value: function put(uri, params, queryParams) {
            var type = arguments.length <= 3 || arguments[3] === undefined ? "form" : arguments[3];

            var self = this;
            var deferred = Q.defer();

            if (queryParams) {
                uri += "?" + querystring.stringify(queryParams);
            }

            var bodyData = undefined;

            if (type === "form") {
                bodyData = querystring.stringify(params);
            } else {
                bodyData = JSON.stringify(params);
            }

            var options = {
                hostname: self.parsedURL.hostname,
                port: self.parsedURL.port,
                path: uri,
                method: 'PUT',
                headers: {
                    'Content-Type': type == "form" ? 'application/x-www-form-urlencoded' : 'application/json',
                    'Content-Length': bodyData.length
                }
            };

            if (self.requestModifier) {
                options = self.requestModifier(options);
            }

            var req = https.request(options, function (result) {

                var responseData = "";

                result.on("data", function (chunk) {
                    responseData += chunk.toString("utf8");
                });

                result.on("end", function () {

                    self.responseParser(result, responseData).then(deferred.resolve)["catch"](deferred.reject);
                });
            });

            req.on('error', function (e) {
                deferred.reject(e);
            });

            req.end(bodyData);

            return deferred.promise;
        }

        /**
         * Trigger request with HTTP Delete Method
         * @param  {String} uri         The URI to post to.
         * @param  {Object} params      The HTTPBody parameters. Expected in key-value format.
         * @param  {Object} queryParams If you need to send any query params
         * @return {Promise}            The promise resolves with a {} Object
         */
    }, {
        key: "delete",
        value: function _delete(uri, params, queryParams) {
            var type = arguments.length <= 3 || arguments[3] === undefined ? "form" : arguments[3];

            var self = this;
            var deferred = Q.defer();

            if (queryParams) {
                uri += "?" + querystring.stringify(queryParams);
            }

            var bodyData = undefined;

            if (type === "form") {
                bodyData = querystring.stringify(params);
            } else {
                bodyData = JSON.stringify(params);
            }

            var options = {
                hostname: self.parsedURL.hostname,
                port: self.parsedURL.port,
                path: uri,
                method: 'DELETE',
                headers: {
                    'Content-Type': type == "form" ? 'application/x-www-form-urlencoded' : 'application/json',
                    'Content-Length': bodyData.length
                }
            };

            if (self.requestModifier) {
                options = self.requestModifier(options);
            }

            var req = https.request(options, function (result) {

                var responseData = "";

                result.on("data", function (chunk) {
                    responseData += chunk.toString("utf8");
                });

                result.on("end", function () {

                    self.responseParser(result, responseData).then(deferred.resolve)["catch"](deferred.reject);
                });
            });

            req.on('error', function (e) {
                deferred.reject(e);
            });

            req.end(bodyData);

            return deferred.promise;
        }
    }, {
        key: "responseParser",
        value: function responseParser(result, responseData) {

            var self = this;

            return Q.promise(function (resolve, reject) {

                var responseString = responseData;

                var responseObject = undefined;

                try {
                    responseObject = JSON.parse(responseString);
                } catch (exc) {
                    console.warn(exc);
                }

                // Check response code.
                if (result.statusCode > self.maxValidHTTPStatusCode) {

                    var err = new Error();
                    err.message = responseObject ? responseObject.status || responseObject.message : "An unknown network error occured.";
                    err.HTTPHeaders = result.headers;
                    err.responseObject = responseObject;
                    err.responseString = responseString;

                    reject(err);
                }

                resolve({
                    responseString: responseString,
                    responseObject: responseObject
                });
            });
        }

        //static methods
    }], [{
        key: "path",
        value: function path() {

            var items = arguments && arguments.length ? [].slice.call(arguments) : [];

            items = items.map(function (item, idx) {
                if (idx == 0) return item;
                if (item.length && item.charAt(0) == "/") return item;else if (item.length) return "/" + item;
            });

            return items.join("");
        }
    }]);

    return API;
})();

exports["default"] = API;
module.exports = exports["default"];