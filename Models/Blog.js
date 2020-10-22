const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    Title: String,
    Datecreated: Date,
    Image: String,
    Content: String,
});

module.exports = mongoose.model("Blog", blogSchema);
