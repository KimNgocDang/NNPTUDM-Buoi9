module.exports = (req, res, next) => {
  const jwt = require("jsonwebtoken");

  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), "secret");

    req.user = decoded; 

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};