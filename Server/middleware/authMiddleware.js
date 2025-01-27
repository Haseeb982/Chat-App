import jwt from "jsonwebtoken";


export const VerifyToken = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.decode(token);

    jwt.verify(token, process.env.JWT_SECRET, async (err, payLoad) => {
        if (err) {
            return res.status(401).json({ message: "token is not valid"});
        }        
        req.userID = payLoad.userID;
        next();
        });
    
    } catch (error) {
        console.log("error in verify token", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
