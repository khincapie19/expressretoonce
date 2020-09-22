const mongoose = require("mongoose");


const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    require: [true, "is required"]
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    require: [true, "is required"]
  },
  password: {
    type: String,
    required: [true, "is required"]
  }
});


module.exports = mongoose.model("User", schema);
