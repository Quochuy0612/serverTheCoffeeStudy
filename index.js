var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.set("views", "./Views");
app.use(express.static("Public"));
app.listen(3000);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//body-parse
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Admin:thecoffeestudy@cluster0.cfccb.mongodb.net/TheCoffeeStudy?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, function (err) {
    if (err) {
        console.log("Mongoodb connected error!!!")
    } else {
        console.log("Mongoodb connected seccessfully!!!")
    }
});

//bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

//jsonwebtoken
var jwt = require('jsonwebtoken');
var privateKey = "*(jkljA&(^312hj1ASJDgk1!!!!!@@";

//models
const User = require("./Models/User");
const Token = require("./Models/Token");
const Category = require("./Models/Category");
const Course = require("./Models/Course");

//session
var session = require('express-session');
app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    cookie: { maxAge: 60000000 }
}));

// routes
require("./routes/SanPham")(app, RandomString);
require("./routes/Blog")(app, RandomString);
require("./routes/KhoaHoc")(app, RandomString);

//User - Resgiter
app.post("/User/Register", function (req, res) {

    //Check Username or Email exist
    User.find({
        "$or": [{
            "Username": req.body.Username
        }, {
            "Email": req.body.Email
        }]
    }, function (err, data) {
        if (data.length == 0) {

            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(req.body.Password, salt, function (err2, hash) {
                    if (!err) {

                        var khachhang = new User({
                            Username: req.body.Username,
                            Password: hash,
                            Level: req.body.Level,
                            Active: false,
                            CodeActive: RandomString(30),
                            Group: req.body.Group,
                            RegisterDate: Date.now(),

                            Name: req.body.Name,
                            Email: req.body.Email,
                            Phone: req.body.Phone,
                            Address: req.body.Address
                        });
                        khachhang.save(function (err3) {
                            if (err3) {

                                // Gửi mail active
                                // http://locahost:3000/active/:CodeActive

                                res.json({ "kq": 0, "errMsg": err3 });
                            } else {
                                res.json({ "kq": 1 });
                            }
                        });

                    } else {
                        res.json({ "kq": 0, "errMsg": err2 });
                    }
                });
            });

        } else {
            res.json({ "kq": 0, "errMsg": "Username or Email is not availble" });
        }
    });

});

//Functions
function RandomString(dai) {

    var mang = ["a", "b", "c", "d", "e", "f", "g", "h", "j", "k", "m", "n", "p", "q", "r", "s", "y", "u", "v", "x", "y", "z", "w",
        "A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "M", "N", "P", "Q", "R", "S", "Y", "U", "V", "X", "Y", "Z", "W",
        "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    //[i, l, I, L, o, 0, O]

    var kq = "";
    for (var i = 0; i < dai; i++) {
        kq = kq + mang[Math.floor(Math.random() * mang.length)]
    }

    return kq;
};

//User - Active
app.get("/Active/:codeActive", function (req, res) {
    User.findOne({ CodeActive: req.params.codeActive }, function (err, data) {
        if (err) {
            res.json({ "kq": 0, "errMsg": err });
        } else {

            if (data.length == 0) {
                res.json({ "kq": 0, "errMsg": "Code không tồn tại." });
            } else {
                if (data.Active == false) {

                    User.findOneAndUpdate({ _id: data._id }, { Active: true }, function (err2) {
                        if (err2) {
                            res.json({ "kq": 0, "errMsg": err2 });
                        } else {
                            res.json({ "kq": 1 });
                        }
                    });

                } else {
                    res.json({ "kq": 0, "errMsg": "Code này đã được active rồi." });
                }
            }

        }
    });
});

app.get("/login", function (req, res) {
    res.render("Login");
});

//User - Login
app.post("/login", function (req, res) {

    //Find User có tồn tại không?
    User.findOne({ Username: req.body.Username }, function (err, data) {
        if (err) {
            res.json({ kq: 0, errMsg: err });
        } else {
            if (!data) {
                res.alert
                res.json({ kq: 0, errMsg: "Username này chưa đăng kí." });
            } else {

                // Check Active
                if (data.Active == false) {
                    res.json({ kq: 0, errMsg: "Username này chưa kích hoạt." });
                } else {
                    // Check Password
                    bcrypt.compare(req.body.Password, data.Password, function (err, resPw) {
                        if (err) {
                            res.json({ kq: 0, errMsg: err });
                        } else {
                            if (resPw === true) {

                                // Tao Token
                                jwt.sign({

                                    IdUser: data._id,
                                    Username: data.Username,
                                    Group: data.Group,
                                    RegisterDate: data.RegisterDate,
                                    HoTen: data.HoTen,
                                    Email: data.Email,
                                    SoDT: data.SoDT,
                                    DiaChi: data.DiaChi,
                                    RequestAgent: req.headers,
                                    CreatingDate: Date.now()

                                }, privateKey, { expiresIn: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30 * 2) }, function (err, token) {
                                    if (err) {
                                        res.json({ kq: 0, errMsg: err });
                                    } else {

                                        // New Token Collection
                                        var currenToken = new Token({
                                            Token: token,
                                            User: data._id,
                                            CreateDate: Date.now(),
                                            State: true
                                        });

                                        // Hủy tất cả Token cũ của User này
                                        Token.updateMany({ User: data._id }, { State: false }, function (err, data) {
                                            if (err) {
                                                res.json({ kq: 0, errMsg: err });
                                            } else {
                                                //Save newest Token
                                                currenToken.save(function (err) {
                                                    if (err) {
                                                        res.json({ kq: 0, errMsg: err });
                                                    } else {
                                                        req.session.token = token;
                                                        res.redirect("http://localhost:3000/Admin");
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });

                            } else {
                                res.json({ kq: 0, errMsg: "Sai Password." });
                            }
                        }
                    });
                }

            }
        }
    });
});

app.post("/logout1Token", function (req, res) {

    // Chỉ xóa 01 Token của thiết bị muốn log out
    Token.findOneAndUpdate({ Token: req.body.Token, State: true }, { State: false }, function (err) {
        if (err) {
            res.json({ kq: 0, errMsg: err });
        } else {
            res.json({ kq: 1, errMsg: "Logout 01 token successfully." });
        }
    });
});

app.post("/logoutAllTokens", function (req, res) {
    // Xóa tất cả token của _id đang logout
    Token.findOne({ Token: req.body.Token, State: true }, function (err, user) {
        Token.updateMany({ User: user.User }, { State: false }, function (err) {
            if (err) {
                res.json({ kq: 0, errMsg: err });
            } else {
                res.json({ kq: 1, errMsg: "Logout all tokens successfully." });
            }
        });
    });
});

app.get("/:p", function (req, res) {
    checkToken(req, res);
});


function checkToken(req, res) {
    if (req.session.token) {
        res.render("Home", { page: req.params.p });
    } else {
        res.send("you are not authorized");
    }
};

app.post("/dashboard", function (req, res) {
    /*
    if(UserAuthentication(req, res)){
        //XXX()
    }
    */
    UserAuthentication(req, res);
})

function SayHi(res) {
    res.json({ kq: 1 });
}

function UserAuthentication(request, response) {
    Token.find({ Token: request.headers.token, State: true }, function (err, data) {
        console.log(data.length);
        if (data.length == 0) {
            response.json({ kq: -1, errMsg: "Wrong token." });
            return false;
        } else {
            return SayHi(response);
        }
    });
}

