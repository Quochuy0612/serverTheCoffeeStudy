
const Category = require("../Models/Category");
const Product = require("../Models/Details");

//multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload_images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // console.log(file);
        if (file.mimetype == "image/bmp" ||
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true)
        } else {
            return cb(new Error('Only image are allowed!'))
        }
    }
}).single("productImage");

//method post
module.exports = function (app, RandomString) {

    //thêm danh mục
    app.post("/formCoffee_pros", function (req, res) {
        var newdetails = new Category({
            name: req.body.txtCate,
            details_id: []
        });
        newdetails.save(function (err) {
            if (err) {
                res.json({ kq: 0, errMsg: err });
            } else {

                //Lay DS dang co
                Category.find(function (err, data) {
                    if (err) {
                        res.json({ kq: 0, errMsg: err });
                    } else {
                        res.json({ kq: 1, products: data });
                    }
                });

            }
        });
    });
    app.get("/formCoffee_pros", function (req, res) {
        if (err) {
            res.json({ kq: 0, errMsg: err });
        } else {
            res.render("Home", { page: "formCoffee" });
        }
    });

    app.get("/formCoffee", function (req, res) {
        Category.find(function (err, dataStudy) {
            if (err) {
                res.json({ kq: 0, errMsg: err });
            } else {
                res.render("Home", { page: "formCoffee", products: dataStudy });
            }
        });
    });

    //thêm sản phẩm
    app.post("/formCoffee_pro", function (req, res) {
        //upload
        upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                console.log("A Multer error occurred when uploading.");
                res.json({ kq: 0, "err": err });
            } else if (err) {
                console.log("An unknown error occurred when uploading." + err);
                res.json({ kq: 0, "err": err });
            } else {

                //save
                var newproduct = new Product({
                    name: req.body.txtNameProduct,
                    image: req.file.filename,
                    price: req.body.price,
                    detail: req.body.txtproduct
                });
                newproduct.save(function (err) {
                    if (err) {
                        res.json({ kq: 0, "err": "error save product" });
                    } else {
                        Category.findOneAndUpdate(
                            { _id: req.body.selectproduct },
                            { $push: { details_id: newproduct._id } },
                            function (err) {
                                if (err) {
                                    res.json({ kq: 0, "err": err });
                                } else {
                                    res.json({ kq: 1 });
                                }
                            }
                        );
                    }
                });
            }
        });
    });
}

