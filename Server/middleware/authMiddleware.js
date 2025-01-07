import jwt from "jsonwebtoken";


export const VerifyToken = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log("token in verify token", token);
    if (!token) {
        console.log("token not found in verify token");
        return res.status(401).json({ message: "Unauthorized" });
    }
    const decodedToken = jwt.decode(token);
    console.log("decoded token in verify token", decodedToken);

    jwt.verify(token, process.env.JWT_SECRET, async (err, payLoad) => {
        if (err) {
            console.log("token is not valid in verify token");
            return res.status(401).json({ message: "token is not valid"});
        }
        console.log("token is valid in verify token");
        req.userID = payLoad.userID;
        console.log(req.userID)
        next();
        });
    
    } catch (error) {
        console.log("error in verify token", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
