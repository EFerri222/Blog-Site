var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// APP CONFIG
mongoose.connect('mongodb://localhost:27017/blog-site', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
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
            res.render("index", {blogs: blogs})
        }
    })
});

// NEW - show new blog form
app.get("/blogs/new", (req,res) => {
    res.render("new");
});

// CREATE - create a new blog, then redirect to index
app.post("/blogs", (req,res) => {
    // Create new blog
    // Redirect to index
    // res.render("index");
});

// SHOW - show info about one specific blog
app.get("/blogs/:id", (req,res) => {
    res.render("show");
});

// EDIT - show edit form for one blog
app.get("/blogs/:id/edit", (req,res) => {
    res.render("edit");
});

// UPDATE - update a particular blog, then redirect to index
app.put("/blogs/:id", (req,res) => {
    // Update blog
    // Redirect to index
    // res.render("index");
});

// DESTROY - delete a particular blog, then redirect to index
app.delete("/blogs/:id", (req,res) => {
    // Delete blog
    // Redirect to index
    // res.render("index");
});

// SERVER CONFIG
var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
    console.log("Server is listening on port " + PORT);
})