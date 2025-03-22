import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    let token;

    // Check if token is in cookies
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    // Check if token is in Authorization header
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "unauthorized - no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "unauthorized - token verification failed" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in auth middleware", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// export const protectRoute = async (req, res, next) => {
//     try {
//         const token = req.cookies.jwt;

//         if(!token){
//             return res.status(401).json({message: "unauthorized - no token provider"});
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         if(!decoded){
//             return res.status(401).json({message: "unauthorized - token verification failed"});
//         }
//         const user = await User.findById(decoded.userId).select("-password");

//         if(!user){
//             return res.status(404).json({message: "User not found"});
//         }
//         req.user = user;

//         next();

//     } catch (error) {
//         console.log("Error in auth middleware", error.message);
//     }
// };