// DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var exhbs = require("express-handlebars");

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 8888;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

// Static directory
// app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));

app.engine("handlebars", exhbs ({defaultlayout: "main"}));
app.set("view engine", "handlebars");

// Routes
require("./routes/pageRoutes")(app);

// Syncing our sequelize models and then starting our Express app
db.sequelize.sync({ force: false }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});


app.post('/postRoom',(req,res)=>{
  var room=req.body;
  console.log(room.name)
  db.Room.create({
    name:room.name,
  }).then(function(){
    console.log('added!')
    res.end()
  })
 })


var object = [{
  nameInput : "bryan",
  dayInput : "Friday",
  timeOfDayInput : "Evening",
  activitysInput : "laundry"
},
{
  nameInput : "justin",
  dayInput : "Saturday",
  timeOfDayInput : "Morning",
  activitysInput : "sports"
}
];

app.get("/dumb", function(req,res){
  res.render("index", {users: object});
});


// app.post("/category", function(req,res){
//   var x = req.body;
//   console.log (x);
//   db.category.Create({

//   })
// })
