const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if(token) {
    jwt.verify(token, 'secret', (error, decodedToken) => {
      if(error) {
        res.status(401).json({ you: "shall not pass!" });
      }
      else {
        req.jwt = decodedToken;

        next();
      }
    })
  }
  else {
    res.status(401).json({ message: "Provide the authorization" });
  }
};
