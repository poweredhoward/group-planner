// Dependencies
var path = require("path");

// Routes
module.exports = function(app) {

    app.get("/", function(req, res) {
        // we're using path.join here to safely combine two filepaths
        // __dirname + "/index.html" would also work
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });

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