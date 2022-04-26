const express = require("express");
const { json } = require("express/lib/response");

// app will be our express instance
const app = express();
let username = "ronnie"
let password = "12345"

// Serve static files from the public dir
// if you do not include this, then navigation to the localhost will not show anything
app.use(express.static("public")); // will use the index.html file

// the following is a route
// serve home page
// note that our callback function is anonymous here
app.get("/registration", function(req, res){
    res.sendFile(__dirname + "/public/" + "registration.html");
})


// if you build your own middleware function, then you have to supply next() for the next middleware function or the get method to run
const logRequest = function(req, res, next){
    console.log(req.query)
    console.log(`Request: ${req}`)
    next() // definitely include this
}
// in order to use a middleware function, we pass it as a parameter in app.use()
app.use(logRequest)

// recall that the login information was passed as a parameter in xhr.send() as a POST request
// the middleware function express.urlencoded must be used for POST requests
// the data will be in the req.body object
app.use(express.urlencoded({extended:false}));

// post to route "attempt login"
app.post("/attempt_login", function(req, res){
    // we check for the username and password to match.
    if (req.body.username === username && req.body.password === password){
        res.json({success: true})
    }else{
        res.json({success: false});
    }    
})

// if the user navigates to localhost:3000/main, then the main page will be loaded.
app.get("/main", function(req, res){
    res.sendFile(__dirname + "/public/" + "main.html");
})

// Start the web server
// 3000 is the port #
// followed by a callback function
app.listen(3000, function() {
   console.log("Listening on port 3000...");
});