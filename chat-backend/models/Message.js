const mongoose = require("mongoose");
const schema = new mongoose.Schema({ from:String, to:String, message:String }, { timestamps:true });
module.exports = mongoose.model("Message", schema);