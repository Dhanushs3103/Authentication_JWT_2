// Packages
let jwt = require("jsonwebtoken");

// Local imports
let SECRET_KEY_1 = process.env.SECRET_KEY_1;
let BlackListedToken = require("../models/blacklistedToken.model.js")

// Auth middleware
async function authenticate(req, res, next) {
    try {
        // Extracting the token from req.headers
        let authHeader = req.headers.access_token;
        //checking if authHeaders are present
        if (!authHeader) {
            return res.status(401).send("Access_token header missing");
        }
        //checking if token is present
        let token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).send("Token not found");
        }
        
        // checking if the above token is blackListed or not
        let blackListedToken = await BlackListedToken.findOne({token});
        // if exits, sending res, as User logged out, please login
        if(blackListedToken) {
            return res.status(401).json({message:"User logged out, please login"})
        }
        

        // Verifying token
        jwt.verify(token, SECRET_KEY_1, function(err, decoded) {
            // Error handling
            if (err) {
                return res.status(401).send("User not authenticated, please login");
            }
            // If token is decoded - move forward
            if (decoded) {
                req.body.role = decoded.role;
                next(); 
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

function authorize(permittedRoles) {
    return async (req, res, next) => {
        try {
            //  checking if the user's role is present in the permitted roles
            if (permittedRoles.includes(req.body.role)) {
                next(); 
            } else {
                res.status(403).json({ message: "User not authorized to access this route" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };
}


module.exports = {authenticate,authorize};
