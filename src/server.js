const express = require('express');
const { PrismaClient } = require('@prisma/client');

const port = 3000;

const app = express();
const prisma = new PrismaClient()

app.use(express.json()) // for parsing application/json

// Create event endpoint
app.post('/events', async (req, res) => {
  const { title, description, date } = req.body;

  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
      },
    });

    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ error: "Boom!"});
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
