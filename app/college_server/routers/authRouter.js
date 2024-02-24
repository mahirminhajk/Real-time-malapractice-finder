import express, { json } from "express";
import User from "../models/User.js";
//* login
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

//* create a user
router.post('/register', verifyToken, async (req, res, next) => {
    try {

        const usernameExist = await User.findOne({ username: req.body.username });

        if (usernameExist) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);


        const newUser = new User({
            username: req.body.username,
            password: hashedPassword
        });

        const user = await newUser.save();
        res.status(200).json({
            _id: user._id,
            username: user.username
        });

    } catch (error) {
        console.log(error);
        next(error)
    }
});

//* login
router.post('/login', async (req, res, next) => {
    console.log('start');
    try {
        const user = await User.findOne({
            username: req.body.username
        });
        if (!user) return res.status(400).json({ message: 'User not found' });


        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '6h' });

        res
            .cookie('access_token', token, { httpOnly: false })
            .status(200)
            .json({ id: user._id, username: user.username });

    } catch (error) {
        console.log(error);
        next(error);
    }
});

export default router;

