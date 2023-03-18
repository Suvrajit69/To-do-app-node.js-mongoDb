const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")


const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const items = [];
const workItems = [];
app.get("/", function(req,res){
    const day = date.getDate()
    //  console.log(day)
    res.render("list", {listTitle:day, newListItems: items})
})

app.post("/", function(req,res){
    let item = req.body.newItem;
    if(req.body.list === 'work List'){
        if(item == ''){
            item = []
         }else{
             workItems.push(item)
         }
        res.redirect("/work")
    }else{
        if(item == ''){
            item = []
        }else{
             items.push(item)
            }
            res.redirect("/");
    }
    // console.log(items)
})

app.get("/work", function(req,res){
    res.render("list", {listTitle: "work List", newListItems: workItems})
})

app.listen("3000", function(){
    console.log("server is running in port 3000")
})