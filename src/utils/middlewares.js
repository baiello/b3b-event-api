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

module.exports = {
  customLogMiddleware,
  validateEventInputsMiddleware,
}