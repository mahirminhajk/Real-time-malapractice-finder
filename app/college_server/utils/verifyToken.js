import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


export const verifyToken = (req, res, next) => {
    //* token

    console.log(req.cookies)

    const token = req.cookies.access_token
    if (!token) return next(createErr(401, "Access denied"))

    //* verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(new Error('Invalid token'))
        req.user = user
        next();
    });
};