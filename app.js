const express = require('express');
const bodyPaser = require('body-parser');
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.use(bodyPaser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

// const List=[]; 

const itemsSchema = {
    name: String,
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "hello"

});
const item2 = new Item({
    name: "rahul"
});

const defaultitem = [item1, item2];

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    Item.find({}, (err, itemsfound) => {
        if (itemsfound.length === 0) {
            Item.insertMany(defaultitem, (err) => {
                if (err) { console.log(err); }
                else {
                    console.log("success")
                }
            });

           res.redirect('/');
        }
        else{
            res.render('list', { data: itemsfound });

        }
    })


});


app.post('/', (request, respond) => {
    const itemname = request.body.inputwork;

    const item = new Item({
        name:itemname
    });
    item.save();

    respond.redirect('/');
});

app.post('/delete',(req,res)=>{
    const checkeditem = req.body.checkbox;
    Item.findByIdAndRemove(checkeditem,(err)=>{
        if(err){
            console.log("unable to delete");
        }
        else{
            console.log("deletion successfull");
        }
        res.redirect('/');
    });
});

app.get('/download',(req,res)=>{
    res.download('client.py');
})






app.listen(3000 || process.env.PORT , (req, res) => {
    console.log("server is up running");
});
