const mongoose = require("mongoose")
const User = new mongoose.Schema({
    name: String,
    surname: String,
    email:String,
    age: Number,
    username: String,
    password: String,
    role: { type: String, default: 'user' },
})
module.exports = mongoose.model('user', User)