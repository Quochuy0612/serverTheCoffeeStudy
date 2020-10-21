
const Category = require("../Models/Category");
const Product = require("../Models/Details");

//multer
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload_imagges')
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
                // console.log("Upload is okay");
                // console.log(req.file.filename); // Thông tin file đã upload
                //res.send({ kq: 1, "file": req.file.filename });

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

