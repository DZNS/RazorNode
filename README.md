# RazorNode
A dependancy free NodeJS SDK and Webhooks Handler for RazorPay's API

<img src="https://api.travis-ci.org/DZNS/RazorNode.svg" />
--
[![NPM](https://nodei.co/npm/razornode.png)](https://npmjs.org/package/razornode)
--

RazorNode is a NodeJS SDK for [RazorPay][1]. It focuses on being simple, extensible and thoroughly tested. It internally uses Promises to allow for a robust asynchornous code that doesn't 🍲 up. 

### Install all the Razors

To install, simply run  
````bash
npm install razornode
````

To start using RazorNode, simply create a new instance and get started:
````javascript
var razorNode = require("razornode").razorNode;
var instance  = new razorNode(process.env.rzKey, process.env.rzSecret);

instance.getPayments("2015-09-01", "2015-09-30")
.then(function (result) {
    //result has two keys
    //result.response has the response body 
    //result.responseObject has the parsed JSON
})

````  
As you can see, we're pulling in the key and secret of your RazorPay account from the environment variables. You're free to set things up as per your preference, but this seems to be the recommended way (by some Javascript Dude, so don't quote me on it 😉)

-- 
RazorPay recently announced webhooks support which is currently in BETA. At the moment, only one event is supported. As new events become supported, I'll update RazorNode.

At the moment, only the "authorized" event is supported. Visit https://dashboard.razorpay.com/#/app/webhooks to setup your webhooks.

To use the webhooks handler, simply create a new instance of razorHook (currently only supported in ExpressJS apps)
```javascript
var razorNode = require("razornode").razorNode;
var hooks = new razorHook({
    app: app,
    route: "/razornode"
})

hooks.on("authorized", (evt) => {

    var rawData = evt.rawData
    var payment = evt.payment
    
    console.log("new payment authorized", payment)

}) 
```

View `./hooks/` for a complete working example of an express app.  

--  
Want to test it? 
*Please read the header of the test file located at `./test/test.js` before running the tests.*

If you don't have Mocha installed
````bash
npm install -g mocha
````

Then simply run
````bash
npm run test-local
````

### Supported API Endpoints
| METHOD | API | Param Checking  | Supported |
|---|---|---|---|
|GET|/payments|✅|✅|
|GET|/payments/:paymentID|✅|✅|
|POST|/payments/:paymentID/capture|✅|✅|
|POST|/payments/:paymentID/refund|✅|✅|
|GET|/payments/:paymentID/refunds|✅|✅|
|GET|/payments/:paymentID/refunds/:refundID|✅|✅|

APIs listed in the [docs][2]: 6  
APIs supported by RazorNode: 6

### Author's Notes
- ~~RazorNode is written in ES6. It's currently transpiled into ES5 for supporting `0.12.x`. At some point, I'll remove the transpiled files from the repo and change things to use the ES6 files. However, if you'd like to keep using transpiled versions, simply install the `babel-cli` and run `npm run build`.~~
- RazorNode is now completely based on the ES6 syntax. NodeJS 5.x is recommended.
- RazorNode is a 3rd party implementation. I'm a RazorPay customer. I do not work for or at RazorPay and I'm in no way affiliated with them. 

### Feature Requests, Issues & Pull Requests
- If you'd like to implement new things or tackle todos, please fork, edit and send a pull request. Everytime you help me tick off a todo, you earn a 🍪 point.
- If you'd like to request a new feature, open a new issue and tag it appropriately.
- If you'd like to discuss something else, please search the issues section before you create a new one. If you do so, please tag is appropriately.
- If you're using the Issues section, remember to be nice. You earn a 🍪 point everytime you do. 
- Please avoid directly emailing me or any of my colleagues asking when things will progress. We work on Open-source projects as time permits. So I request you to be patient with us. 

### Todos
- [x] Use native `Promise`  
- [x] get rid of all dependencies  

### License
RazorPay is licensed under the MIT License. Please refer to the LICENSE file for more information.

[1]: https://razorpay.com/
[2]: https://docs.razorpay.com/docs/payments
