var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./Views");
app.use(express.static("Public"));
app.listen(3000);

//body-parse
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Admin:thecoffeestudy@cluster0.cfccb.mongodb.net/TheCoffeeStudy?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.log("Mongoodb connected error!!!")
    } else {
        console.log("Mongoodb connected seccessfully!!!")
    }
});

//multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        console.log(file);
        if (file.mimetype == "image/png" ||
            file.mimetype == "image/jpg") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("productImage");



//models
const Category = require("./Models/Category");
const Product = require("./Models/Details");


app.get("/", function (req, res) {
    res.render("Admin");
});

app.get("/Form", function (req, res) {
    res.render("Form");
});

app.post("/Form", function (req, res) {
    var newdetails = new Category({
        name: req.body.txtForm,
        details_id: []
    });
    newdetails.save(function (err) {
        if (err) {
            console.log("save details error: " + err);
            res.json({ kq: 0 });
        } else {
            console.log("save details seccessfully");
            res.json({ kq: 1 });
        }
    })
});

app.get("/product", function (req, res) {
    Category.find(function (err, items) {
        if (err) {
            res.send("Error");
        } else {
            console.log(items);
            res.render("Product", { pro: items });
        }
    })
});
app.post("/product", function (req, res) {
    //upload
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log("A Multer error occurred when uploading.");
            res.json({kq: 0, "err": err });
        } else if (err) {
            console.log("An unknown error occurred when uploading." + err);
            res.json({kq: 0, "err": err });
        } else {
            console.log("Upload is okay");
            console.log(req.file); // Thông tin file đã upload
            res.send({kq:1,"file": req.file});
        }
    });
});
