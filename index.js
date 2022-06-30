const express = require("express");
const cors = require('cors')
const connectTOMongo = require("./db");
var jwt = require('jsonwebtoken');
const User = require("./models/User");
const { body, validationResult } = require('express-validator');

const app = express()
app.use(cors())
app.use(express.json());
connectTOMongo()
const JWT_SECRET = "secretforpractise"


app.get("/", (req, res) => {
    res.send("hello")
});

// app.get("/users", (req, res) => {
//     users = ["pavan", "pranay", "priya", "mohit", "purva"]
//     res.send({ users: users })
// });

app.post("/create_user", [
    body('name').isLength({min:3}),
    body('surname').isLength({min:3}),
    body('age').isInt(),
    body('email').isEmail(),
    body('username').isLength({min:6}),
    body('password').isAlphanumeric().isLength({min:6}),
    ], async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors : errors.array()});
        }else{
            const newUser = new User(req.body)
            newUser.save()
            const data = {
                user: {
                    id: newUser.id
                }
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            res.json(authToken)
        }

    } catch (error) {
        res.send({ message: error })
    }
})

app.post("/login_user",[
    body('username').isAlphanumeric(),
    body('password').isAlphanumeric().isLength({min:6}),
    ], async (req, res) => {
    const { username, password } = await req.body;
    try {
        let user = await User.findOne({ username });
        if (!user || !(password == user.password)) {
            return res.json({ "message": "Try to login with correct credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json(authToken)

    } catch (error) {
        res.send({ message: error })
    }
})

app.listen(5000, () => {
    console.log("listening")
});