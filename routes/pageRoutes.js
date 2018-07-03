// Dependencies
var path = require("path");
var db = require("../models");

// Routes
module.exports = function(app) {

    

    app.get("/", function(req, res) {
        // we're using path.join here to safely combine two filepaths
        // __dirname + "/index.html" would also work
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.get("/newroom", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/newroom.html"));
    });

    //Logic when user submits a form
    app.post("/:room/form", function(req,res){
        console.log(req.body);
        var categories = req.body.activity;
        var roomname = req.params.room;
        var times = req.body.times;

        console.log("Times: ");
        console.log(times);

        //Add time windows for each person
        var user_query = {
            name: req.body.person            
        };

        for( day in times){
            // var s = null;
            // var e = null;
            //Mapping time of day chosen to exact time windows
            // switch(times[day]){
            //     case "Morning":
            //         s = new Date("June 28, 2018 09:00");
            //         e = new Date("June 28 2018 13:00");
            //         break;
            //     case "Afternoon":
            //         s = new Date("June 28, 2018 13:00");
            //         e = new Date("June 28 2018 17:00");
            //         break;
            //     case "Evening":
            //         s = new Date("June 28, 2018 17:00");
            //         e = new Date("June 28 2018 21:00");
            //         break;
            //     case "Late Night":
            //         s = new Date("June 28, 2018 21:00");
            //         e = new Date("June 28 2018 24:00");
            //         break;
            // }
            // var start_day = day + "_start";
            // var end_day = day + "_end";
            var day_time = day + "_time";

            // if(s !== null && e !== null){
                // user_query[start_day] = s;
                // user_query[end_day] = e;
            user_query[day_time] = times[day];
            // }
            
        }
        console.log("This is the user query: ");
        console.log(user_query);

        // var user_query = {
        //     name: req.body.person,
        //     [start_day]: s,
        //     [end_day]: e,
            
        // };

        // console.log(s);
        // console.log(e);
       
        //Get room ID from room name
        db.Room.findOne({
            where: {
                name: roomname
            }
        }).then(room =>{
            
            user_query.RoomId = room.id;

            //Make only a unique user in the correct room
            db.User.findOrCreate({
                where: user_query
            }).then(user => {
                // console.log(user);
                
                //Make a new entry in category table if they used a custom activity
                categories.forEach(function(category){
                    var category_query = {};
                    if(req.body.custom === ""){
                        category_query.activity = category;
                    }
                    else{
                        category_query.activity = req.body.custom;
                        category_query.isDefault = false;
                    }
                    category_query.RoomId = room.id;

                    db.Category.findOrCreate({ 
                        where: {activity: category},
                        defaults: category_query
                    }).then(function(cat){
                        console.log("New cateogry is");
                        console.log(cat);

                        //Make new entry for every category a user chose
                        db.UserCategory.create({
                            CategoryId: cat[0].id,
                            UserId: user[0].id
                        }).then(uscat =>{
                            // console.log(uscat);
                            res.end();
                        })
                    });
                });
               
                // console.log(result);
            })
        })
            
        
       
    });

    //New room
    app.post('/api/postRoom',(req,res)=>{
        var room=req.body;
        console.log(room.name)
        db.Room.findOrCreate({
            where: {name:room.name}
        }).then(function(){
            console.log('added!')
            res.end()
        })
    })
      
    
    //Give available categories to the front end
    app.get("/api/form/:room", (req, res)=>{
        console.log("Asking for activities available");
        //Find room id given room name
        db.Room.findOne({
            where: {
                name: req.params.room
            }
        }).then(room =>{
            //Give default activities or ones specific to the room
            db.Category.findAll({
                where: {
                    $or: [
                        {isDefault: true},
                        {RoomId: room.id}
                    ]
                }
            }).then(cats => {
                console.log(cats);
                res.json(cats);
            })
        })
        
        
    })

    //Return all categories associated with a user
    app.get("/user/:userid", function(req, res) {
        var userid = req.params.userid;
        //Link user table to category table through usercategory
        db.User.findOne({
            where: {
                id: userid
            }, include: [{
                    model: db.UserCategory,
                    include:[{
                        model: db.Category
                    }]
            }]
        }).then(result =>{
            // console.log(result);
            result.UserCategories.forEach(r => console.log(r.Category));
            res.end();
            
        })
        
    });

    //Get all users for a given room
    app.get("/:room", function(req, res) {
        var roomname = req.params.room;
        db.Room.findOne({
            where: {
                name: roomname
            }
        }).then(result =>{
            console.log(result);
            if(result === null){
                res.send("Not a real room");
            }
            else{
                db.User.findAll({
                    where: {
                        RoomId: result.id
                    },
                    include: [{
                        model: db.Room
                    }] 
                }).then(users =>{
                    console.log(users);
                    res.sendFile(path.join(__dirname, "../public/room.html"));

                })

            }
        })
        
    });

    //Send form page to front end
    app.get("/:room/form", function(req, res) {
        var roomname = req.params.room;
        db.Room.findOne({
            where: {
                name: roomname
            }
        }).then(result =>{
            console.log(result);
            if(result === null){
                res.send("Not a real room");
            }
            else{
                res.sendFile(path.join(__dirname, "../public/form.html"));
            }
        })
    });


    
};