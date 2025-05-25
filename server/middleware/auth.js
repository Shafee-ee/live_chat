// Middleware to protect routes

import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {

        //remove chat gpt
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.json({ success: false, message: "Unauthorized: No token provided" });
        }
        //remove chat gpt


        // const token = req.headers.token;

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        req.user = user;
        next();
    }
    catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message })

    }
}