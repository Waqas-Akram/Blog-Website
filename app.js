//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const multer = require('multer');
const upload = multer({ dest: './public/images/' });
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const app = express();
mongoose.connect('mongodb://localhost:27017/blog_DB', {useNewUrlParser: true , useUnifiedTopology:true});
const postSchema = new mongoose.Schema({
  title:String,
  image:{ data: Buffer, contentType: String },
  discription:String
});
const Post = mongoose.model("Post",postSchema);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.get("/", function (req, res) {
  Post.find({}, function(err, posts){
    if(err){
      console.log(err);
    }
    else{
console.log('item saved');
    res.render("home", {
 
      postArray:posts
 
      });
    }
 
  });
});
app.get('/about', function (req, res) {
  res.render("about", {
    aboutMaterial: aboutContent
  });
});
app.get('/contact', function (req, res) {
  res.render("contact", {
    contactMaterial: contactContent
  });
});
app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post('/compose', upload.single('addImage'), function (req, res) {
  const post = new Post ({

    title: req.body.publish,
    image:req.body.addImage,
    discription: req.body.multilineText,
 
  });
  post.save();

  res.redirect("/");

});
app.get("/post/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      if(!err){
        console.log('item found');
      res.render("post", {
        addTitle: post.title,
        addImage:post.image,
        addDiscription:post.discription
      });
    }
    else{
      console.log("item not find");
    }
    });
  
  });
app.post("/contact/send" ,function(req,res){
  let name = req.body.yourName;
  let email = req.body.yourEmail;
  let message = req.body.yourMessage;
  let transporter = nodemailer.createTransport({
    service:'Outlook',
    auth: {
      user: 'waqasakram512@outlook.com',
      pass: 'ninja*assasin'
    }
  });
  let mailOptions = {
    from : 'Waqas Akram <waqasakram512@outlook.com>',
    to: 'waqasakram512@outlook.com',
    subject:'Website Submission',
    text: "You have the submission with the following details...Name :"+ name+'Email :'+email+' Message :'+message,
    html: 'You have the submission with the following details...<p><ul><li>Name :'+name+'</li><li>Email : '+email+'</li><li>Message : '+message+'</li></ul> </p>'
  };
  transporter.sendMail(mailOptions,function(error , info){
    if(error){
      res.redirect('/failure');
      console.log(error);
      
    }
    else{
      res.redirect('/success');
      console.log("Message Sent"+info.response);
      
    }

  });
});
app.get('/success',function(req,res){
  res.render('success');
});
app.get('/failure',function(req,res){
  res.render('failure');
});
app.post('/success/send',function(req,res){
  res.redirect('/');
});
app.post('/failure/send',function(req,res){
  res.redirect('/contact');
});
app.listen(5000, function () {
  console.log("Server started on port 5000");
});