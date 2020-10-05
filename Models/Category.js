const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: String,
    details_id: [{type: mongoose.Types.ObjectId}]
});

module.exports = mongoose.model("Category", categorySchema);