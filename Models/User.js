const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    Username: String,
    Password: String,
    Level: Number,
    Active: Boolean,
    CodeActive: String,
    Group: Number,
    RegisterDate: Date,

    Name: String,
    Email: String,
    Phone: String,
    Address: String
});

module.exports = mongoose.model("User", userSchema);
