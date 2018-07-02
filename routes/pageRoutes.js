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

        //Times to be added to db
        var start_day = req.body.day.toLowerCase().split(" ")[0] + "_start";
        var end_day = req.body.day.toLowerCase().split(" ")[0] + "_end";
        var start = new Date();
        var end = new Date();
      
        console.log(start_day + " " + end_day);
        // console.log(d);

        //Mapping time of day chosen to exact time windows
        switch(req.body.time){
            case "Morning":
                var s = new Date("June 28, 2018 09:00");
                var e = new Date("June 28 2018 13:00");
                break;
            case "Afternoon":
                var s = new Date("June 28, 2018 13:00");
                var e = new Date("June 28 2018 17:00");
                break;
            case "Night":
                var s = new Date("June 28, 2018 17:00");
                var e = new Date("June 28 2018 21:00");
                break;
            case "After Hours":
                var s = new Date("June 28, 2018 21:00");
                var e = new Date("June 28 2018 24:00");
                break;
        }

        console.log(s);
        console.log(e);
       
        //Get room ID from room name
        db.Room.findOne({
            where: {
                name: roomname
            }
        }).then(room =>{
            var user_query = {
                name: req.body.person,
                [start_day]: s,
                [end_day]: e,
                RoomId: room.id
            };

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