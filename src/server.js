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
});

// List all events
app.get('/events', async (req, res) => {
  try {
    const events = await prisma.event.findMany();
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json({ error: "Boom!"});
  }
});

// Get one event details
app.get('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await prisma.event.findUnique({
      where: {
        id: parseInt(id),
      }
    });

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ error: "Boom!"});
  }
});

// Update one event
app.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, date } = req.body;

  try {
    const event = await prisma.event.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title: title,
        description: description,
        date: new Date(date),
      },
    });

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ error: "Boom!"});
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})
