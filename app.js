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

app.get("/articles",function(req,res){
  Article.find({},function(err,docs){
    if(!err){
      res.send(docs);
    }else{
      res.send(err);
    }
  })
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
