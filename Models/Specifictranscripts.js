const mongoose = require("mongoose");

const specifictranscriptsSchema = new mongoose.Schema({
    DiemCC: String,
    DiemGK: String,
    DiemCK: String,
    TongDiem: String,
    XepLoai: String
});

module.exports = mongoose.model("Specifictranscripts", specifictranscriptsSchema);
