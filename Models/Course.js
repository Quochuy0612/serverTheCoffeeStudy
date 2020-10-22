const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    Coursename: String,
    Class_id: [{type: mongoose.Types.ObjectId}],
    Tuition: String,
    Starttime: Date,
    Endtime: Date,
});

module.exports = mongoose.model("Course", courseSchema);
