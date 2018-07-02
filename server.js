// DEPENDENCIES
var express = require("express");
var bodyParser = require("body-parser");
var exhbs = require("express-handlebars");

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

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

//DUMB DATA/HB TEMPLATE FIGURING
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
// handlebars 
app.get("/dumb/justin", function(req,res){

  res.render("index", {users:goodData});

});


// app.post("/category", function(req,res){
//   var x = req.body;
//   console.log (x);
//   db.category.Create({

//   })
// })



var users=[{
  name:"justin", friday_start:null, friday_finish:null, saturday_start:1, saturday_finish:3, sunday_start:2,sunday_finish:8, activityInput:"soccer"},
  {
    name:"john", friday_start:8, friday_finish:12, saturday_start:5, saturday_finish:8, sunday_start:2,sunday_finish:8, activityInput:"books"},
    {
      name:"joey", friday_start:null, friday_finish:null, saturday_start:4, saturday_finish:10, sunday_start:null,sunday_finish:null, activityInput:"entropy"},
      {
        name:"jake", friday_start:2, friday_finish:4, saturday_start:11, saturday_finish:2, sunday_start:null,sunday_finish:null, activityInput:"disorder"}
  
];




/*
var timeOfDay=[];
for(var i=0;i<users.length;i++){
  if(users[i].friday_start !== null){timeOfDay.push(users[i].monday_start)}
  if(users[i].monday_finish !== null){timeOfDay.push(users[i].monday_finish)}
  if(users[i].tuesday_start !== false){timeOfDay.push(users[i].tuesday_start)}
  if(users[i].tuesday_finish !== false){timeOfDay.push(users[i].tuesday_finish)}
}
/*
console.log(timeOfDay) 
*/
var usersNames=[];
for(var i=0;i<users.length;i++){
  usersNames.push(users[i].name)
};

//console.log(usersNames)
/*
var userTimes=[];
for(var i=0;i<users.length;i++){
  if(users[i].monday_start !== false){usersTimes.push()}
}
 */

var goodData = [];

users.forEach(user=>{
 var goodUser = {};
 goodUser.name = user.name;
 if(user.friday_start !== null){
   goodUser.friday_start = user.friday_start;
 }
 if(user.friday_finish !== null){
   goodUser.friday_finish = user.friday_finish;
 }
 if(user.saturday_start !== null){
   goodUser.saturday_start = user.saturday_start;
 }
 if(user.saturday_finish !== null){
   goodUser.saturday_finish = user.saturday_finish;
 }
 if(user.sunday_start !== null){
  goodUser.sunday_start = user.sunday_start;
}
if(user.sunday_finish !== null){
  goodUser.sunday_finish = user.sunday_finish;
}
 goodData.push(goodUser);

})
console.log(goodData);
// for(var l in goodData){
//   for(var m in l){
//     console.log(m)}
//   }


var user=[{
  name:"Matt",
  number:17,
  startTime:3 + ":00pm",
  endTime:7 + ":00pm",
  day:"Saturday",
  activity:"Movies"
},
{
  name:"Bryan",
  number:29,
  startTime:5 + ":00pm",
  endTime:8 + ":30pm",
  day:"Sunday",
  activity:"Dinner at TGIFridays"
},
{
  name:"Vanessa",
  number:202,
  startTime:10 + ":15am",
  endTime:1 + ":30pm",
  day:"Saturday",
  activity:"Brunch on the beach"
},
{
  name:"Justin",
  number:2,
  startTime:9 + ":00pm",
  endTime:1 + ":45am",
  day:"Saturday",
  activity:"Belasco nightclub"
}];
 
var random=Math.floor(Math.random()*user.length)

var guests=[
  {guestName:"joe"},
  {guestName:"ralph"},
  {guestName:"sarah"},
  {guestName:"vanessa"},
  {guestName:"jim"},
  {guestName:"ryan"},
  {guestName:"jason"},
  {guestName:"allison"},

]

app.get('/room/Practice',(req,res)=>{
  res.render('room',{name:user[random].name,
                     number:user[random].number,
                     day:user[random].day,
                     startTime:user[random].startTime,
                     endTime:user[random].endTime,
                     activity:user[random].activity,
                     guests:guests})
})

app.get('/rooms/List',(req,res)=>{
  res.render("rooms",{partyRow:roomsNUsers})
})


var roomsNUsers=[
  {partyRoom:"Friday Night Bowling", partyStarter:"Vanessa"},
  {partyRoom:"Basketball game", partyStarter:"Elton"},
  {partyRoom:"Fortnight", partyStarter:"Bryan"},
  {partyRoom:"Staple Center Concert", partyStarter:"Matt"},
  {partyRoom:"Night at the movies", partyStarter:"Jake"},

]
