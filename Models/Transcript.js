const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
    Classname: String,
    Student_id: [{type: mongoose.Types.ObjectId}],
    Specifictranscripts_id: [{type: mongoose.Types.ObjectId}],
});

module.exports = mongoose.model("Transcript", transcriptSchema);
