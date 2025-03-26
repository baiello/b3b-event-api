const jwt = require('jsonwebtoken');
const { z } = require('zod');

const Event = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.string().datetime({ local: true }),
}).required();

function customLogMiddleware(req, res, next) {
  const requestDateTime = new Date();

  res.on('finish', () => {
    const requestTreatmentTime = new Date() - requestDateTime;
    console.log(`[${requestDateTime.toISOString()}] ${req.method} ${req.path} - ${requestTreatmentTime}ms`);
  });

  next();
}

function validateEventInputsMiddleware(req, res, next) {
  Event.parse(req.body);
  next();
}

function authMiddleware(req, res, next) {
  try {
    // If no authorization header
    if (!req.headers.authorization) { throw new Error(); }

    // If token has wrong format
    const authorizationHeader = req.headers.authorization.split(' ');
    if (authorizationHeader[0] !== 'Bearer') { throw new Error(); }

    // Extract token from authorization header
    let tokenDecoded = {};
    jwt.verify(authorizationHeader[1], process.env.JWT_SECRET, (err, decoded) => {
      if (err) { throw new Error(); }
      tokenDecoded = decoded;
    });

    // Record the user id in request for future use
    req.user = tokenDecoded.id;
  } catch (error) {
    res.status(401);
    next(error);
  }

  next();
}

module.exports = {
  authMiddleware,
  customLogMiddleware,
  validateEventInputsMiddleware,
}