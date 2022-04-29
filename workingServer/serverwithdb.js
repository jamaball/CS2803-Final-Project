const express = require("express");
const res = require("express/lib/response");
const { json } = require("express/lib/response");
const bcrypt = require("bcryptjs") // for hashing passwords
const costFactor = 10; // used for the alt
let authenticated = false; // used to see if user is logged in
let session = {
    "username": "",
    "online": false
};

// let's make a connection to our mysql server
const mysql = require("mysql2");

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "cheese",
    database: "eventdata",
    port: "3306"

});

conn.connect(function(err) {
    if (err) {
        console.log("Error:", err);
    } else {
        console.log("Connection established.");
    }
});

// app will be our express instance
const app = express();
username = "ronnie"
password = "12345"

// Serve static files from the public dir
// if you do not include this, then navigation to the localhost will not show anything
app.use(express.static("public")); // will use the index.html file

// the following is a route
// serve home page
// note that our callback function is anonymous here
app.get("/registration", function(req, res) {
    res.sendFile(__dirname + "/public/" + "registration.html");
})


// recall that the login information was passed as a parameter in xhr.send() as a POST request
// the middleware function express.urlencoded must be used for POST requests
// the data will be in the req.body object
app.use(express.urlencoded({ extended: false }));

app.post("/register", function(req, res) {
    // we check to see if username is available
    usernameQuery = "Select user from eventdata.registeredUsers where user  = ?"
    conn.query(usernameQuery, [req.body.username], function(err, rows) {
        if (err) {
            res.json({ success: false, message: "server error" })
        }
        // we check to see if the username is already taken
        if (rows.length > 0) {
            res.json({ success: false, message: "username taken" })
        }
        // // if it isn't, we insert the user into database
        else {
            // we create a password hash before storing the password
            passwordHash = bcrypt.hashSync(req.body.password, costFactor);
            // let events = { "events": [{"date": "today", "category": "school", "percent": "50"}] };
            // const obj = JSON.stringify(events);
            insertUser = "insert into eventdata.registeredUsers values (?, ?)";
            conn.query(insertUser, [req.body.username, passwordHash], function(err, rows) {
                if (err) {
                    res.json({ success: false, message: "second part" })
                } else {
                    res.json({ success: true, message: "user registered" })
                }
            })
        }
    })
});
// post event data
app.post("/add_event", function(req, res) {
    var date = new Date().toISOString().slice(0, 10)
    var dateFactor = dateDistance(date, req.body.date);
    const addedEvent = {
        "category": req.body.cat,
        "assignment": req.body.assign,
        "percent": req.body.percent,
        "hours": req.body.workHours,
        "description": req.body.desc,
        "date": req.body.date,
        "untildate": dateFactor
    };
    usernameQuery = "Select userevents from eventdata.userdata where username  = ?"
    conn.query(usernameQuery, session.username, function(err, rows) {
        if (err) {
            res.json({ success: false, message: "server error here" })
        }
        // If userdata has no entry, create and insert
        if (rows.length == 0 || rows[0].userevents === null) {
            console.log("executed")
            let obj = [];
            obj[0] = addedEvent;
            const jsonObj = {
                events: obj
            };
            let stringObj = JSON.stringify(jsonObj);
            console.log(stringObj);
            let eventQuery = "insert into eventdata.userdata values (?, ?)";
            console.log(eventQuery);
            conn.query(eventQuery, [session.username, stringObj], function(err, rows) {
                    if (err) {
                        console.log(rows)
                        res.json({ success: false, message: "server error" })
                    } else {
                        res.json({ success: true, messsage: "event added" })
                    }
                })
                // If userdata has an entry already, pull and add event
                // add sort here
        } else {
            let obj = rows[0].userevents.events;
            //console.log(obj);
            obj[obj.length] = addedEvent;
            // ADD SORT HERE
            obj.sort(function(first, second) {
                if (first.untildate < second.untildate) {
                    return -1;
                }
                if (first.untildate > second.untildate) {
                    return 1;
                }
                return 0;
            });
            console.log(obj)
            const jsonObj = {
                events: obj
            }

            let stringObj = JSON.stringify(jsonObj)
                //console.log("STRING OB")
                //console.log(stringObj);
                // Up to this point, successfully returns updated json array
                // update Query please 
            let updateQuery = "update eventdata.userdata set userevents = '" + stringObj + "' where username = '" + session.username + "'";
            // console.log(updateQuery) tis should work
            conn.query(updateQuery, function(err, rows) {
                if (err) {
                    res.json({ success: false, message: "You suck" })
                } else {
                    res.sendFile(__dirname + "/public/" + "main.html");
                }
            })

        }


    });

})


// get activity
app.get("/activity", function(req, res) {
    res.sendFile(__dirname + "/public/" + "activity.html");
})

// post to route "attempt login"
app.post("/attempt_login", function(req, res) {
        // we check for the username and password to match.
        conn.query("select pass from eventdata.registeredusers where user = ?", [req.body.username], function(err, rows) {
            if (err || rows.length == 0) {
                res.json({ success: false, message: "user doesn't exists" });
            } else {
                storedPassword = rows[0].pass // rows is an array of objects e.g.: [ { password: '12345' } ]
                    // bcrypt.compareSync let's us compare the plaintext password to the hashed password we stored in our database
                if (bcrypt.compareSync(req.body.password, storedPassword)) {
                    authenticated = true;
                    session.username = req.body.username;
                    session.online = true;
                    res.json({ success: true, message: "logged in" })

                } else {
                    res.json({ success: false, message: "password is incorrect" })
                }
            }
        });
    })
    // aAFter adding event
app.get("add_event", function(req, res) {
        res.sendFile(__dirname + "/public/" + "home.html")
    })
    // if the user navigates to localhost:3000/main, then the main page will be loaded.
app.get("/main", function(req, res) {
    if (authenticated) {
        res.sendFile(__dirname + "/public/" + "main.html");
    } else {
        res.send("<p>not logged in <p><a href='/'>login page</a>")
    }

})
app.get("/home", function(req, res) {
    if (authenticated) {
        conn.query("select userevents from eventdata.userdata where username = ?", [session.username], function(err, rows) {
                if (err) {
                    res.json({ success: false, message: "couldnt find userevents" });
                } else {


                    res.sendFile(__dirname + "/public/" + "home.html");

                    console.log("Success");


                }
            })
            //res.sendFile(__dirname + "/public/" + "home.html");
    } else {
        res.send("<p>not logged in <p><a href='/'>login page</a>")
    }
})
app.get("/session", function(req, res) {
    res.json(session);
});
app.get("/getEvents", function(req, res) {
    conn.query("select userevents from eventdata.userdata where username = ?", [session.username], function(err, rows) {
        if (err) {
            res.json({ success: false, message: "couldnt find userevents" });
        } else {
            let obj = rows[0].userevents;
            res.send(obj);
        }
    })
});
// Start the web server
// 3000 is the port #
// followed by a callback function
app.listen(3000, function() {
    console.log("Listening on port 3000...");
});

function convertSQLDate(date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    console.log(yyyy + '-' + mm + '-' + dd);
    return yyyy + '-' + mm + '-' + dd;
}

function dateDistance(today, eventDate) {
    let todayArr = today.split("-");
    let dateArr = eventDate.split("-");
    var todayDay = parseInt(todayArr[2]);
    var dateDay = parseInt(dateArr[2]);
    var todayMonth = parseInt(todayArr[1]);
    var dateMonth = parseInt(dateArr[1]);
    if (dateMonth == todayMonth) {
        return dateDay - todayDay;
    } else {
        let monthDiff = dateMonth - todayMonth;
        return (monthDiff * 30) - todayDay + dateDay;
    }
}