const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express()
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName: "toDoListDB"})
.then(()=>console.log("database connected"))
.catch((e)=>console.log(e))

const itemsSchema ={
    name: {
        type : String,
        minlength: 1 
    }
};
const Item = mongoose.model("Item", itemsSchema); // This is Database
const item1 = new Item({
    name: "Welcome to todo-list"
});
const item2 = new Item({
    name: "Welcome to my todo-list"
});
const dItems =[item1,item2]

const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model("List", listSchema)

app.get("/", function(req,res){
    const day = date.getDate()

Item.find()
.then((see_datas)=>{
    // console.log(see_datas)
    if(see_datas.length === 0){
Item.insertMany(dItems)
.then(()=>{console.log("Insert Sucessfuly")})
.catch((err)=>{console.log(err)})
    res.redirect("/");        
    }else{
        res.render("list", {
            listTitle:day,
            newListItems: see_datas
        })
    }
});
});

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName})
    .then((foundList)=>{
        if(!foundList){
            //Create a new list
            const list = new List({
                name: customListName,
                items: dItems
            });
            list.save("/");
            res.redirect("/" + customListName)
        }else{
            //Show an existing list
            res.render("list", {
                listTitle:foundList.name,
                newListItems: foundList.items
            })
        }
    })
    .catch((err)=>{console.log(err)})
})

app.post("/", function(req,res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    let item = new Item({
        name: itemName
    });

    if(listName === date.getDate()){
        item.save()
        .then(()=>{res.redirect("/")})
        .catch(()=>{res.redirect("/")})
    }else{

        List.findOne({name: listName})
        .then((foundList)=>{
            foundList.items.push(item);
            foundList.save()
            .then(()=>{res.redirect("/" + listName)})
            .catch(()=>{res.redirect("/" + listName)})
        })
        .catch((err)=>{console.log(err)})
    }
    
})
    
    // if(req.body.list === 'work List'){
    //     if(item == ''){
    //         item = []
    //      }else{
    //          workItems.push(item)
    //      }
    //     res.redirect("/work")
    // }else{
    //     if(item == ''){
    //         item = []
    //     }else{
    //          items.push(item)
    //         }
    //         res.redirect("/");
    // }
    // console.log(items)

app.post("/delete", function(req, res) {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === date.getDate()){
        Item.findOneAndRemove({_id: checkedItemId})
        .then(()=>{
            console.log("Sucessfully deleted checked Item")
            res.redirect("/")
        })
        .catch((err)=>{console.log(err)})
    }else{
        List.findOneAndUpdate({name: listName},{$pull:{items: {_id: checkedItemId}}}).then(()=>{res.redirect("/" + listName)})
        .catch((err)=>{console.log(err)})
    }
})

app.listen("3000", function(){
    console.log("server is running in port 3000")
})