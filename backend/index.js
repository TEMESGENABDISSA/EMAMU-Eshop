const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect("mongodb+srv://temesgenabdissa2:10223013@cluster0.dgf7bjz.mongodb.net/EMAMUMALL");

// API Creation

app.get("/",(req, res) => {
res.send("Express APPlication is Running");
})

// image storage engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
    return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
    })
    const upload =multer({storage:storage})
    // creating upload endpoint for images
    app.use('/images',express.static('upload/images'))
    
    app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
    success:1,
    image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
    })

    // schema for creating products
const product = mongoose.model("product",{
id:{
type:Number,
required:true,
},
name:{
type:String,
required:true,
},
image:{
type:String,
required:true,
},
category:{
type:String,
required:true,
},
new_price:{
type:Number,
required:true,
},
old_price:{
type:Number,
required:true,
},
date:{
type:Date,
default:Date.now,
},
avilable:{
type:Boolean,
default:true,
},
})

app.post('/addproduct', async (req, res) => {
    let products = await product.find({});
    let id;
    if(products.length>0){
        let last_product_array=products.slice(-1);
        let last_product = last_product_array[0];
        id=last_product.id+1;
    }
    else{
        id=1;
    }
const Product = new product({
id:id,
name: req.body.name,
image: req.body.image,
category: req.body.category,
new_price: req.body.new_price,
old_price: req.body.old_price,
});
console.log(Product);
await Product.save();
console.log("saved");
res.json({
success: true,
name: req.body.name,
});
});

//creating API for deleting 
 app.post ('/removeproduct',async (req,res)=>{
    await product.findOneAndDelete({id:req.body.id});
    console.log("removed");
    res.json({
        success:true,
        name:req.body.name
    })
 })

 // creating API for Getting all products 
 app.get('/allproducts',async(req,res)=>{
    let products = await product.find({});
    console.log("Allproducts fetched");
    res.send(products);

 })

app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on port " + port);
    } else {
        console.log("Error: " + error);
    }
});