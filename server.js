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

    //Set default activities for all rooms, put in db
    var activities_available = [
      "lets go eat somewhere",
      "catch a movie",
      "concert",
      "recreational sport",
      "sporting event",
      "museums",
      "beach",
      "clubbing",
      "bar-hopping",
  ];
  
  db.Category.findAll({
    where: {
      isDefault: true
    }
  }).then(defaults => {
    if(defaults.length <= 0){
      activities_available.forEach(cat =>{
        db.Category.create({
            activity: cat,
            isDefault: true
        });
  
      })
    }
    
  })
    
  
  });
});




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

var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

var users=[{
  name:"justin", monday_start:null, monday_finish:null, tuesday_start:1, tuesday_finish:3, activityInput:"soccer"},
  {
    name:"john", monday_start:null, monday_finish:null, tuesday_start:3, tuesday_finish:7, activityInput:"books"},
    {
      name:"joey", monday_start:8, monday_finish:11, tuesday_start:null, tuesday_finish:null, activityInput:"entropy"},
      {
        name:"jake", monday_start:10, monday_finish:1, tuesday_start:null, tuesday_finish:null, activityInput:"disorder"}
  
];

var goodData = [];

users.forEach(user=>{
  var goodUser = {};
  if(user.monday_start !== null){
    goodUser.monday_start = user.monday_start;
  }
  if(user.monday_finish !== null){
    goodUser.monday_finish = user.monday_finish;
  }
  if(user.tuesday_start !== null){
    goodUser.tuesday_start = user.tuesday_start;
  }
  if(user.tuesday_finish !== null){
    goodUser.tuesday_finish = user.tuesday_finish;
  }
  goodData.push(goodUser);

})
console.log(goodData);

// var timeOfDay=[];
// for(var i=0;i<users.length;i++){
//   if(users[i].monday_start !== false){timeOfDay.push(users[i].monday_start)}
//   if(users[i].monday_finish !== false){timeOfDay.push(users[i].monday_finish)}
//   if(users[i].tuesday_start !== false){timeOfDay.push(users[i].tuesday_start)}
//   if(users[i].tuesday_finish !== false){timeOfDay.push(users[i].tuesday_finish)}
// }

