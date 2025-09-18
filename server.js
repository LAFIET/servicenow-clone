const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// Load tickets from file or initialize empty
let tickets = [];
const dataFile = 'tickets.json';

if (fs.existsSync(dataFile)) {
  tickets = JSON.parse(fs.readFileSync(dataFile));
}

// Create a new ticket
app.post('/ticket', (req, res) => {
  const { type, description } = req.body;
  const ticket = {
    id: tickets.length + 1,
    type,
    description,
    assignedTo: autoAssignTeam(type),
    status: 'Open',
    createdAt: new Date().toISOString(),
  };
  tickets.push(ticket);
  fs.writeFileSync(dataFile, JSON.stringify(tickets, null, 2));
  res.status(201).json(ticket);
});

// View all tickets
app.get('/tickets', (req, res) => {
  res.json(tickets);
});

// Auto assign team based on type
function autoAssignTeam(type) {
  switch (type.toLowerCase()) {
    case 'incident': return 'Incident Response Team';
    case 'change': return 'Change Management Team';
    default: return 'Service Desk Team';
  }
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`ITSM Automation running on http://localhost:${PORT}`);
});
