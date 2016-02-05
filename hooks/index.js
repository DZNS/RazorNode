var express   = require('express')
var app       = express()
var razorHook = require(__dirname+"/../lib/webhooks.es6")
var bodyParser = require('body-parser');

// these line is important. Include it before setting up the webhook handler.
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// webhooks handler
{

    var hooks = new razorHook({
        app: app,
        route: "/razornode"
    })

    hooks.on("authorized", (evt) => {

        var rawData = evt.rawData
        var payment = evt.payment
        
        console.log("new payment authorized", payment)

    })

}

app.get('/', (req, res) => {

    res.send('Hello World!')

});

app.listen(3000, () => {

    console.log('Example app listening on port 3000!')

})