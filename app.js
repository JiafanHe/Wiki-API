const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { Schema,model } = mongoose;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = new Schema({
  title:String,
  content: String
})

const Article = model("Article",articleSchema);

//TODO

/////////////////Requests targetting all articles///////////
app.route("/articles")
  .get(function(req,res){
    Article.find({},function(err,docs){
      if(!err){
        res.send(docs);
      }else{
        res.send(err);
      }
    })
  })
  .post(function(req,res){
    const newArticle = new Article({
      title:req.body.title,
      content:req.body.content
    });
    newArticle.save(function(err){
      if(!err){
        res.send("Successfully added a new article.");
      }else{
        res.send(err);
      }
    });
  })
  .delete(function(req,res){
    Article.deleteMany({},function(err){
      if(!err){
        res.send("Successfully delete all articles.")
      }else{
        res.send(err);
      }
    });
  });
  ////////////////Requests targetting a specific article///////////

app.route("/articles/:title")
  .get(function(req,res){
    Article.findOne({title:req.params.title},function(err,doc){
      if(doc){
        res.send(doc);
      }else{
        res.send("No matching article");
      }
    })
  })
  .put(function(req,res){
    //.update() was deprecated.
    //Use replaceOne() if you want to overwrite an entire document
    //rather than using atomic operators like $set.
    Article.replaceOne(
      {title:req.params.title}, //filter

      //Update according to the information from request
      //If we do not provide title in the request, the new document
      //will not have the title field since we overwrite the entire 
      //document
      {
       title:req.body.title,
       content:req.body.content
      },
      function(err){
        if(!err){
          res.send("Successfully update a article");
        }else{
          console.log(err);
          res.send("Cannot update a article.")
        }
      }
    );
  });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
