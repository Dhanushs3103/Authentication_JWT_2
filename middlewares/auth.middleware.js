// Packages
let jwt = require("jsonwebtoken");

// Local imports
let SECRET_KEY_1 = process.env.SECRET_KEY_1;

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

        // Verifying token
        jwt.verify(token, SECRET_KEY_1, function(err, decoded) {
            // Error handling
            if (err) {
                return res.status(401).send("User not authenticated, please login");
            }
            // If token is decoded - move forward
            if (decoded) {
                next(); 
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
}

module.exports = authenticate;
