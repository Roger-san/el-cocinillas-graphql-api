const mongoose = require("mongoose")

const Schema = mongoose.Schema

const catSchema = new Schema(
  {
    name: String,
    age: String
  },
  { versionKey: false }
)
module.exports = mongoose.model("Cat", catSchema)
