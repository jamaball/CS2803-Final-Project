const express = require("express");
const res = require("express/lib/response");
const { json } = require("express/lib/response");
const bcrypt = require("bcryptjs")// for hashing passwords
const costFactor = 10; // used for the alt
let authenticated = false; // used to see if user is logged in

// let's make a connection to our mysql server
const mysql = require("mysql2")

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "R8qfgauzu",
    database: "CS2803"
})

conn.connect(function(err){
    if(err){
        console.log("Error:", err);
    }else{
        console.log("Connection established.")
    }
})

// app will be our express instance
const app = express();
username="ronnie"
password="12345"

// Serve static files from the public dir
// if you do not include this, then navigation to the localhost will not show anything
app.use(express.static("public")); // will use the index.html file

// the following is a route
// serve home page
// note that our callback function is anonymous here
app.get("/registration", function(req, res){
    res.sendFile(__dirname + "/public/" + "registration.html");
})


// recall that the login information was passed as a parameter in xhr.send() as a POST request
// the middleware function express.urlencoded must be used for POST requests
// the data will be in the req.body object
app.use(express.urlencoded({extended:false}));

app.post("/register", function(req, res){
            // we check to see if username is available
            usernameQuery = "Select username from registeredUsers where username  = ?"
            conn.query(usernameQuery, [req.body.username], function(err, rows){ 
                if(err){
                    res.json({success: false, message: "server error"})
                }
                // we check to see if the username is already taken
                if (rows.length >0){
                    res.json({success: false, message: "username taken"})
                }
                // if it isn't, we insert the user into database
                else{
                    // we create a password hash before storing the password
                    passwordHash = bcrypt.hashSync(req.body.password, costFactor);
                    insertUser = "insert into registeredUsers values(?, ?)"
                    conn.query(insertUser, [req.body.username, passwordHash], function(err, rows){
                        if (err){
                            res.json({success: false, message: "server error"})
                        }
                        else{
                            res.json({success: true, message: "user registered"})
                        }
                    })
                }
            });
})

// post to route "attempt login"
app.post("/attempt_login", function(req, res){
    // we check for the username and password to match.
    conn.query("select password from registeredusers where username = ?", [req.body.username], function (err, rows){
        if(err){
            res.json({success: false, message: "user doesn't exists"});
        }else{
            storedPassword = rows[0].password // rows is an array of objects e.g.: [ { password: '12345' } ]
            // bcrypt.compareSync let's us compare the plaintext password to the hashed password we stored in our database
            if (bcrypt.compareSync(req.body.password, storedPassword)){
                authenticated = true;
                res.json({success: true, message: "logged in"})
            }else{
                res.json({success: false, message:"password is incorrect"})
            }
        }
    })  
})

// if the user navigates to localhost:3000/main, then the main page will be loaded.
app.get("/main", function(req, res){
    if(authenticated){
        res.sendFile(__dirname + "/public/" + "main.html");
    }else{
        res.send("<p>not logged in <p><a href='/'>login page</a>")
    }
    
})

// Start the web server
// 3000 is the port #
// followed by a callback function
app.listen(3000, function() {
   console.log("Listening on port 3000...");
});