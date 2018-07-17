const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");

mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});
const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "testBLog",
//   image: "https://227rsi2stdr53e3wto2skssd7xe-wpengine.netdna-ssl.com/wp-content/uploads/2017/07/ramunapruins-e1500182576944-730x280.jpg",
//   body: "Hello ... This is a blog post"
// })

//RESTful Routes

app.get("/", function (req,res){
  res.redirect("/blogs");
});

// Index ROUTE

app.get("/blogs", function (req,res){
  Blog.find({},function (err, blogs){
    if (err){
      console.log("error: ", err)
    } else {
      res.render("index", {blogs: blogs});
    }
  });
});

// New Route

app.get("/blogs/new", function(req,res){
  res.render("new");
})

// Create Route

app.post("/blogs", function(req,res){

  console.log(req.body);
  req.body.blog.body = req.sanitize(req.body.blog.body);
  console.log(req.body);

  Blog.create(req.body.blog, function(err, newBlog){
    if(err){
      res.render("new");
    }else{
      res.redirect("blogs");
    }
  })
})


// Show route

app.get("/blogs/:id", function (req,res){
  Blog.findById(req.params.id, function(err,foundBlog){
    if (err){
      res.redirect("blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  })
})

// Edit route

app.get("/blogs/:id/edit", function (req,res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err){
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  })
})

// update

app.put("/blogs/:id", function (req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);

  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updatedBlog){
    if (err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/" + req.params.id);
    }

  })
})

// delete

app.delete("/blogs/:id", function (req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if (err){
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  }
)


})


app.listen(port, () => {
  console.log("listening on port", port);
});
