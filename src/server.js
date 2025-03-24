const express = require('express');
const { z } = require('zod');

const eventsController = require('./controllers/eventsController.js');
const { customLogMiddleware } = require('./utils/middlewares.js');

const port = 3000;

const app = express();


// Global middlewares
app.use(express.json()) // for parsing application/json
app.use(customLogMiddleware);


// Endpoints
app.use('/events', eventsController);


// Misc
app.use((err, req, res, next) => {
  if (err instanceof z.ZodError) {
    const errors = err.errors.map(item => ({
      input: item.path[0],
      message: item.message,
    }));

    return res.status(400).json({errors});
  }

  return res.status(500).send('Something broke very hard!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
