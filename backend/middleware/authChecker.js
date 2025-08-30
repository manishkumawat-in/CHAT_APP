import jwt from "jsonwebtoken";

const authChecker = (req, res, next) => {
    try {
        const token = req.cookies.token;
    
        if (!token) {
            return res.json({ success: false, message: "Unauthorized" });
        }
    
        const isVerified = jwt.verify(token, process.env.JWT_SECRET);
    
        if (isVerified.id) {
            req.userId = isVerified.id; 
        } else {
            return res.json({ success: false, message: "Unauthorized" });
        }
        
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default authChecker;