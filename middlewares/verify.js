const jwt = require("jsonwebtoken");

// used to verify JWT tokens in incoming requests and protect routes
const verify = (req, res, next) => {
  // Get token from Authorization header (format: Bearer <token>)
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key"
    );
    // attach decoded user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = verify;
