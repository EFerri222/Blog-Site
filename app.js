var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var mongoose = require("mongoose");

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/blog-site', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false);
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
// What to look for in query string
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: {type: String, default: "https://contentgrid.homedepot-static.com/hdus/en_US/DTCCOMNEW/fetch/Category_Pages/Lighting_and_Fans/standard-light-bulb-x.png"},
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// ROUTES

// ROOT ROUTE - redirect to index
app.get("/", (req,res) => {
    res.redirect("blogs");
});

// INDEX - list all blogs
app.get("/blogs", (req,res) => {
    Blog.find({}, (err,blogs) => {
        if(err) {
            throw err;
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

// NEW - show new blog form
app.get("/blogs/new", (req,res) => {
    res.render("new");
});

// CREATE - create a new blog, then redirect to index
app.post("/blogs", (req,res) => {
    // If image field is left blank set to undefined so it will use default image
    if(req.body.blog.image === "") {
        req.body.blog.image = undefined;
    }
    // Sanitize blog body
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // Create new blog
    Blog.create(req.body.blog, (err,blog) => {
        if(err) {
            throw err;
        } else {
            // Redirect to index
            res.redirect("/blogs");
        }
    });
});

// SHOW - show info about one specific blog
app.get("/blogs/:id", (req,res) => {
    Blog.findById(req.params.id, (err,blog) => {
        if(err) {
            throw err;
        } else {
            res.render("show", {blog: blog});
        }
    });
});

// EDIT - show edit form for one blog
app.get("/blogs/:id/edit", (req,res) => {
    Blog.findById(req.params.id, (err,blog) => {
        if(err) {
            throw err;
        } else {
            res.render("edit", {blog: blog});
        }
    });
});

// UPDATE - update a particular blog, then redirect to index
app.put("/blogs/:id", (req,res) => {
    // Sanitize blog body
    req.body.blog.body = req.sanitize(req.body.blog.body);
    // First argument is id, second is data to use for update
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err,blog) => {
        if(err) {
            throw err;
        } else {
            // Redirect to index
            res.redirect("/blogs");
        }
    });
});

// DESTROY - delete a particular blog, then redirect to index
app.delete("/blogs/:id", (req,res) => {
    // Find blog by id and destroy
    Blog.findByIdAndRemove(req.params.id, (err,blog) => {
        if(err) {
            throw err;
        } else {
            // Redirect to index
            res.redirect("/blogs");
        }
    });
});

// SERVER CONFIG
var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log("Server is listening on port " + PORT);
});