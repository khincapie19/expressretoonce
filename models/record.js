const mongoose = require("mongoose");

const RecordSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String
});
const Record = mongoose.model("Record", RecordSchema);
module.exports = Record;
