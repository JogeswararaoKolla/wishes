const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");

require("dotenv").config();

const app = express();

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

let connection;

if (process.env.JAWSDB_URL) {
  //Heroku
  connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
  //Localhost
  connection = mysql.createConnection({
      host: process.env.DB_HOST,
      port: 3306,
      database: "wishes_db",
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
  });
}

connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

// Root get route.
app.get("/", function(req, res) {
  connection.query("SELECT * FROM wishes;", function(err, data) {
    if (err) {
      throw err;
    }

    // Test it.
    // console.log('The solution is: ', data);

    // Test it.
    // res.send(data);

    res.render("index", { wishes: data });
  });
});

// Post route -> back to home
app.post("/", function(req, res) {
  // Test it.
  // console.log('You sent, ' + req.body.wish);

  // Test it.
  // res.send('You sent, ' + req.body.wish)

  connection.query("INSERT INTO wishes (wish) VALUES (?)", [req.body.wish], function(err, result) {
    if (err) {
      throw err;
    }

    res.redirect("/");
  });
});

// Start our server so that it can begin listening to client requests.
app.listen(PORT, function() {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});
