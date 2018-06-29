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

    app.post("/:room/form", function(req,res){
        console.log(req.body);
        var roomname = req.params.room;
        var start_day = req.body.day.toLowerCase().split(" ")[0] + "_start";
        var end_day = req.body.day.toLowerCase().split(" ")[0] + "_end";
        var start = new Date();
        var end = new Date();
      
        console.log(start_day + " " + end_day);
        // console.log(d);

        var start_time;
        var end_time;

        switch(req.body.time){
            case "Morning":
                var s = new Date("June 28, 2018 09:00");
                var e = new Date("June 28 2018 13:00");
                start_time = new Date(2018, 06, 28, 9);
                end_time = new Date(2018, 06, 30, 13);
                break;
            case "Afternoon":
                var s = new Date("June 28, 2018 13:00");
                var e = new Date("June 28 2018 17:00");
                start_time = new Date(2018, 06, 28, 9);
                end_time = new Date(2018, 06, 30, 13);
                break;
            case "Night":
                var s = new Date("June 28, 2018 17:00");
                var e = new Date("June 28 2018 21:00");
                start_time = new Date(2018, 06, 28, 9);
                end_time = new Date(2018, 06, 30, 13);
                break;
            case "After Hours":
                var s = new Date("June 28, 2018 21:00");
                var e = new Date("June 28 2018 24:00");
                start_time = new Date(2018, 06, 28, 9);
                end_time = new Date(2018, 06, 30, 13);
                break;
        }

        console.log(s);
        console.log(e);
       

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
            db.User.create(user_query).then(user => {
                // console.log(user);
                var category_query = {};
                if(req.body.custom === ""){
                    category_query.name = req.body.activity;
                }
                else{
                    category_query.name = req.body.custom;
                    category_query.isDefault = false;
                }
                category_query.RoomId = room.id;
                db.Category.create(category_query).then(function(cat){
                    // console.log(cat);
                    db.UserCategory.create({
                        CategoryId: cat.id,
                        UserId: user.id
                    }).then(uscat =>{
                        // console.log(uscat);
                        res.end();
                    })
                });
                // console.log(result);
            })
        })
            
        
       
    })

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