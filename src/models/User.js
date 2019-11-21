let mongoose = require("mongoose")
let bcrypt = require("bcryptjs")

let userSchema =  new mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true}
})

userSchema.methods.encryptPassword = async (password) => {
  let salt = await bcrypt.genSalt(10);
  let hash = bcrypt.hash(password, salt);
  return hash;
};

userSchema.methods.matchPassword = async function (password)  {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User" ,userSchema)
