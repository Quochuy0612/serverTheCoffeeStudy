
const Blog = require("../Models/Blog");


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
}).single("blogImage");

//method post
module.exports = function (app, RandomString) {

    //thêm blog
    app.post("/formBlog", function (req, res) {
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
                var newblog = new Blog({
                    Title: req.body.Title,
                    Datecreated: req.body.Datecreated,
                    Image: req.file.filename,
                    Content: req.body.Content,  
                });
                newblog.save(function (err) {
                    if (err) {
                        res.json({ kq: 0, errMsg: err });
                    } else {
                        res.redirect("http://localhost:3000/formBlog");
                    }
                });
            }
        });
    });
}

