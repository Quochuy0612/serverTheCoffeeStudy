
const Course = require("../Models/Course");
const Class = require("../Models/Class");
const Studentlist = require("../Models/Studentlist");
const Transcript = require("../Models/Transcript");
const Specifictranscripts = require("../Models/Specifictranscripts");
const User = require("../Models/User");

//method post
module.exports = function (app, RandomString) {

    //thêm khóa học
    app.post("/formStudy_ADD_Course", function (req, res) {
        var newcourse = new Course({
            Coursename: req.body.Coursename,
            Class_id: [],
            Tuition: req.body.Tuition,
            Starttime: req.body.Starttime,
            Endtime: req.body.Endtime,
        });
        newcourse.save(function (err) {
            if (err) {
                res.json({ kq: 0, errMsg: err });
            } else {
                res.json({ kq: 1, Course: data });
                
            }
        });
    });

    app.get("/formStudy", function (req, res) {
        Course.find(function (err, dataStudy) {
            if (err) {
                res.json({ kq: 0, errMsg: err });
            } else {
                res.render("Home", { page: "formStudy", Courses: dataStudy});
            }
        });
    });
    //thêm lớp học
    app.post("/formStudy_ADD_Class", function (req, res) {
        //save
        var newclass = new Class({
            Classname: req.body.Classname,
            Studytime: req.body.Studytime,
            Address: req.body.Address,
            Lecturers_id: [],
            Studentlist_id: [],
            Transcript_id: [],
        });
        newclass.save(function (err) {
            if (err) {
                res.json({ kq: 0, "err": "error save product" });
            } else {
                Course.findOneAndUpdate(
                    { _id: req.body.selectCourse },
                    { $push: { Class_id: newclass._id } },
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
    });

    //thêm bảng điểm
    app.post("/formStudy_ADD_Transcript ", function (req, res) {
        //save
        var newclass = new Class({
            name: req.body.txtNameProduct,
            image: req.file.filename,
            price: req.body.price,
            detail: req.body.txtproduct
        });
        newclass.save(function (err) {
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
    });
}

