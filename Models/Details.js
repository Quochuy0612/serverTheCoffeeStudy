const mongoose = require("mongoose");

const detailSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    detail: String
});

module.exports = mongoose.model("Detail", detailSchema);