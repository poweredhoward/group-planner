// Dependencies
var path = require("path");
var db = require("../models");
const Sequelize = require('sequelize');
const sequelize = new Sequelize('group_planner_db', 'root', 'admin', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },


  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});
// Routes
module.exports = function(app) {

    app.get("/", function(req, res) {
        // we're using path.join here to safely combine two filepaths
        // __dirname + "/index.html" would also work
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

    app.post("/", function(req,res){
        // console.log(req.body);
        var start_day = req.body.dayProperty.toLowerCase() + "_start";
        var end_day = req.body.dayProperty.toLowerCase() + "_end";
        console.log(start_day + " " + end_day);
        var d = new Date();
        console.log(d);

        var start_time;
        var end_time;

        // switch(req.body.timeProperty){
        //     case "Morning":
        //         start_time = new Date(2018, 06, 28, 9);
        //         end_time = new Date(2018, 06, 30, 13);
        //         break;
        //     case "Afternoon":
        //         start_time = new Date(2018, 06, 28, 9);
        //         end_time = new Date(2018, 06, 30, 13);
        //         break;
        //     case "Night":
        //         start_time = new Date(2018, 06, 28, 9);
        //         end_time = new Date(2018, 06, 30, 13);
        //         break;
        //     case "After Hours":
        //         start_time = new Date(2018, 06, 28, 9);
        //         end_time = new Date(2018, 06, 30, 13);
        //         break;
        // }
        sequelize.query(
            'INSERT INTO users SET name = ?, ? = ?, ? = ?',
            { replacements: [req.body.personProperty, start_day, d, end_day, d],  }
        ).then( result => {
            res.end();
        // console.log(projects)
        });
        // db.User.create({
        //     name: req.body.personProperty,
        //     friday_start: d,
        //     friday_end: d
        // }).then(result => {
        //     // console.log(result);
        //     res.end();
        // })
       
    })

    app.get("/two", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/two.html"));
    });

    app.get("/three", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/three.html"));
    });

    app.get("/four", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/four.html"));
    });
};