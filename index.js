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

//models
const Category = require("./Models/Category");
const Product = require("./Models/Details");
const { JsonWebTokenError } = require("jsonwebtoken");

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
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/jpg") {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("productImage");






app.get("/", function (req, res) {
    res.render("Admin");
});

app.get("/login", function (req, res) {
    res.render("Login");
});

app.get("/cate", function (req, res) {
    res.render("cate");
});

app.post("/cate", function (req, res) {
    var newdetails = new Category({
        name: req.body.txtCate,
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
            res.json({ kq: 0, "err": err });
        } else if (err) {
            console.log("An unknown error occurred when uploading." + err);
            res.json({ kq: 0, "err": err });
        } else {
            console.log("Upload is okay");
            console.log(req.file); // Thông tin file đã upload
            console.log(req.file.filename);
            res.send({ kq: 1, "file": req.file });
        }
    });

    //save
    var newproduct = new Product({
        name: req.body.txtName,
        image: req.file.filename,
        price: req.body.price,
        detail: req.body.txtproduct
    });
    res.json(newproduct);
    // newproduct.save(function (err) {
    //     if (err) {
    //         res.json({ kq: 0,"err":"error save book" });
    //     } else {
    //        Category.findOneAndUpdate(
    //            {_id:req.body.selectproduct},
    //            { $push: {details_id:newproduct._id} },
    //            function(err){
    //             if (err) {
    //                 res.json({ kq: 0, "err":err });
    //             }else{
    //                 res.json({ kq: 1});
    //             }
    //        });
    //     }
    // });
});


















































// app.post("/login", function (req, res) {
//     //Login
//     User.findOne({username:req.body.txtUsertname}, function(err, item){
//         if(!err & item != null){
//             console.log("pw " + req.body.txtPassword + "....." + item.password);
//             bcrypt.compare(req.body.txtPassword, item.password, function(err2, res2){
//                 if(res2 == false){
//                     res.json({kq:0, err: "wrong password"});
//                 }else{
//                     jwt.sign(item.toJSON(), secret, {expiresIn: '168h'}, function(err, token){
//                         if(err){
//                             res.json({kq:0, err:"Token generate error: " + err});
//                         }else{
//                             req.session.token = token;
//                             res.json({token:token});
//                         }
//                     });
//                 }
//             });
//         }else{
//             res.json({kq:0, err: " Wrong username"});
//         }
//     });
// });

// app.get("/", function(req, res){
//     checkToken(req, res);
// });

// function checkToken(req, res){
//     if(req.session.token){
//         jwt.verify(req.session.token, secret, function(err, decoded){
//             if(err){
//                 res.send("Wrong verify!!!");
//             }else{
//                 res.json(decoded);
//             }
//         })
//     }   
// }