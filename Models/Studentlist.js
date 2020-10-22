const mongoose = require("mongoose");

const studentlistSchema = new mongoose.Schema({
    MaHocVien: String,
    Student_id: [{type: mongoose.Types.ObjectId}],    
});

module.exports = mongoose.model("Studentlist", studentlistSchema);
