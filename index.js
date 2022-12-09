const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));
morgan.token("body", (request, response) => JSON.stringify(request.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const information = `Phone book has info for ${persons.length} people.`;
  const date = new Date().toString();
  const responseHtml = `
    <div>${information}</div>
    <br>
    <div>${date}</div>
  `;
  response.send(responseHtml);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.post("/api/persons", (request, response) => {
  const newId = Math.floor(Math.random() * 125);
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "Please include both name and number.",
    });
  } else if (
    persons.find(
      (person) => person.name.toLowerCase() === body.name.toLowerCase()
    )
  ) {
    return response.status(400).json({
      error: "Name already exists.",
    });
  }

  const newPerson = { ...body, id: newId };
  console.log("newPerson", newPerson);
  persons.push(newPerson);
  response.json(newPerson);
});

app.get("/api/persons/:id", (request, response) => {
  const requestId = Number(request.params.id);
  const person = persons.find((person) => person.id === requestId);
  if (!person) {
    response.status(404).end();
  } else {
    response.json(person);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const requestId = Number(request.params.id);
  persons = persons.filter((person) => person.id !== requestId);
  response.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
