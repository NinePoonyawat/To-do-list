const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    require: [true, "Please add a card ID"],
  },
  name: {
    type: String,
    require: [true, "Please add a name"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9\s]+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  status: {
    type: String,
    enum: ["to-do", "on progress", "done"],
    require: [true],
  },
  description: {
    type: String,
    require: [true, "Please add a description"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9\s]+$/.test(v); // Only allows text, numbers, and spaces
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
});

module.exports = mongoose.model("Card", CardSchema);
