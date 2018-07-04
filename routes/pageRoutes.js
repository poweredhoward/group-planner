// Dependencies
var path = require("path");
var db = require("../models");
var nodemailer = require('nodemailer');

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

        //Add attribute to user query for each time a user chose
        for( day in times){
            var day_time = day + "_time";
            user_query[day_time] = times[day];
        }

        console.log("This is the user query: ");
        console.log(user_query);
       
        //Get room ID from room name
        db.Room.findOne({
            where: {
                name: roomname
            },
            raw: true
        }).then(room =>{
            
            user_query.RoomId = room.id;

            //Make only a unique user in the correct room
            db.User.findOrCreate({
                where: user_query,
                raw: true
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

                    //Make a new category in correct room if new custom category
                    db.Category.findOrCreate({ 
                        where: {activity: category},
                        defaults: category_query,
                        raw: true
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

    //New room page
    app.post('/api/postRoom',(req,res)=>{

        var room=req.body;
        console.log(room.name)
        db.Room.findOrCreate({
            where: {name:room.name},
            raw: true
        }).then(function(){
            console.log('added!')
            res.end()
        })
    })
      
    
    //Give available categories to the front end
    app.get("/api/forms/:room", (req, res)=>{
        console.log("Asking for activities available");
        //Find room id given room name
        db.Room.findOne({
            where: {
                name: req.params.room
            },
            raw: true
        }).then(room =>{
            //Give default activities or ones specific to the room
            db.Category.findAll({
                where: {
                    $or: [
                        {isDefault: true},
                        {RoomId: room.id}
                    ]
                },
                raw: true
            }).then(cats => {
                console.log(cats);
                res.json(cats);
            })
        })
        
        
    })

    //Get optimal category
    app.get("/api/:room/best/category", function(req, res){
        db.Room.findOne({
            where: {name: req.params.room}
        }).then(room =>{
            db.User.findAll({
                where: { RoomId: room.id}
            }).then(users=>{
                console.log(users);
                //Object to hold counts of each category occurence
                var category_count = {};
                users.forEach( function(user){
                    
                    db.UserCategory.findAll({
                        where: {UserId: user.id}
                    }).then(categories => {
                        console.log("These are the categories chosen by "+ user.name )
                        // console.log(categories);
                        categories.forEach(category =>{
                            if(category.CategoryId in category_count){
                                category_count[category.CategoryId] += 1;
                            } else{
                                category_count[category.CategoryId] = 1;
                            }
                        });

                        console.log("Category count: ");
    
                        //The object with the categories!!!
                        console.log(category_count);
    
                    });
                });

                setTimeout(function (){
                    var max_count = 0;
                    var max_key = 0;
                    for(cat in category_count){
                        if(category_count[cat] > max_count){
                            max_count = category_count[cat];
                            max_key = cat;
                        }
                        
                    }
                    db.Category.findOne({
                        where: {id: max_key}
                    }).then(result =>{
                        res.json({category: result.activity, count: max_count});
                    })
                    
                },1000)
                
            })
        })
        
    });

    
    //Get best day and time of day
    app.get("/api/:room/best/daytime", function(req, res){
        //Possible day fields, possibly don't need it
        var num_days = 7;
        var count_obj = {};

        //Convert day/time entry to a unique number for each possibility that appears and track occurences
        function entryToNum(category, daynum){
            //Possible enum values
            var enumm = db.User.rawAttributes.monday_time.values;
            var multipliers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
            var values = multipliers[enumm.indexOf(category)];
            var day = multipliers[multipliers.length -1 - daynum];
            console.log("values: "+ values)
            console.log("day: " + day)
            var hashnum =  values * day;
            var hashnums = {};
            if(hashnum in count_obj){
                count_obj[hashnum].count += 1;
                // hashnums.count += 1;
                
            } else {
                // count_obj[hashnum] = 1;
                hashnums.count = 1;
                hashnums.valuenum = values;
                hashnums.daynum = day;
                count_obj[hashnum] = hashnums;
            }
           
        }
        var days_of_week = [];

        //Get best day and time from hash count object
        function numToEntry(hashnum){
            var enumm = db.User.rawAttributes.monday_time.values;
            var multipliers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
            var valuenum = count_obj[hashnum].valuenum
            var value = enumm[multipliers.indexOf(valuenum)];
            var daynum = count_obj[hashnum].daynum;
            var day = days_of_week[ multipliers.length -1 - multipliers.indexOf(daynum) ];
            // multipliers[ multipliers.length -1 - multipliers.indexOf(daynum) ];
            var best_day_time = {time: value, day: day };
            return best_day_time;

        }

        // var count_matrix = [];
        console.log(db.User.rawAttributes.monday_time.values);
        db.Room.findOne({
            where: {name: req.params.room} 
        }).then(room =>{
        
            db.User.findAll({
                where: {RoomId: room.id},
                raw: true
            }).then(users =>{
                console.log(users);

                //Make possible day array from fields for a user
                for(field in users[0]){
                    // console.log(field)
                    if(field.split("_")[1] === "time"){
                        //entryToNum(user[field], col_num);
                        days_of_week.push((field.split("_")[0]));
                    }
                    
                }

                console.log(days_of_week);

                //For each day of the week for each user, add to hash count object
                users.forEach(user =>{
                    for(var i=0 ; i<days_of_week.length ; i++){
                        var d = days_of_week[i] + "_time";
                        entryToNum(user[d], i);
                    }
                })
                // console.log(count_matrix);
                console.log(count_obj);

                var max_hash = 0;
                var max_count = 0;
                //Find highest number in hash count object
                for(hash in count_obj){
                    if(count_obj[hash].count > max_count){
                        max_hash = hash;
                        max_count = count_obj[hash].count;
                    }
                }

                console.log(numToEntry(max_hash));
                res.json(numToEntry(max_hash));
            })
        })
    })




    //Send user choices and times to handlebars
    app.get("/:room", function(req, res) {    
        var userlist = [];
        //Get room from name
        db.Room.findOne({
            where: {name: req.params.room}
        }).then(room =>{
            console.log("Room is printing: ");
            console.log(room);
            //Get all users in room
            db.User.findAll({
                where: {RoomId: room.id}
            }).then( function(allusers){
                //For each user, get times and all activities
                allusers.forEach( user =>{
                    var userobj = {};
                    var activities = [];
    
                    db.User.findOne({
                        where: {
                            id: user.id
                        }, include: [{
                                model: db.UserCategory,
                                include:[{
                                    model: db.Category
                                }]
                        }]
                        
                    }).then(categories =>{
                        categories.UserCategories.forEach(
                            cat => activities.push(cat.Category.activity)
                        );
                        console.log("user: " + user.name);
                        console.log("categories: " + activities);
                        userobj.user = user;
                        userobj.activities = activities;
                        userlist.push(userobj);
                        console.log("userlist:");
                        // console.log(userlist);
    
    
                    })
                })
                // res.render("index", {users: userlist});
               
                //Wait key to control for callback issues
                setTimeout(function(){
                    res.render("index", {users: userlist});
                }, 900)
                // console.log(oneuser.Category.activity, "dataactivity")
                
                
            })
        })
        
    
    });
    

    //Send form page to front end
    app.get("/:room/form", function(req, res) {
        var roomname = req.params.room;
        db.Room.findOne({
            where: {
                name: roomname
            },
            raw: true
        }).then(result =>{
            console.log(result);
            if(result === null){
                res.sendFile(path.join(__dirname, "../public/error.html"));
            }
            else{
                res.sendFile(path.join(__dirname, "../public/form.html"));
            }
        })
    });


    //route to send email
    app.post("/sendMail", function(req, res){
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'group18planner@gmail.com',
              pass: 'group-planner1!'
            }
          });

          var mailOptions = {
            from: 'group18planner@gmail.com',
            to: req.body.to,
            subject: 'YOUR PERSONALIZED URL FROM GROUP-PLANNER!',
            text: req.body.text
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              res.send("Email sent!")
            }
          }); 
        });
    }
