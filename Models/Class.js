const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
    Classname: String,
    Studytime: Date,
    Address: String,
    Lecturers_id: [{type: mongoose.Types.ObjectId}],
    Studentlist_id: [{type: mongoose.Types.ObjectId}],
    Transcript_id: [{type: mongoose.Types.ObjectId}],

});

module.exports = mongoose.model("Class", classSchema);
