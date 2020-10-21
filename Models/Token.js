const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    Token       : String,
    User        : mongoose.Schema.Types.ObjectId,
    CreateDate  : Date,
    State       : Boolean
});

module.exports = mongoose.model("Token", tokenSchema);