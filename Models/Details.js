const mongoose = require("mongoose");

const detailSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: String,
    detail: String
});

module.exports = mongoose.model("Detail", detailSchema);